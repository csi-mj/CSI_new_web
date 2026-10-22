'use client';

/**
 * Send queue — the orchestrator the review/send screen drives.
 *
 * Per recipient (sequential, resumable, cancellable):
 *   1. render if missing/stale (renderAndUpload)
 *   2. POST /api/admin/ecert/recipients/:id/send — the server double-guards
 *      (no double send, staleness). 429 from Brevo gets ONE backoff retry.
 *   3. live row-level feedback → the table updates in real time; a final
 *      report lists every success + every failure verbatim.
 *
 * Rows already `sent` are skipped — closing the browser mid-run and resuming
 * produces exactly-once sends.
 */
import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { CertDoc, EcertFormat, EcertRecipient, EcertTemplate } from '@/lib/ecert/types';
import { mergeLayers } from '@/lib/ecert/types';
import { createRendererFor, needsRender, renderAndUpload, warmRendererFonts, resolveLayerText } from '@/lib/ecert/renderQueue';

export interface SendProgress {
  running: boolean;
  done: number;
  total: number;
  failed: number;
  skipped: number;
  current?: { name: string; email: string; stage: 'render' | 'send' };
}

export interface SendRowOutcome {
  recipientId: string;
  name: string;
  email: string;
  status: 'sent' | 'failed' | 'skipped' | 'rendered-failed';
  message?: string;
  sendCount?: number;
  error?: string;
}

const SEND_GAP_MS = 400;
const BACKOFF_MS = 2000;

export function useCertSendQueue() {
  const qc = useQueryClient();
  const [progress, setProgress] = useState<SendProgress>({ running: false, done: 0, total: 0, failed: 0, skipped: 0 });
  const cancelRef = useRef(false);
  const runningRef = useRef(false);

  const cancel = useCallback(() => {
    cancelRef.current = true;
  }, []);

  const start = useCallback(
    async (opts: {
      template: EcertTemplate;
      doc: CertDoc;
      recipients: EcertRecipient[];
      format: EcertFormat;
      forceSent?: boolean;
      onRow?: (recipientId: string, patch: Partial<EcertRecipient>) => void;
    }): Promise<SendRowOutcome[]> => {
      if (runningRef.current) throw new Error('A send run is already in progress');
      runningRef.current = true;
      cancelRef.current = false;

      const { template, doc, recipients, format, forceSent = false, onRow } = opts;
      const pending = recipients.filter((r) => r.email && (forceSent ? true : r.email_status !== 'sent'));

      const outcomes: SendRowOutcome[] = [];
      setProgress({ running: true, done: 0, total: pending.length, failed: 0, skipped: 0 });

      const patchRow = (recipientId: string, patch: Partial<EcertRecipient>) => {
        onRow?.(recipientId, patch);
        // keep react-query cache consistent for other views of the same list
        qc.setQueryData<EcertRecipient[]>(['ecert-recipients', template.id], (old) =>
          (old ?? []).map((r) => (r.id === recipientId ? { ...r, ...patch } as EcertRecipient : r))
        );
      };

      try {
        const { missing = [] } = await warmRendererFonts(doc);
        if (missing.length) {
          console.warn('[ecert] fonts failed to load (fallback used):', missing);
        }

        const renderer = await createRendererFor(template);

        try {
          for (let i = 0; i < pending.length; i++) {
            if (cancelRef.current) {
              for (const r of pending.slice(i)) {
                outcomes.push({ recipientId: r.id, name: r.name, email: r.email, status: 'skipped', error: 'Run cancelled' });
              }
              setProgress((p) => ({ ...p, running: false, skipped: p.skipped + (pending.length - i), current: undefined }));
              break;
            }
            const r = pending[i];
            const name = r.name || r.email.split('@')[0];
            setProgress((p) => ({ ...p, current: { name, email: r.email, stage: 'render' } }));

            // ---------- STAGE 1: render (own try — render errors stay render errors) ----------
            try {
              if (needsRender(r, template)) {
                const { url, path } = await renderAndUpload(renderer, doc, template, r, format);
                patchRow(r.id, {
                  render_status: 'rendered',
                  rendered_url: url,
                  rendered_path: path,
                  rendered_fingerprint: template.layers_fingerprint,
                  render_error: null
                });
                r.rendered_url = url;
                r.rendered_path = path;
                r.render_status = 'rendered';
                r.rendered_fingerprint = template.layers_fingerprint;
              }
            } catch (renderErr) {
              const msg = renderErr instanceof Error ? renderErr.message : 'Unknown error';
              patchRow(r.id, { render_status: 'failed', render_error: msg });
              outcomes.push({ recipientId: r.id, name, email: r.email, status: 'rendered-failed', error: msg });
              setProgress((p) => ({ ...p, done: p.done + 1, failed: p.failed + 1, current: undefined }));
              if (i < pending.length - 1 && !cancelRef.current) await sleep(SEND_GAP_MS);
              continue;
            }

            // ---------- STAGE 2: send (with one self-heal retry) ----------
            setProgress((p) => ({ ...p, current: { name, email: r.email, stage: 'send' } }));

            const attemptSend = async () => {
              const res = await fetch(`/api/admin/ecert/recipients/${r.id}/send${forceSent ? '?force=1' : ''}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
              });
              const info = await res.json().catch(() => null);
              return { res, info } as { res: Response; info: { error?: { code?: string; message?: string }; data?: { send_count?: number } } | null };
            };

            /** Classifies one send response: success / skip / backoff-retry / failure. */
            const handleSendResponse = async (res: Response, info: { error?: { code?: string; message?: string }; data?: { send_count?: number } } | null) => {
              if (res.status === 409) {
                const code = info?.error?.code;
                if (code === 'ALREADY_SENT') {
                  patchRow(r.id, { email_status: 'sent' });
                  outcomes.push({ recipientId: r.id, name, email: r.email, status: 'skipped', message: 'Already sent earlier' });
                } else {
                  const msg = info?.error?.message ?? 'Stale render';
                  patchRow(r.id, { email_status: 'failed', email_error: msg });
                  outcomes.push({ recipientId: r.id, name, email: r.email, status: 'failed', error: msg });
                  setProgress((p) => ({ ...p, failed: p.failed + 1 }));
                }
                return;
              }

              if (res.status === 429) {
                // one polite backoff, then a single retry
                await sleep(BACKOFF_MS);
                const retry = await attemptSend();
                const rInfo = retry.info;
                if (retry.res.ok) {
                  const sendCount = rInfo?.data?.send_count ?? (r.send_count ?? 0) + 1;
                  patchRow(r.id, { email_status: 'sent', email_error: null, send_count: sendCount });
                  outcomes.push({ recipientId: r.id, name, email: r.email, status: 'sent', sendCount, message: 'Sent successfully' });
                } else {
                  const msg = rInfo?.error?.message ?? `HTTP ${retry.res.status}`;
                  patchRow(r.id, { email_status: 'failed', email_error: msg });
                  outcomes.push({ recipientId: r.id, name, email: r.email, status: 'failed', error: msg });
                  setProgress((p) => ({ ...p, failed: p.failed + 1 }));
                }
                return;
              }

              if (!res.ok) {
                const msg = info?.error?.message ?? `HTTP ${res.status}`;
                patchRow(r.id, { email_status: 'failed', email_error: msg });
                outcomes.push({ recipientId: r.id, name, email: r.email, status: 'failed', error: msg });
                setProgress((p) => ({ ...p, failed: p.failed + 1 }));
                return;
              }

              const sendCount = info?.data?.send_count ?? (r.send_count ?? 0) + 1;
              patchRow(r.id, { email_status: 'sent', email_error: null, send_count: sendCount });
              outcomes.push({ recipientId: r.id, name, email: r.email, status: 'sent', sendCount, message: 'Sent successfully' });
            };

            try {
              const first = await attemptSend();

              // Self-heal: the DB row render state doesn't match what we saw
              // client-side (reset by another save / another session etc.) —
              // render this row NOW and retry once instead of failing.
              const code = first.info?.error?.code;
              if ((first.res.status === 400 || first.res.status === 409) && (code === 'NOT_RENDERED' || code === 'STALE_RENDER')) {
                setProgress((p) => ({ ...p, current: { name, email: r.email, stage: 'render' } }));
                const { url, path } = await renderAndUpload(renderer, doc, template, r, format);
                patchRow(r.id, {
                  render_status: 'rendered',
                  rendered_url: url,
                  rendered_path: path,
                  rendered_fingerprint: template.layers_fingerprint,
                  render_error: null
                });
                r.rendered_url = url;
                r.rendered_path = path;
                r.rendered_fingerprint = template.layers_fingerprint;
                setProgress((p) => ({ ...p, current: { name, email: r.email, stage: 'send' } }));
                const second = await attemptSend();
                handleSendResponse(second.res, second.info);
              } else {
                handleSendResponse(first.res, first.info);
              }
            } catch (sendErr) {
              const msg = sendErr instanceof Error ? sendErr.message : 'Unknown error';
              patchRow(r.id, { email_status: 'failed', email_error: msg });
              outcomes.push({ recipientId: r.id, name, email: r.email, status: 'failed', error: msg });
              setProgress((p) => ({ ...p, failed: p.failed + 1 }));
            }

            setProgress((p) => ({ ...p, done: p.done + 1, current: undefined }));

            // gentle gap (Brevo rate limits are per-minute)
            if (i < pending.length - 1 && !cancelRef.current) await sleep(SEND_GAP_MS);
          }
        } finally {
          await renderer.dispose().catch(() => undefined);
        }
      } finally {
        runningRef.current = false;
        setProgress((p) => ({ ...p, running: false, current: undefined }));
        void qc.invalidateQueries({ queryKey: ['ecert-templates'] });
      }

      return outcomes;
    },
    [qc]
  );

  return { progress, start, cancel };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Small utility used by previews too. */
export function previewResolve(doc: CertDoc, recipient: EcertRecipient | null) {
  return (layer: Parameters<typeof resolveLayerText>[0]) => resolveLayerText(layer, recipient);
}

export function mergedLayers(doc: CertDoc, recipient: EcertRecipient | null) {
  return mergeLayers(doc.layers ?? [], recipient?.overrides ?? null);
}