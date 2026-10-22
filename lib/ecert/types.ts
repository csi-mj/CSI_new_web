/**
 * E-Certificate feature — canonical types.
 * The layer JSON doc is the source of truth: the editor serializes into it
 * and every render/preview builds a fresh canvas from it.
 */

export const MAX_RECIPIENTS = 1000;
/** Canonical raster cap (long side) for backgrounds — matches render/export. */
export const CANVAS_MAX_SIDE = 2200;
/** Export size budget (blob bytes) before stepping the multiplier down. */
export const EXPORT_MAX_BYTES = 2.5 * 1024 * 1024;
/** Brevo total message limit stays well clear of 20 MB; keep attachments small. */
export const EMAIL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export type EcertLayerMode = 'constant' | 'variable';
export type EcertFormat = 'pdf' | 'jpg' | 'jpeg';
export type EcertTemplateStatus = 'draft' | 'ready' | 'sent';
export type VariableRole = 'name';

export interface EcertShadow {
  color: string;
  blur: number; // canonical px
  offsetX: number;
  offsetY: number;
}

export interface EcertStroke {
  color: string;
  width: number; // canonical px
}

export interface EcertLayer {
  id: string;
  type: 'text' | 'image';
  z: number;
  /** Normalized 0..1 geometry relative to the canvas. */
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number; // degrees

  mode: EcertLayerMode;
  /** Constant text, or the editor-facing default for a variable layer. */
  value: string;
  /** Column name for variable layers (canvas placeholder shows {column}). */
  variable: string;
  /** 'name' marks this as the participant's name → email column becomes mandatory. */
  role?: VariableRole | null;

  // ---- text ----
  fontFamily?: string;
  fontSizePx?: number; // canonical canvas px
  fontWeight?: number;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  opacity?: number; // 0..1
  align?: 'left' | 'center' | 'right';
  letterSpacing?: number; // em
  lineHeight?: number;
  autoFit?: boolean; // shrink-to-fit inside the box (never overflow)
  minFontSizePx?: number;
  shadow?: EcertShadow | null;
  stroke?: EcertStroke | null;

  // ---- image ----
  src?: string; // bucket path e.g. 'ecert/assets/…'
  url?: string; // public URL (for <img> display outside canvas)
  fit?: 'contain' | 'cover';
}

export interface DataColumn {
  name: string;
  role?: VariableRole | null;
}

export interface CertDoc {
  version: 1;
  canvas: { width: number; height: number };
  fonts: string[]; // every family used — drives lazy font loading
  layers: EcertLayer[];
}

export interface EcertTemplate {
  id: string;
  event_id: string | null;
  event_title: string | null;
  event_poster_url: string | null;
  name: string;
  background_url: string | null;
  background_mime: string | null;
  source_url: string | null;
  storage_path: string | null;
  width: number;
  height: number;
  layers_json: unknown;
  layers_fingerprint: string;
  data_columns: DataColumn[] | null;
  email_subject: string | null;
  email_body: string | null;
  format: EcertFormat;
  status: EcertTemplateStatus;
  use_letterhead?: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  /** Joined/aggregated by the list route (not raw columns). */
  recipient_count?: number;
  sent_count?: number;
}

export interface EcertRecipient {
  id: string;
  template_id: string;
  source: 'sheet' | 'participants';
  row_index: number;
  name: string;
  email: string;
  row_data: Record<string, string>;
  overrides: Record<string, Partial<EcertLayer>>;
  render_status: 'pending' | 'rendered' | 'failed';
  render_error: string | null;
  rendered_fingerprint: string;
  rendered_path: string | null;
  rendered_url: string | null;
  rendered_at: string | null;
  email_status: 'pending' | 'sent' | 'failed';
  email_error: string | null;
  email_sent_at: string | null;
  brevo_message_id: string | null;
  send_count?: number;
  created_at: string;
  updated_at: string;
}

/** Merged view used by rendering + review UI. */
export interface EffectiveLayer extends EcertLayer {
  /** Resolved text after overrides + (optionally) recipient values were applied. */
  resolvedText: string;
}

export interface CreateTemplatePayload {
  event_id: string;
  name: string;
  background_url: string;
  source_url: string;
  background_mime: string; // source mime (pdf/jpg/png)
  storage_path: string;
  width: number;
  height: number;
  event_title: string;
  event_poster_url: string | null;
}

export function parseDoc(json: unknown): CertDoc {
  const doc = (json ?? {}) as Partial<CertDoc>;
  if (!doc || typeof doc !== 'object') return { version: 1, canvas: { width: 0, height: 0 }, fonts: [], layers: [] };
  return {
    version: 1,
    canvas: doc.canvas ?? { width: 0, height: 0 },
    fonts: Array.isArray(doc.fonts) ? doc.fonts : [],
    layers: Array.isArray(doc.layers) ? (doc.layers as EcertLayer[]) : []
  };
}

/** Merge per-recipient overrides onto the base layers (by layer id). */
export function mergeLayers(
  layers: EcertLayer[],
  overrides: Record<string, Partial<EcertLayer>> | null
): EcertLayer[] {
  if (!overrides) return layers;
  return layers.map((l) => (overrides[l.id] ? { ...l, ...overrides[l.id] } : l));
}

/** The editor-facing placeholder for a variable layer. */
export function layerPlaceholder(layer: EcertLayer): string {
  return layer.variable ? `{${layer.variable}}` : '';
}

/** Safe, readable file name slug built from a recipient's name. */
export function certificateFileName(name: string, format: EcertFormat): string {
  const slug = (name || 'certificate')
    .replace(/[^a-zA-Z0-9-_ ]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 40);
  return `ECertificate-${slug || 'recipient'}.${format}`;
}