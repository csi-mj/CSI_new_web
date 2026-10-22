/**
 * PDF → raster (first page) using the pdfjs-dist version already installed for
 * the PDF preview modal. Client-only: callers run in 'use client' flows.
 *
 * The result replaces the raw PDF for canvas use AND is what actually gets
 * uploaded (keeping every outgoing request under the Vercel 4.5 MB body limit).
 */
import { CANVAS_MAX_SIDE } from './types';

export interface RasterizedPdf {
  blob: Blob; // JPEG raster of page 1
  width: number;
  height: number;
  pages: number;
}

/** Long-side cap for the rasterized page. */
const RASTER_MAX_SIDE = CANVAS_MAX_SIDE;

export async function rasterizePdfFirstPage(
  file: File | Blob,
  fileName = 'document.pdf'
): Promise<RasterizedPdf> {
  const pdfjs = await import('pdfjs-dist');
  // Bundler-friendly worker (no CDN dependency); falls back internally if needed.
  try {
    await import('pdfjs-dist/build/pdf.worker.entry');
  } catch {
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });

  const scale = Math.min(
    4,
    RASTER_MAX_SIDE / Math.max(base.width, base.height)
  );
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not create a canvas to render the PDF');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({
    canvas,
    canvasContext: ctx,
    viewport
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any).promise;

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to rasterize the PDF'))),
      'image/jpeg',
      0.92
    )
  );

  const result: RasterizedPdf = {
    blob,
    width: canvas.width,
    height: canvas.height,
    pages: doc.numPages
  };

  page.cleanup();
  doc.destroy();
  // filename kept only for caller logging — avoid unused param lint
  void fileName;
  return result;
}

/**
 * Downscales an over-sized image client-side to the canonical raster cap.
 * Returns the original blob when no resize is needed.
 */
export async function downscaleImage(
  file: File | Blob,
  mime: string
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  try {
    const longSide = Math.max(bitmap.width, bitmap.height);
    if (longSide <= CANVAS_MAX_SIDE && file.size <= 3 * 1024 * 1024) {
      return { blob: file, width: bitmap.width, height: bitmap.height };
    }
    const ratio = Math.min(1, CANVAS_MAX_SIDE / longSide);
    const w = Math.round(bitmap.width * ratio);
    const h = Math.round(bitmap.height * ratio);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return { blob: file, width: bitmap.width, height: bitmap.height };
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);
    if (file.size <= 3 * 1024 * 1024 || ratio === 1) {
      // Only re-encode when shrinking saves real bytes; else keep original.
      return { blob: file, width: bitmap.width, height: bitmap.height };
    }
    const type = mime === 'image/png' ? 'image/png' : 'image/jpeg';
    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob(
        (b) => resolve(b ?? file),
        type,
        type === 'image/jpeg' ? 0.92 : undefined
      )
    );
    return { blob, width: w, height: h };
  } finally {
    bitmap.close?.();
  }
}