/**
 * Cheap stable string hash (FNV-1a) — used to compare layer documents for
 * staleness between the saved template and previously rendered recipients.
 * No crypto dependency; runs identically on client and server.
 */
export function stableHash(input: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x1b873593;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = (h1 ^ c) >>> 0;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 = (h2 + (c << (i % 13))) >>> 0;
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

/** Normalizes a layer doc into the exact string that gets hashed. */
export function fingerprintLayers(doc: {
  canvas: { width: number; height: number };
  layers: unknown;
}): string {
  const canonical = JSON.stringify({
    canvas: doc.canvas,
    layers: (doc as { layers: unknown }).layers
  });
  return stableHash(canonical);
}