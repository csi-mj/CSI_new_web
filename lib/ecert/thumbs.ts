/**
 * Lazy preview thumbnails: ONE shared offscreen renderer per template renders
 * recipient previews on demand (viewport-driven), serialized through a promise
 * queue because a single fabric canvas is not concurrent. Cached per
 * (recipientId + render fingerprint).
 */
import type { CertDoc, EcertRecipient, EcertTemplate } from './types';
import { mergeLayers } from './types';
import { stableHash } from './fingerprint';
import { createRendererFor, resolveLayerText, warmRendererFonts } from './renderQueue';
import type { CertRenderer } from './render';

/** Full cache key for a recipient's previews: renders must be cached per
 *  overrides too — else a per-certificate fix keeps showing the OLD preview. */
function recipientKey(recipientId: string, fingerprint: string, overrides?: unknown): string {
  const ov = overrides && Object.keys(overrides as Record<string, unknown>).length
    ? stableHash(JSON.stringify(overrides))
    : '';
  return `${recipientId}:${fingerprint}${ov ? `:${ov}` : ''}`;
}

interface CacheEntry {
  templateId: string;
  renderer: CertRenderer;
  fingerprint: string;
}
let shared: CacheEntry | null = null;
const thumbs = new Map<string, string>(); // recipientId + fingerprint → dataURL
const templateThumbs = new Map<string, string>(); // templateId:fingerprint → dataURL
let chain: Promise<unknown> = Promise.resolve();
const listeners = new Set<(id: string, dataUrl: string) => void>();

/** Subscribe to thumbnail availability (component mounts/unmounts). */
export function onThumb(fn: (id: string, dataUrl: string) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function thumbFor(recipientId: string, fingerprint: string, overrides?: unknown): string | null {
  return thumbs.get(recipientKey(recipientId, fingerprint, overrides)) ?? null;
}

export function templateThumbFor(templateId: string, fingerprint: string): string | null {
  return templateThumbs.get(`${templateId}:${fingerprint}`) ?? null;
}

/**
 * Renders the DESIGNED template preview (background + all layers; variables
 * show as {column} placeholders) for the templates grid — not the bare
 * uploaded background.
 */
export async function renderTemplateThumb(template: EcertTemplate): Promise<string> {
  const doc: CertDoc = parseDocSafe(template);
  const fp = template.layers_fingerprint;
  const key = `${template.id}:${fp}`;
  const cached = templateThumbs.get(key);
  if (cached) return cached;

  if (!shared || shared.templateId !== template.id || shared.fingerprint !== fp) {
    if (shared) await shared.renderer.dispose().catch(() => undefined);
    const renderer = await createRendererFor(template);
    await warmRendererFonts(doc);
    shared = { templateId: template.id, renderer, fingerprint: fp };
  }

  const run = chain.then(async () => {
    const keyNow = `${template.id}:${template.layers_fingerprint}`;
    const cachedNow = templateThumbs.get(keyNow);
    if (cachedNow) return cachedNow;
    const dataUrl = await shared!.renderer.toDataURL({
      layers: doc.layers ?? [],
      resolveText: (layer) => resolveLayerText(layer, null), // placeholders: {column}
      multiplier: Math.max(0.12, 520 / (doc.canvas?.width || 1200)),
      format: 'jpeg',
      quality: 0.78
    });
    templateThumbs.set(keyNow, dataUrl);
    return dataUrl;
  });
  chain = run.catch(() => undefined);
  return run;
}

function parseDocSafe(template: EcertTemplate): CertDoc {
  const raw = (template as unknown as { layers: unknown }).layers;
  if (raw && typeof raw === 'object' && Array.isArray((raw as CertDoc).layers)) {
    const doc = raw as CertDoc;
    return { ...doc, canvas: doc.canvas?.width ? doc.canvas : { width: template.width, height: template.height } };
  }
  return { version: 1, canvas: { width: template.width, height: template.height }, fonts: [], layers: [] };
}

/**
 * Produces (queued, non-concurrent) a small dataURL preview for one recipient.
 * Throws on failure — caller surfaces it as the row's issue.
 * `fresh: true` skips the stored render entirely (self-healing after a
 * broken/unavailable stored URL) and renders the row client-side.
 */
export async function renderThumb(
  template: EcertTemplate,
  doc: CertDoc,
  recipient: EcertRecipient,
  opts?: { fresh?: boolean }
): Promise<string> {
  const fp = recipient.rendered_fingerprint || template.layers_fingerprint;
  const key = recipientKey(recipient.id, fp, recipient.overrides);
  const existing = !opts?.fresh ? thumbs.get(key) : undefined;
  if (existing) return existing;

  // already rendered in storage → that URL is the cheapest thumbnail
  if (!opts?.fresh && recipient.rendered_url && recipient.rendered_fingerprint === template.layers_fingerprint) {
    thumbs.set(key, recipient.rendered_url);
    return recipient.rendered_url;
  }

  if (!shared || shared.templateId !== template.id || shared.fingerprint !== template.layers_fingerprint) {
    if (shared) await shared.renderer.dispose().catch(() => undefined);
    const renderer = await createRendererFor(template);
    await warmRendererFonts(doc);
    shared = { templateId: template.id, renderer, fingerprint: template.layers_fingerprint };
  }

  const run = chain.then(async () => {
    if (thumbs.has(key)) return thumbs.get(key)!;
    const layers = mergeLayers(doc.layers ?? [], recipient.overrides);
    const dataUrl = await shared!.renderer.toDataURL({
      layers,
      resolveText: (layer) => resolveLayerText(layer, recipient),
      multiplier: Math.max(0.12, 360 / (doc.canvas?.width || 1200)),
      format: 'jpeg',
      quality: 0.7
    });
    thumbs.set(key, dataUrl);
    for (const fn of listeners) fn(recipient.id, dataUrl);
    return dataUrl;
  });
  chain = run.catch(() => undefined);
  return run;
}

export async function disposeThumbs(): Promise<void> {
  if (shared) {
    await shared.renderer.dispose().catch(() => undefined);
    shared = null;
  }
}

/**
 * Full-size preview for the detail modal (≈1400px long side, cached
 * separately from the small grid thumbs). Rendered on demand when the
 * recipient has no stored render yet.
 */
export async function renderPreviewFull(
  template: EcertTemplate,
  doc: CertDoc,
  recipient: EcertRecipient
): Promise<string> {
  const fp = recipient.rendered_fingerprint || template.layers_fingerprint;
  const key = `full:${recipientKey(recipient.id, fp, recipient.overrides)}`;
  const existing = thumbs.get(key);
  if (existing) return existing;

  if (recipient.rendered_url && recipient.rendered_fingerprint === template.layers_fingerprint) {
    thumbs.set(key, recipient.rendered_url);
    return recipient.rendered_url;
  }

  if (!shared || shared.templateId !== template.id || shared.fingerprint !== template.layers_fingerprint) {
    if (shared) await shared.renderer.dispose().catch(() => undefined);
    const renderer = await createRendererFor(template);
    await warmRendererFonts(doc);
    shared = { templateId: template.id, renderer, fingerprint: template.layers_fingerprint };
  }

  const run = chain.then(async () => {
    if (thumbs.has(key)) return thumbs.get(key)!;
    const layers = mergeLayers(doc.layers ?? [], recipient.overrides);
    const width = doc.canvas?.width || 1200;
    const dataUrl = await shared!.renderer.toDataURL({
      layers,
      resolveText: (layer) => resolveLayerText(layer, recipient),
      multiplier: Math.max(0.4, Math.min(1.2, 1600 / width)),
      format: 'jpeg',
      quality: 0.9
    });
    thumbs.set(key, dataUrl);
    for (const fn of listeners) fn(recipient.id, dataUrl);
    return dataUrl;
  });
  chain = run.catch(() => undefined);
  return run;
}