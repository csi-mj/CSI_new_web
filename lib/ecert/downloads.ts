/**
 * Certificate downloads (client-side).
 * - One certificate: fetch rendered bytes via the admin proxy → save.
 * - Bulk: everything into ZIP files (chunked — a 1000-row all-in-one ZIP
 *   would blow browser memory; each chunk downloads as its own archive).
 * Rows that aren't rendered yet are rendered first (same pipeline as sending)
 * so the download always matches what would be emailed.
 */
import type { CertDoc, EcertRecipient, EcertTemplate } from './types';
import { certificateFileName } from './types';
import { createRendererFor, renderAndUpload, needsRender, warmRendererFonts } from './renderQueue';
import type { CertRenderer } from './render';
import { fetchBytes } from './loadBytes';

export interface DownloadProgress {
  done: number;
  total: number;
  failed: { name: string; email: string; error: string }[];
  current?: { name: string };
}

function safeZipName(name: string): string {
  // ZIP entry names must not collide; also strip characters some zip tools choke on
  return name.replace(/[\\/:*?"<>|]/g, '');
}

function triggerBrowserDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Downloads ONE recipient's certificate (renders it first if it isn't yet). */
export async function downloadCertificateFile(
  template: EcertTemplate,
  doc: CertDoc,
  recipient: EcertRecipient
): Promise<void> {
  let renderer: CertRenderer | null = null;
  if (needsRender(recipient, template)) {
    const { missing } = await warmRendererFonts(doc);
    if (missing.length) console.warn('[ecert] fonts missing during download:', missing);
    renderer = await createRendererFor(template);
    const rendered = await renderAndUpload(renderer, doc, template, recipient, template.format);
    recipient.rendered_path = rendered.path;
    recipient.rendered_url = rendered.url;
    recipient.rendered_fingerprint = template.layers_fingerprint;
    recipient.render_status = 'rendered';
  }
  try {
    const blob = await fetchBytes(recipient.rendered_path!);
    triggerBrowserDownload(blob, safeZipName(certificateFileName(recipient.name || recipient.email.split('@')[0], template.format)));
  } finally {
    if (renderer) await renderer.dispose().catch(() => undefined);
  }
}

/** Renders (if needed) + packs certificates into chunked ZIPs and downloads them. */
export async function downloadCertificatesZip(
  template: EcertTemplate,
  doc: CertDoc,
  recipients: EcertRecipient[],
  onProgress?: (p: DownloadProgress) => void
): Promise<DownloadProgress> {
  const CHUNK_SIZE = 80; // entries per ZIP — bounded memory

  const { missing: fontsMissing } = await warmRendererFonts(doc);
  if (fontsMissing.length) console.warn('[ecert] fonts missing during zip download:', fontsMissing);

  const progress: DownloadProgress = { done: 0, total: recipients.length, failed: [] };
  const renderer = await createRendererFor(template);

  try {
    for (let start = 0; start < recipients.length; start += CHUNK_SIZE) {
      const chunk = recipients.slice(start, start + CHUNK_SIZE);
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();

      for (const r of chunk) {
        if (onProgress) onProgress({ ...progress, current: { name: r.name || r.email } });
        try {
          if (needsRender(r, template)) {
            const rendered = await renderAndUpload(renderer, doc, template, r, template.format);
            // keep the local row usable for the bytes fetch just below
            r.rendered_path = rendered.path;
            r.rendered_url = rendered.url;
            r.rendered_fingerprint = template.layers_fingerprint;
            r.render_status = 'rendered';
          }
          if (!r.rendered_path) throw new Error('No rendered file available');
          const blob = await fetchBytes(r.rendered_path);
          zip.file(safeZipName(certificateFileName(r.name || r.email.split('@')[0], template.format)), blob);
        } catch (e) {
          progress.failed.push({
            name: r.name || r.email.split('@')[0],
            email: r.email,
            error: e instanceof Error ? e.message : 'Render/download failed'
          });
        }
        progress.done += 1;
        if (onProgress) onProgress({ ...progress });
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'STORE' // jpegs/pdfs are already compressed — store is much faster
      });
      const chunkIndex = Math.floor(start / CHUNK_SIZE) + 1;
      const totalZipFiles = Math.ceil(recipients.length / CHUNK_SIZE);
      const baseName = `certificates-${(template.name || 'ecert').replace(/[^a-zA-Z0-9-_ ]/g, '').slice(0, 30)}`;
      triggerBrowserDownload(
        zipBlob,
        `${baseName}${totalZipFiles > 1 ? `-part${chunkIndex}` : ''}.zip`
      );

      // let the browser settle between chunk downloads
      if (start + CHUNK_SIZE < recipients.length) {
        await new Promise((res) => setTimeout(res, 800));
      }
    }
  } finally {
    await renderer.dispose().catch(() => undefined);
  }

  return progress;
}