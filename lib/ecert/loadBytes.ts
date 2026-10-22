/**
 * Canvas-safe image/bytes loading.
 * Every image the certificate renderer touches is fetched as BYTES through the
 * admin-authed proxy route (/api/admin/ecert/file) and decoded with
 * createImageBitmap — a cross-origin <img src> would taint the canvas and
 * silently break toDataURL exports.
 */

export interface LoadedImage {
  bitmap: ImageBitmap;
  width: number;
  height: number;
}

const PROXY = '/api/admin/ecert/file';

const bitmapCache = new Map<string, LoadedImage>();

function proxyUrl(path: string): string {
  return `${PROXY}?path=${encodeURIComponent(path)}`;
}

/** Fetches image bytes (bucket path under ecert/) and decodes to an ImageBitmap. */
export async function loadImageBytes(path: string): Promise<LoadedImage> {
  const cached = bitmapCache.get(path);
  if (cached) return cached;

  const res = await fetch(proxyUrl(path));
  if (!res.ok) {
    let reason = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) reason = body.error;
    } catch {
      /* not json */
    }
    throw new Error(`Failed to load certificate asset "${path}": ${reason}`);
  }
  const blob = await res.blob();
  if (!blob.size) throw new Error(`Failed to load certificate asset "${path}": empty file`);
  const bitmap = await createImageBitmap(blob);
  const img: LoadedImage = { bitmap, width: bitmap.width, height: bitmap.height };
  if (bitmapCache.size > 80) bitmapCache.clear(); // simple safety valve
  bitmapCache.set(path, img);
  return img;
}

/** Raw bytes for the send route / uploads (returns Blob). */
export async function fetchBytes(path: string): Promise<Blob> {
  const res = await fetch(proxyUrl(path));
  if (!res.ok) throw new Error(`Failed to fetch "${path}": HTTP ${res.status}`);
  return await res.blob();
}

/** Drops a cached image (after re-upload/re-render of that path). */
export function forgetImage(path: string): void {
  bitmapCache.delete(path);
}