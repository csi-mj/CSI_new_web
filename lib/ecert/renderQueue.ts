/**
 * Render pipeline helpers (client-side).
 * Renders one recipient's certificate from the canonical layer doc and uploads
 * it to storage under ecert/renders/<templateId>/<recipientId>.<ext>.
 * Pure functions (+ small fetch helpers) — no React, so both the pre-render
 * queue and the send queue can drive them.
 */
import { api } from '@/app/admin/_components/ui';
import type { CertDoc, EcertFormat, EcertRecipient, EcertLayer, EcertTemplate } from './types';
import { mergeLayers } from './types';
import { createCertRenderer, ensureFontsUsed, type CertRenderer } from './render';
import { fingerprintLayers } from './fingerprint';

export interface RenderOutcome {
  recipientId: string;
  ok: boolean;
  error?: string;
  url?: string;
  path?: string;
  skipped?: boolean; // nothing needed (already rendered & fresh)
}

/** Case-insensitive column lookup within a row. */
export function rowValue(row_data: Record<string, string>, column: string): string {
  if (!column) return '';
  const exact = row_data[column];
  if (exact !== undefined) return exact;
  const key = Object.keys(row_data ?? {}).find((c) => c.toLowerCase() === column.toLowerCase());
  return key ? row_data[key] : '';
}

export function resolveLayerText(
  layer: EcertLayer,
  recipient: EcertRecipient | null
): string {
  if (layer.type !== 'text') return '';
  if (layer.mode === 'constant') return layer.value ?? '';
  if (!recipient) return layer.variable ? `{${layer.variable}}` : '';
  const overrideValue = recipient.overrides?.[layer.id]?.['value'];
  if (typeof overrideValue === 'string') return overrideValue;
  return rowValue(recipient.row_data ?? {}, layer.variable ?? '');
}

/** Rows that actually need a (re-)render right now. */
export function needsRender(recipient: EcertRecipient, template: EcertTemplate): boolean {
  if (recipient.render_status === 'failed') return true;
  if (recipient.render_status !== 'rendered') return true;
  return recipient.rendered_fingerprint !== template.layers_fingerprint;
}

export async function createRendererFor(template: EcertTemplate): Promise<CertRenderer> {
  const doc: CertDoc = (template as unknown as { layers: unknown }).layers as never as CertDoc;
  const parsed = doc && Array.isArray(doc.layers) ? doc : { version: 1 as const, canvas: { width: template.width, height: template.height }, fonts: [], layers: [] };
  return createCertRenderer(parsed, template.storage_path ?? null);
}

/**
 * Renders + uploads ONE recipient, then PATCHes their row. Throws on failure
 * — the caller decides how to surface it (queue keeps going).
 */
export async function renderAndUpload(
  renderer: CertRenderer,
  doc: CertDoc,
  template: EcertTemplate,
  recipient: EcertRecipient,
  format: EcertFormat
): Promise<{ url: string; path: string }> {
  const layers = mergeLayers(doc.layers ?? [], recipient.overrides);

  const missingVariable = layers.find(
    (l) => l.type === 'text' && l.mode === 'variable' && l.variable && typeof rowValue(recipient.row_data ?? {}, l.variable) === 'undefined'
  );
  // rowValue returns '' for a *missing* or *empty* column; treat a column that
  // does not exist AT ALL as an error, empty-but-present as a warning elsewhere.
  if (missingVariable) {
    throw new Error(`This row has no "${missingVariable.variable}" column at all`);
  }

  const { blob, ext } = await renderer.toBlob({
    layers,
    resolveText: (layer) => resolveLayerText(layer, recipient),
    format
  });

  const path = `ecert/renders/${template.id}/${recipient.id}-${Date.now()}.${ext}`;
  const fd = new FormData();
  fd.append(
    'file',
    new File([blob], `${recipient.id}.${ext}`, {
      type: ext === 'pdf' ? 'application/pdf' : 'image/jpeg'
    })
  );
  fd.append('path', path);

  const res = await fetch('/api/admin/ecert/upload', { method: 'POST', body: fd });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.url) {
    throw new Error(json?.error ?? `Render upload failed (HTTP ${res.status})`);
  }

  const patch = await fetch(`/api/admin/ecert/recipients/${recipient.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      render_status: 'rendered',
      rendered_path: path,
      rendered_url: json.url,
      rendered_fingerprint: template.layers_fingerprint,
      rendered_at: new Date().toISOString(),
      // delete the superseded render server-side (prevents stale-cache and clutter)
      previous_rendered_path: recipient.rendered_path ?? null
    })
  });
  if (!patch.ok) {
    throw new Error(`Rendered but failed to update recipient status (HTTP ${patch.status})`);
  }

  return { url: json.url, path };
}

/** Convenience: fingerprint of the current template layers (used by the editor). */
export function currentFingerprint(doc: CertDoc): string {
  return fingerprintLayers({ canvas: doc.canvas, layers: doc.layers });
}

/** Warms the fonts used by the doc (throws nothing; returns missing list). */
export async function warmRendererFonts(doc: CertDoc) {
  const families = [...new Set([...(doc.fonts ?? []), ...doc.layers.map((l) => l.fontFamily).filter(Boolean)])];
  const result = await ensureFontsUsed(families as string[]);
  return result;
}