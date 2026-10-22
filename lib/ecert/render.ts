/**
 * The single canonical certificate renderer.
 *
 * Both the editor and every export path (preview thumbs, bulk render, final
 * export) build canvas content from the layer doc through layerToFabricObject,
 * so what the admin sees while editing is exactly what gets rendered.
 *
 * fabric is only ever loaded with a dynamic import inside client code.
 */
import {
  type CertDoc,
  type EcertFormat,
  type EcertLayer,
  EXPORT_MAX_BYTES
} from './types';
import { ensureFontsLoaded, DEFAULT_CERT_FONT } from './googleFonts';
import { loadImageBytes } from './loadBytes';

export type ResolveText = (layer: EcertLayer) => string;

const FONT_FALLBACK = 'sans-serif';

/** The fabric module shape we use (kept loose to avoid SSR type loading). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricModule = any;

let fabricPromise: Promise<FabricModule> | null = null;
export function loadFabric(): Promise<FabricModule> {
  if (!fabricPromise) fabricPromise = import('fabric');
  return fabricPromise;
}

function fontStack(family?: string): string {
  return `"${family || DEFAULT_CERT_FONT}", ${FONT_FALLBACK}`;
}

/**
 * Builds the fabric object for one layer on a canvas that is W × H px.
 * Used by the editor AND the offscreen renderer — identical properties.
 */
export async function layerToFabricObject(
  fabric: FabricModule,
  layer: EcertLayer,
  W: number,
  H: number,
  resolveText: ResolveText
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (layer.type === 'image' && layer.src) {
    const { bitmap } = await loadImageBytes(layer.src);
    // FabricImage accepts canvases safely (ImageBitmap support varies by platform).
    const holder = document.createElement('canvas');
    holder.width = bitmap.width;
    holder.height = bitmap.height;
    holder.getContext('2d')!.drawImage(bitmap, 0, 0);

    const img = new fabric.FabricImage(holder, { angle: layer.rotation || 0 });
    const boxW = Math.max(8, layer.w * W);
    const boxH = Math.max(8, layer.h * H);
    const fit = layer.fit === 'cover' ? Math.max /* cover */(boxW / img.width, boxH / img.height) : Math.min(boxW / img.width, boxH / img.height);
    img.set({
      scaleX: fit,
      scaleY: fit,
      originX: 'center',
      originY: 'center',
      left: (layer.x + layer.w / 2) * W,
      top: (layer.y + layer.h / 2) * H
    });
    return img;
  }

  // ---- text ----
  const text = resolveText(layer);
  const boxW = Math.max(20, layer.w * W);
  const boxH = Math.max(12, layer.h * H);
  const minSize = layer.minFontSizePx ?? 10;
  let fontSize = Math.max(minSize, Math.min(layer.fontSizePx ?? Math.round(H * 0.08), 400));

  const textbox = new fabric.Textbox(text, {
    left: layer.x * W,
    top: layer.y * H,
    width: boxW,
    height: boxH,
    angle: layer.rotation || 0,
    fontFamily: fontStack(layer.fontFamily),
    fontSize,
    fontWeight: layer.fontWeight ?? 400,
    fontStyle: layer.italic ? 'italic' : 'normal',
    underline: !!layer.underline,
    fill: layer.color ?? '#111111',
    textAlign: layer.align ?? 'left',
    lineHeight: layer.lineHeight ?? 1.15,
    charSpacing: layer.letterSpacing ? Math.round(layer.letterSpacing * 1000) : 0,
    splitByGrapheme: false, // wrap on words; long words handled by autoFit width floor
    opacity: layer.opacity ?? 1,
    editable: false,
    objectCaching: false
  });
  (textbox as { splitByGrapheme: boolean }).splitByGrapheme = true; // break very long words

  if (layer.shadow) {
    textbox.shadow = new fabric.Shadow({
      color: layer.shadow.color,
      blur: layer.shadow.blur,
      offsetX: layer.shadow.offsetX,
      offsetY: layer.shadow.offsetY,
      nonScaling: true
    });
  }
  if (layer.stroke && layer.stroke.width > 0) {
    textbox.set({
      stroke: layer.stroke.color,
      strokeWidth: layer.stroke.width,
      strokeLineJoin: 'round',
      paintFirst: 'stroke'
    });
  }

  // autoFit: never let text overflow its box — step the size down until it fits
  if (layer.autoFit !== false) {
    let guard = 400; // hard iteration cap
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    while ((textbox as any).calcTextHeight() > boxH && fontSize > minSize && guard-- > 0) {
      fontSize = Math.max(minSize, fontSize - 2);
      textbox.set({ fontSize });
    }
  }
  return textbox;
}

/**
 * An offscreen renderer bound to one template doc. Reuses one fabric
 * StaticCanvas for the whole render/send session (fast, and required so
 * hundreds of recipients don't spawn/destroy canvases).
 */
export interface CertRenderer {
  /** Renders the given effective layers → dataURL at `multiplier`. */
  toDataURL(opts: {
    layers: EcertLayer[];
    resolveText: ResolveText;
    multiplier: number;
    format: 'png' | 'jpeg';
    quality?: number;
  }): Promise<string>;
  /** Renders → Blob of the requested certificate format. */
  toBlob(opts: {
    layers: EcertLayer[];
    resolveText: ResolveText;
    format: EcertFormat;
  }): Promise<{ blob: Blob; ext: string; width: number; height: number }>;
  dispose(): Promise<void>;
}

export async function createCertRenderer(
  doc: CertDoc,
  backgroundPath: string | null
): Promise<CertRenderer> {
  const fabric = await loadFabric();
  const { width: W, height: H } = doc.canvas;
  if (!W || !H) throw new Error('Certificate template has no canvas dimensions');

  // Background — loaded once, kept across renders.
  const container = document.createElement('canvas');
  container.width = W;
  container.height = H;
  const canvas = new fabric.StaticCanvas(container, { width: W, height: H, renderOnAddRemove: false });

  let bgObj: unknown = null;
  if (backgroundPath) {
    const { bitmap } = await loadImageBytes(backgroundPath);
    const holder = document.createElement('canvas');
    holder.width = W;
    holder.height = H;
    const c = holder.getContext('2d')!;
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, W, H);
    // contain-fit the bitmap onto the canvas
    const s = Math.min(W / bitmap.width, H / bitmap.height);
    const dw = bitmap.width * s;
    const dh = bitmap.height * s;
    c.drawImage(bitmap, (W - dw) / 2, (H - dh) / 2, dw, dh);
    bgObj = new fabric.FabricImage(holder, {
      left: 0,
      top: 0,
      scaleX: 1,
      scaleY: 1,
      selectable: false,
      evented: false
    });
  }

  const renderOnce = async (o: {
    layers: EcertLayer[];
    resolveText: ResolveText;
    multiplier: number;
    quality?: number;
  }): Promise<string> => {
    // rebuild everything above the background for this render
    const existing = canvas.getObjects();
    for (let i = existing.length - 1; i >= 0; i--) canvas.remove(existing[i]);
    if (bgObj) canvas.add(bgObj);
    for (const layer of o.layers) {
      const obj = await layerToFabricObject(fabric, layer, W, H, o.resolveText);
      canvas.add(obj);
    }
    canvas.requestRenderAll();
    return canvas.toDataURL({ format: 'jpeg', quality: o.quality ?? 0.92, multiplier: o.multiplier });
  };

  return {
    async toDataURL({ layers, resolveText, multiplier, format, quality = 0.92 }) {
      if (format === 'png') {
        // same pipeline, but exported as PNG
        const existing = canvas.getObjects();
        for (let i = existing.length - 1; i >= 0; i--) canvas.remove(existing[i]);
        if (bgObj) canvas.add(bgObj);
        for (const layer of layers) {
          const obj = await layerToFabricObject(fabric, layer, W, H, resolveText);
          canvas.add(obj);
        }
        canvas.requestRenderAll();
        return canvas.toDataURL({ format: 'png', multiplier });
      }
      return renderOnce({ layers, resolveText, multiplier, quality });
    },
    async toBlob({ layers, resolveText, format }) {
      let multiplier = 1.2;
      let dataUrl = '';
      let bytes = Infinity;
      for (let attempts = 0; attempts < 5; attempts++) {
        dataUrl = await renderOnce({ layers, resolveText, multiplier, quality: format === 'pdf' ? 0.92 : 0.9 });
        bytes = dataUrl.length * 0.75; // base64 → approximate binary size
        if (bytes <= EXPORT_MAX_BYTES || multiplier <= 0.5) break;
        multiplier = Math.max(0.5, multiplier * 0.8);
      }

      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF({
          orientation: W > H ? 'landscape' : 'portrait',
          unit: 'px',
          format: [W, H],
          compress: true
        });
        pdf.addImage(dataUrl, 'JPEG', 0, 0, W, H);
        const blob = pdf.output('blob');
        return { blob, ext: 'pdf', width: W, height: H };
      }
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      return { blob, ext: format, width: W * multiplier, height: H * multiplier };
    },
    async dispose() {
      try {
        await canvas.dispose();
      } catch {
        /* already disposed */
      }
    }
  };
}

/** Loads every font used by the doc/layer set before rendering or exporting. */
export async function ensureFontsUsed(
  families: string[],
  weights: number[] = [400, 700]
): Promise<{ missing: string[] }> {
  return ensureFontsLoaded(families, weights);
}