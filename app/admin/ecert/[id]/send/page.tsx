'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle, ArrowLeft, CheckCircle2, Download, Eye, ImageOff, Loader2, Mail, MailCheck, RotateCcw, Send, XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Button, Modal, inputCls, useConfirm, api } from '@/app/admin/_components/ui';
import { DataBoundary } from '@/components/ui/data-boundary';
import { useEcertRecipients, useEcertTemplate, useRecipientMutations, useTemplateMutations } from '../../hooks/useEcert';
import { parseDoc, mergeLayers, type CertDoc, type EcertFormat, type EcertRecipient, type EcertTemplate } from '@/lib/ecert/types';
import { rowValue } from '@/lib/ecert/renderQueue';
import { renderThumb, disposeThumbs, thumbFor } from '@/lib/ecert/thumbs';
import { useCertSendQueue, type SendRowOutcome } from '../../hooks/useCertSendQueue';
import EmailComposer from './_components/EmailComposer';
import ImportPanel from './_components/ImportPanel';
import { downloadCertificateFile, downloadCertificatesZip, type DownloadProgress } from '@/lib/ecert/downloads';
import type { TokenContext } from '@/lib/ecert/tokens';

/* =====================================================================
 * Review & Send — per-certificate previews + issues + individual / bulk
 * Brevo email with the certificate attached and a full results log.
 * ===================================================================== */

export default function EcertSendPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    void params.then((p) => setId(p.id));
  }, [params]);

  const { data, isLoading, isError, refetch } = useEcertTemplate(id);
  const template = data?.template;

  return (
    <DataBoundary
      isLoading={!id || isLoading}
      isError={isError}
      isEmpty={!isLoading && !template}
      onRetry={() => void refetch()}
      emptyTitle="Template not found"
    >
      {template && id && (
        <SendScreen template={template} onDone={() => router.push('/admin/ecert')} />
      )}
    </DataBoundary>
  );
}

function SendScreen({ template, onDone }: { template: EcertTemplate; onDone: () => void }) {
  const doc: CertDoc = useMemo(() => {
    const parsed = parseDoc((template as unknown as { layers: unknown }).layers);
    return { ...parsed, canvas: parsed.canvas?.width ? parsed.canvas : { width: template.width, height: template.height } };
  }, [template]);

  const recipients = useEcertRecipients(template.id);
  const rows = recipients.data ?? [];
  const { updateRecipient, importRows } = useRecipientMutations(template.id);
  const { update } = useTemplateMutations();
  const { confirmDlg, dialog } = useConfirm();
  const sendQueue = useCertSendQueue();

  const [format, setFormat] = useState<EcertFormat>(template.format);
  const [subject, setSubject] = useState(template.email_subject ?? 'Your e-certificate');
  const [body, setBody] = useState(template.email_body ?? '');
  const [savingEmail, setSavingEmail] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [doubleConfirm, setDoubleConfirm] = useState(false);
  const [typeCount, setTypeCount] = useState('');
  const [results, setResults] = useState<SendRowOutcome[] | null>(null);
  const [deliveryReport, setDeliveryReport] = useState<DeliveryReport | null>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  const [zipProgress, setZipProgress] = useState<DownloadProgress | null>(null);

  async function downloadZip() {
    if (zipProgress) return;
    const withEmail = rows.filter((r) => r.email);
    if (!withEmail.length) {
      toast.error('No recipients to download');
      return;
    }
    try {
      setZipProgress({
        done: 0,
        total: withEmail.length,
        failed: [],
        current: { name: withEmail[0].name || withEmail[0].email }
      });
      const result = await downloadCertificatesZip(
        template,
        doc,
        withEmail,
        (p) => setZipProgress({ ...p })
      );
      setZipProgress(null);
      if (result.failed.length) {
        toast.error(`ZIP ready — ${result.failed.length} certificate(s) failed: ${result.failed[0].error}`);
      } else {
        toast.success(`${result.done} certificate(s) downloaded`);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'ZIP download failed');
      setZipProgress(null);
    }
  }

  async function checkDelivery() {
    try {
      setCheckingDelivery(true);
      const json = await api(`/api/admin/ecert/templates/${template.id}/delivery-check`, 'POST');
      setDeliveryReport(json?.data ?? null);
      await recipients.refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Delivery check failed');
    } finally {
      setCheckingDelivery(false);
    }
  }
  const [showImport, setShowImport] = useState(rows.length === 0);

  const variableLayers = useMemo(() => doc.layers.filter((l) => l.type === 'text' && l.mode === 'variable'), [doc]);

  /* per-row issues */
  const issuesById = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const r of rows) {
      const issues: string[] = [];
      if (!r.email || !r.email.includes('@')) issues.push('No valid email');
      if (r.render_status === 'failed' && r.render_error) issues.push(`Render failed: ${r.render_error}`);
      if (r.render_status === 'pending' || (r.render_status === 'rendered' && r.rendered_fingerprint !== template.layers_fingerprint)) {
        issues.push('Render pending/outdated');
      }
      for (const vl of variableLayers) {
        const value = rowValue(r.row_data ?? {}, vl.variable ?? '');
        if (!value) issues.push(`No value for {${vl.variable}}`);
      }
      if (r.email_status === 'sent') issues.push('Already sent');
      map.set(r.id, issues);
    }
    return map;
  }, [rows, template.layers_fingerprint, variableLayers]);

  useEffect(() => () => void disposeThumbs(), []);
  const rowEvents = useRef(new Map<string, (patch: Partial<EcertRecipient>) => void>());

  /* bulk send */
  const beginRun = async () => {
    if (!template) return;
    const targets = rows.filter((r) => r.email && r.email_status !== 'sent');
    if (!targets.length) {
      toast.error('No recipients to send to');
      return;
    }
    // persist current email content before the run
    if (subject !== template.email_subject || body !== template.email_body) {
      await saveEmailNow();
    }
    await update.mutateAsync({ id: template.id, patch: { format, status: 'ready' } });
    const outcomes = await sendQueue.start({
      template,
      doc,
      recipients: targets,
      format,
      onRow: (recipientId, patch) => rowEvents.current.get(recipientId)?.(patch)
    });
    setResults(outcomes);
  };

  const saveEmailNow = async () => {
    try {
      setSavingEmail(true);
      await update.mutateAsync({ id: template.id, patch: { email_subject: subject, email_body: body } });
      toast.success('Email content saved');
    } finally {
      setSavingEmail(false);
    }
  };

  const sendOne = async (r: EcertRecipient) => {
    const already = r.email_status === 'sent';
    if (already) {
      const times = r.send_count ?? 0;
      const timesText = times > 0 ? ` It has already been sent ${times} time${times !== 1 ? 's' : ''} to this address.` : '';
      const ok = await confirmDlg(`Send the certificate to ${r.email} again?${timesText} A fresh copy of the current design will be emailed.`);
      if (!ok) return;
    }
    const outcomes = await sendQueue.start({
      template,
      doc,
      recipients: [r],
      format,
      forceSent: already,
      onRow: (recipientId, patch) => rowEvents.current.get(recipientId)?.(patch)
    });
    setResults(outcomes);
  };

  // rows given to the composer include the universal builtins, so its chip
  // de-duplication (canvas-bound `Name` vs {{participant_name}}) sees the
  // same resolved values the server will substitute
  const composerRows = rows.map((r) => ({
    ...r.row_data,
    participant_name: r.name,
    participant_email: r.email
  }));
  // sample token-context for the composer's live preview — built on the same
  // contract (lib/ecert/tokens.ts) the send route resolves with
  const sampleContext: TokenContext | null = rows[0]
    ? {
        recipient: { name: rows[0].name, email: rows[0].email, rendered_url: rows[0].rendered_url },
        template: { name: template.name, format },
        rowData: rows[0].row_data ?? {}
      }
    : null;
  const sendable = rows.filter((r) => r.email && r.email_status !== 'sent');

  const downloadOne = async (r: EcertRecipient) => {
    try {
      await downloadCertificateFile(template, doc, r);
      toast.success(`Certificate downloaded${r.name ? ` — ${r.name}` : ''}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Download failed');
    }
  };
  const stats = {
    total: rows.length,
    sent: rows.filter((r) => r.email_status === 'sent').length,
    failed: rows.filter((r) => r.email_status === 'failed').length,
    pending: rows.filter((r) => r.email_status === 'pending' && !!r.email).length
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 text-white">
      <Link href="/admin/ecert" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
        <ArrowLeft size={16} /> All e-certificates
      </Link>

      {/* ---------- header ---------- */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-2xl font-bold">{template.name}</h1>
          <p className="mt-1 text-sm text-neutral-400">{template.event_title ?? 'Event removed'} · {template.width}×{template.height}px</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-neutral-400">
            Output format
            <select
              value={format}
              onChange={async (e) => {
                const f = e.target.value as EcertFormat;
                setFormat(f);
                await update.mutateAsync({ id: template.id, patch: { format: f } });
                toast.info(`Format set to ${f.toUpperCase()} — existing renders will re-run as ${f.toUpperCase()}`);
              }}
              className="rounded-lg border border-white/10 bg-neutral-800 px-2.5 py-2 text-xs font-bold uppercase"
            >
              <option value="pdf">PDF</option>
              <option value="jpg">JPG</option>
              <option value="jpeg">JPEG</option>
            </select>
          </label>
          <Link href={`/admin/ecert/${template.id}/edit`}>
            <Button variant="ghost">Edit design</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* ---------- stats ---------- */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="grid flex-1 grid-cols-4 gap-3 text-center text-sm">
              <StatCard label="Total" value={stats.total} color="text-white" />
              <StatCard label="Pending" value={stats.pending} color="text-blue-300" />
              <StatCard label="Sent" value={stats.sent} color="text-emerald-300" />
              <StatCard label="Failed" value={stats.failed} color="text-red-300" />
            </div>
          </div>
          {stats.sent > 0 && (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={checkDelivery} disabled={checkingDelivery}>
                <span className="flex items-center gap-2">
                  {checkingDelivery ? <Loader2 size={13} className="animate-spin" /> : <MailCheck size={13} />}
                  Check delivery status with Brevo
                </span>
              </Button>
              <span className="text-[10px] text-neutral-500">
                Brevo accepts API sends instantly but can reject them at delivery time — this verifies each recipient's real outcome.
              </span>
            </div>
          )}
          {deliveryReport && <DeliveryReportPanel report={deliveryReport} />}

          {/* ---------- import (initially empty list, or on demand) ---------- */}
          {showImport && (
            <ImportPanel
              templateId={template.id}
              eventId={template.event_id}
              existingCount={rows.length}
              onImported={() => {
                setShowImport(false);
                void recipients.refetch();
              }}
            />
          )}

          {/* ---------- recipients table ---------- */}
          <DataBoundary
            isLoading={recipients.isLoading}
            isError={recipients.isError}
            onRetry={() => void recipients.refetch()}
            isEmpty={rows.length === 0 && !showImport}
            emptyIcon={Send}
            emptyTitle="No recipients yet"
            emptyDescription="Import your CSV/XLSX or load the event's confirmed participants to begin."
          >
            <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="flex items-center gap-2 text-sm font-bold"><Eye size={14} className="text-red-400" /> Review certificates ({rows.length})</h3>
                <button
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white"
                  onClick={() => setShowImport(true)}
                >
                  <RotateCcw size={12} /> Change / re-import list
                </button>
              </div>

              <ul className="divide-y divide-white/5">
                {rows.map((r) => (
                  <RecipientRow
                    key={r.id}
                    recipient={r}
                    template={template}
                    doc={doc}
                    format={format}
                    issues={issuesById.get(r.id) ?? []}
                    rowEvents={rowEvents}
                    onPreview={() => setPreviewId(r.id)}
                    onEmail={() => void sendOne(r)}
                    onDownload={() => void downloadOne(r)}
                    sending={sendQueue.progress.running}
                  />
                ))}
              </ul>
            </div>
          </DataBoundary>

          {/* ---------- results report ---------- */}
          {results && <SendResults results={results} />}
        </div>

        {/* ---------- composer + bulk actions ---------- */}
        <aside className="space-y-4">
          <div className="space-y-2 rounded-xl border border-white/10 bg-neutral-900 p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold"><Send size={15} className="text-red-400" /> Send</h3>
            <p className="text-xs text-neutral-400">
              {sendable.length} certificate{sendable.length !== 1 ? 's' : ''} ready to email ({format.toUpperCase()} attached).
              Rows marked <span className="text-amber-300">pending</span> with issues can be fixed by clicking the row first.
            </p>
            <Button
              className="w-full"
              disabled={!sendable.length || sendQueue.progress.running}
              onClick={() => setDoubleConfirm(true)}
            >
              <span className="flex items-center gap-2">
                <Mail size={14} /> Email all ({sendable.length})
              </span>
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              disabled={!!zipProgress}
              onClick={() => void downloadZip()}
            >
              <span className="flex items-center gap-2">
                {zipProgress ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                {zipProgress
                  ? `Packing… ${zipProgress.done}/${zipProgress.total}${zipProgress.current ? ` (${zipProgress.current.name})` : ''}`
                  : `Download all (ZIP)${rows.length ? ` · ${rows.length}` : ''}`}
              </span>
            </Button>
            {zipProgress && zipProgress.total > 0 && (
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${Math.round((zipProgress.done / zipProgress.total) * 100)}%` }}
                />
              </div>
            )}
            <p className="text-[10px] text-neutral-500">Sending is sequential with rate-limit backoff; you can stop it anytime. Already-sent rows are always skipped.</p>
          </div>

          <EmailComposer
            subject={subject}
            body={body}
            columns={template.data_columns ?? []}
            sample={sampleContext}
            useLetterhead={template.use_letterhead !== false}
            onToggleLetterhead={(use) => {
              void update.mutateAsync({ id: template.id, patch: { use_letterhead: use } });
            }}
            allRows={composerRows}
            saving={savingEmail}
            onSave={(s, b) => {
              setSubject(s);
              setBody(b);
              void (async () => {
                try {
                  setSavingEmail(true);
                  await update.mutateAsync({ id: template.id, patch: { email_subject: s, email_body: b } });
                  toast.success('Email content saved');
                } finally {
                  setSavingEmail(false);
                }
              })();
            }}
          />

          {sendQueue.progress.running && (
            <SendProgressCard progress={sendQueue.progress} onCancel={sendQueue.cancel} />
          )}
        </aside>
      </div>

      {/* ---------- modals ---------- */}
      {previewId && (
        <RecipientPreviewModal
          recipient={rows.find((r) => r.id === previewId)!}
          template={template}
          doc={doc}
          onClose={() => setPreviewId(null)}
          updateRecipient={updateRecipient}
        />
      )}

      <BulkConfirmModal
        open={doubleConfirm}
        count={sendable.length}
        format={format}
        onClose={() => {
          setDoubleConfirm(false);
          setTypeCount('');
        }}
        typeCount={typeCount}
        setTypeCount={setTypeCount}
        onBegin={() => void beginRun()}
      />

      {dialog}
    </div>
  );
}

/* =====================================================================
 * Row
 * ===================================================================== */

function RecipientRow({
  recipient,
  template,
  doc,
  format,
  issues,
  rowEvents,
  onPreview,
  onEmail,
  onDownload,
  sending
}: {
  recipient: EcertRecipient;
  template: EcertTemplate;
  doc: CertDoc;
  format: EcertFormat;
  issues: string[];
  rowEvents: React.MutableRefObject<Map<string, (patch: Partial<EcertRecipient>) => void>>;
  onPreview: () => void;
  onEmail: () => void;
  onDownload: () => void;
  sending: boolean;
}) {
  const [url, setUrl] = useState<string | null>(() =>
    thumbFor(recipient.id, recipient.rendered_fingerprint || template.layers_fingerprint, recipient.overrides)
  );
  const [failed, setFailed] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // fresh queue/manual renders update the row in place — follow the new URL
    // (paths are unique per render, so a changed string always means new bytes)
    if (recipient.rendered_url && recipient.rendered_url !== url && !url?.startsWith('data:')) {
      setUrl(recipient.rendered_url);
    }
    if (recipient.render_status === 'pending' && !recipient.rendered_url && !url?.startsWith('data:')) {
      setUrl(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipient.rendered_url, recipient.render_status]);

  useEffect(() => {
    const el = holderRef.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '120px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || url || failed) return;
    let alive = true;
    void (async () => {
      try {
        const dataUrl = await renderThumb(template, doc, { ...recipient, overrides: { ...recipient.overrides } });
        if (alive) setUrl(dataUrl);
      } catch (e) {
        console.warn('thumb failed', e);
        if (alive) setFailed(true);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, url, failed, recipient.id, format]);

  const statusIcon =
    recipient.email_status === 'sent' ? <CheckCircle2 size={14} className="text-emerald-400" /> :
    recipient.email_status === 'failed' ? <XCircle size={14} className="text-red-400" /> :
    <Loaderish />;

  const blocking = issues.filter((i) => !i.startsWith('Already sent'));

  return (
    <li className="flex items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03]">
      <div ref={holderRef} className="flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-white/10 bg-neutral-800">
        {failed ? <ImageOff size={14} className="text-neutral-500" /> :
          url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={`Certificate for ${recipient.name}`}
              className="h-full w-full object-cover"
              // A stored render that 404s/breaks must not leave a broken row —
              // self-heal by rendering this certificate fresh client-side.
              onError={() => {
                // mark the stored URL untrusted for this row and re-render
                const fresh = { ...recipient, rendered_url: null } as EcertRecipient;
                setUrl(null);
                setFailed(false);
                void (async () => {
                  try {
                    const dataUrl = await renderThumb(template, doc, fresh, { fresh: true });
                    setUrl(dataUrl);
                  } catch {
                    setFailed(true);
                  }
                })();
              }}
            />
          ) : (
            <Loader2 size={12} className={`animate-spin text-neutral-500 ${visible ? '' : 'opacity-0'}`} />
          )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{recipient.name || recipient.email.split('@')[0]}</p>
        <p className="truncate text-xs text-neutral-500">{recipient.email}</p>
        {blocking.length > 0 && (
          <p className="mt-0.5 truncate text-[10px] text-amber-300">⚠ {blocking.join(' · ')}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-neutral-400">
          {recipient.email_status === 'sent' && (recipient.send_count ?? 0) > 1
            ? `sent ×${recipient.send_count}`
            : recipient.email_status}
        </span>
        {statusIcon}
        <button onClick={onPreview} className="rounded-lg bg-white/10 p-1.5 text-neutral-300 hover:bg-white/20" title="Preview / edit certificate">
          <Eye size={14} />
        </button>
        <button
          onClick={onDownload}
          disabled={sending}
          className="rounded-lg bg-white/10 p-1.5 text-neutral-300 hover:bg-white/20 disabled:opacity-40"
          title="Download this certificate"
        >
          <Download size={14} />
        </button>
        <Button variant="ghost" disabled={sending} onClick={onEmail} className="!px-2.5 !py-1.5">
          <Mail size={13} /> Email
        </Button>
      </div>
    </li>
  );
}

function Loaderish() {
  return <span className="inline-block h-3 w-3 rounded-full border border-neutral-600" />;
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900 p-3">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
    </div>
  );
}

/* =====================================================================
 * Big preview + per-certificate fix
 * ===================================================================== */

function RecipientPreviewModal({
  recipient,
  template,
  doc,
  onClose,
  updateRecipient
}: {
  recipient: EcertRecipient;
  template: EcertTemplate;
  doc: CertDoc;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateRecipient: { mutateAsync: (v: any) => Promise<unknown> };
}) {
  const [url, setUrl] = useState<string | null>(() =>
    thumbFor(recipient.id, recipient.rendered_fingerprint || template.layers_fingerprint, recipient.overrides)
  );
  const [busy, setBusy] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const l of doc.layers) {
      if (l.type === 'text' && l.mode === 'variable') {
        const ov = recipient.overrides?.[l.id]?.['value'];
        init[l.id] = typeof ov === 'string' ? ov : rowValue(recipient.row_data ?? {}, l.variable ?? '');
      }
    }
    return init;
  });

  const variableLayers = doc.layers.filter((l) => l.type === 'text' && l.mode === 'variable');

  // render the full-size preview on open when no stored render exists yet
  useEffect(() => {
    if (url) return;
    let alive = true;
    void (async () => {
      try {
        const { renderPreviewFull } = await import('@/lib/ecert/thumbs');
        const dataUrl = await renderPreviewFull(template, doc, recipient);
        if (alive) setUrl(dataUrl);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not render the preview');
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAndRerender = async () => {
    setBusy(true);
    try {
      const overrideMap = Object.fromEntries(
        variableLayers.map((l) => [l.id, { value: overrides[l.id] ?? '' }])
      );
      await updateRecipient.mutateAsync({ id: recipient.id, patch: { overrides: overrideMap } });
      const fresh = { ...recipient, overrides: overrideMap } as EcertRecipient;
      const { createRendererFor, renderAndUpload } = await import('@/lib/ecert/renderQueue');
      const renderer = await createRendererFor(template);
      try {
        const { url: renderedUrl } = await renderAndUpload(
          renderer,
          doc,
          template,
          { ...fresh, render_status: 'pending', rendered_fingerprint: '' } as EcertRecipient,
          template.format
        );
        setUrl(renderedUrl);
        toast.success('Saved and re-rendered this certificate');
      } finally {
        await renderer.dispose().catch(() => undefined);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Re-render failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={`Certificate — ${recipient.name || recipient.email}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex max-h-[45vh] items-center justify-center overflow-y-auto rounded-lg border border-white/10 bg-neutral-800">
          {busy ? <Loader2 size={22} className="animate-spin" /> : url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Certificate preview" className="max-w-full" />
          ) : <p className="p-10 text-xs text-neutral-500">No render yet — it appears after rendering.</p>}
        </div>

        {variableLayers.length > 0 && (
          <div className="space-y-2 rounded-lg border border-white/10 bg-neutral-800 p-3">
            <p className="text-xs font-semibold text-neutral-400">Per-certificate fixes (override the values for this recipient only)</p>
            {variableLayers.map((l) => (
              <label key={l.id} className="flex items-center gap-2 text-xs">
                <span className="w-28 shrink-0 truncate text-neutral-400">{'{' + (l.variable ?? '') + '}'}</span>
                <input
                  value={overrides[l.id] ?? ''}
                  onChange={(e) => setOverrides((o) => ({ ...o, [l.id]: e.target.value }))}
                  className={inputCls + ' !py-1.5 !text-xs'}
                />
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Back to list</Button>
          <Button onClick={saveAndRerender} disabled={busy}>
            {busy ? 'Saving…' : 'Save & re-render'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* =====================================================================
 * Bulk double-confirmation (AlertDialog-ish summary + typed count)
 * ===================================================================== */

function BulkConfirmModal({
  open,
  count,
  format,
  onClose,
  typeCount,
  setTypeCount,
  onBegin
}: {
  open: boolean;
  count: number;
  format: EcertFormat;
  onClose: () => void;
  typeCount: string;
  setTypeCount: (v: string) => void;
  onBegin: () => void;
}) {
  if (!open) return null;
  const countsMatch = typeCount === String(count);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <AlertTriangle size={20} className="text-amber-400" /> Confirm bulk send
        </h2>
        <p className="mt-3 text-sm text-neutral-300">
          You are about to email <span className="font-bold text-white">{count}</span> certificate
          {count !== 1 ? 's' : ''} ({format.toUpperCase()}) with individual attachments through Brevo.
        </p>
        <ul className="mt-3 space-y-1 text-xs text-neutral-400">
          <li>• Rows already sent are skipped — this is a fresh list, not a top-up.</li>
          <li>• Sending runs sequentially (safe for rate limits) and shows a live progress report.</li>
          <li>• Failures never block the run — every row&apos;s exact error is logged at the end.</li>
        </ul>
        <p className="mt-4 text-xs text-neutral-400">
          Final check: type <span className="font-mono font-bold text-white">{count}</span> to confirm.
        </p>
        <input
          autoFocus
          value={typeCount}
          onChange={(e) => setTypeCount(e.target.value)}
          placeholder={String(count)}
          className="mt-1.5 w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-center font-mono text-sm"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {/* close FIRST — the send run can take minutes and must not keep this open */}
          <Button
            onClick={() => {
              if (!countsMatch) return;
              onClose();
              onBegin();
            }}
            disabled={!countsMatch}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Send {count} now
          </Button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
 * Progress + results
 * ===================================================================== */

function SendProgressCard({
  progress,
  onCancel
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  progress: { running: boolean; done: number; total: number; failed: number; skipped: number; current?: { name: string; email: string; stage: string } | undefined };
  onCancel: () => void;
}) {
  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  return (
    <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-300">
          <Loader2 size={14} className="animate-spin" /> Sending… {progress.done}/{progress.total}
        </h3>
        <button onClick={onCancel} className="rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20">
          Stop
        </button>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-neutral-400">
        {progress.failed > 0 && <span className="text-red-300">{progress.failed} failed · </span>}
        {progress.current && <span>{progress.current.stage === 'render' ? 'Rendering' : 'Emailing'} {progress.current.name}…</span>}
      </p>
    </div>
  );
}

function SendResults({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  results
}: {
  results: { recipientId: string; name: string; email: string; status: string; sendCount?: number; error?: string }[];
}) {
  const sent = results.filter((r) => r.status === 'sent');
  const failed = results.filter((r) => r.status !== 'sent' && r.status !== 'skipped');
  const skipped = results.filter((r) => r.status === 'skipped');
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-bold">Results log</h3>
        <p className="text-xs">
          <span className="text-emerald-300">{sent.length} sent</span>
          <span className="text-red-300"> · {failed.length} failed</span>
          {skipped.length > 0 && <span className="text-neutral-400"> · {skipped.length} skipped</span>}
        </p>
      </div>
      <ul className="max-h-72 divide-y divide-white/5 overflow-y-auto text-xs">
        {results.map((r) => (
          <li key={r.recipientId} className="flex items-center gap-2 px-4 py-2">
            {r.status === 'sent' ? <CheckCircle2 size={13} className="shrink-0 text-emerald-400" /> :
              r.status === 'skipped' ? <AlertTriangle size={13} className="shrink-0 text-neutral-400" /> :
              <XCircle size={13} className="shrink-0 text-red-400" />}
            <span className="font-semibold text-neutral-200">{r.name}</span>
            <span className="truncate text-neutral-500">{r.email}</span>
            <span className={`ml-auto shrink-0 font-mono ${r.status === 'sent' ? 'text-emerald-400' : 'text-red-400'}`}>
              {r.status === 'sent' ? `sent ✓${r.sendCount ? ` (e-mail #${r.sendCount})` : ''}` : r.error ?? r.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
/* =====================================================================
 * Delivery verification (Brevo event-log reconciliation)
 * ===================================================================== */

interface DeliveryReport {
  checked: number;
  delivered: number;
  in_transit: number;
  failed: number;
  results: Array<{
    recipient_id: string;
    email: string;
    name: string;
    delivery: 'delivered' | 'in_transit' | 'failed' | 'unknown';
    reason: string | null;
  }>;
}

function DeliveryReportPanel({ report }: { report: DeliveryReport }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-bold"><MailCheck size={14} className="text-blue-400" /> Brevo delivery log</h3>
        <p className="text-xs">
          <span className="text-emerald-300">{report.delivered} delivered</span>
          <span className="text-blue-300"> · {report.in_transit} in transit</span>
          <span className="text-red-300"> · {report.failed} failed</span>
        </p>
      </div>
      <ul className="max-h-64 divide-y divide-white/5 overflow-y-auto text-xs">
        {report.results.map((r) => (
          <li key={r.recipient_id} className="flex items-center gap-2 px-4 py-2">
            {r.delivery === 'delivered' ? <CheckCircle2 size={13} className="shrink-0 text-emerald-400" /> :
              r.delivery === 'in_transit' ? <Loader2 size={13} className="shrink-0 text-blue-400 animate-spin" /> :
              <XCircle size={13} className="shrink-0 text-red-400" />}
            <span className="font-semibold text-neutral-200">{r.name}</span>
            <span className="truncate text-neutral-500">{r.email}</span>
            <span className={`ml-auto max-w-[380px] shrink-0 truncate font-mono ${r.delivery === 'failed' ? 'text-red-400' : r.delivery === 'delivered' ? 'text-emerald-400' : 'text-blue-300'}`}>
              {r.reason ?? (r.delivery === 'delivered' ? 'delivered' : 'accepted — awaiting delivery event')}
            </span>
          </li>
        ))}
      </ul>
      {report.failed > 0 && (
        <p className="border-t border-white/10 px-4 py-2.5 text-[11px] font-semibold text-red-300">
          Fix senders → Brevo → Transactional → Senders &amp; IP: verify “csi@mjcollege.ac.in” (or authenticate the domain),
          then resend the failed rows from the list above.
        </p>
      )}
    </div>
  );
}
