'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, Copy, Loader2, Plus, Trash2, Undo2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Modal } from '@/app/admin/_components/ui';
import { DataBoundary } from '@/components/ui/data-boundary';
import { useEcertRecipients, useEcertTemplate, useRecipientMutations, saveTemplateDoc } from '../../hooks/useEcert';
import { parseDoc, type CertDoc, type EcertLayer, type EcertTemplate } from '@/lib/ecert/types';
import { fingerprintLayers } from '@/lib/ecert/fingerprint';
import { ECERT_FONTS, ensureFontsLoaded } from '@/lib/ecert/googleFonts';
import { loadFabric, layerToFabricObject, type ResolveText } from '@/lib/ecert/render';
import { loadImageBytes } from '@/lib/ecert/loadBytes';
import { parseSheetFile } from '@/lib/ecert/sheet';
import { normalizeSheet } from '@/lib/ecert/normalize';

/* =====================================================================
 * Editor page — fabric.js canvas over the certificate background.
 * The layer JSON doc is canonical: every canvas change serializes back
 * into the doc and is sent with a debounced PATCH (crash-safe).
 * ===================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
interface FabricObj {
  ecertId?: string;
  [key: string]: any;
}

export default function EcertEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
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
      <CertEditor template={template!} />
    </DataBoundary>
  );
}

function CertEditor({ template }: { template: EcertTemplate }) {
  const router = useRouter();
  const [name, setName] = useState(template.name);
  const doc0 = parseDoc((template as unknown as { layers: unknown }).layers);
  const [doc, setDoc] = useState<CertDoc>(() => ({
    version: 1,
    canvas: { width: template.width, height: template.height },
    fonts: doc0.fonts ?? [],
    layers: doc0.layers ?? []
  }));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [history, setHistory] = useState<CertDoc[]>([]);

  const sheetRef = useRef<ParsedSheet | null>(null); // parsed CSV/XLSX waiting in editor state
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: recipients } = useEcertRecipients(template.id);
  const { importRows } = useRecipientMutations(template.id);

  /* ---------- persistence ---------- */
  const persist = useCallback((d: CertDoc) => {
    setSaving(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await saveTemplateDoc(template.id, d, fingerprintLayers({ canvas: d.canvas, layers: d.layers }));
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Saving failed — the next change retries');
      } finally {
        setSaving(false);
      }
    }, 1200);
  }, [template.id]);

  const updateDoc = useCallback((updater: (d: CertDoc) => CertDoc, recordHistory = true) => {
    setDoc((old) => {
      if (recordHistory) setHistory((h) => [...h.slice(-19), old]);
      const next = updater(old);
      // Keep the font manifest in sync — every family actually used by a text
      // layer must be listed, otherwise it is never loaded and the canvas
      // silently falls back (the "font change does nothing" bug).
      next.fonts = [
        ...new Set(next.layers.filter((l) => l.type === 'text' && l.fontFamily).map((l) => l.fontFamily!))
      ];
      persist(next);
      return next;
    });
  }, [persist]);

  const updateName = useCallback((value: string) => {
    setName(value);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      try {
        await import('@/app/admin/_components/ui').then((m) => m.api(`/api/admin/ecert/templates/${template.id}`, 'PATCH', { name: value }));
      } catch {
        /* non-critical */
      } finally {
        setSaving(false);
      }
    }, 1200);
  }, [template.id]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (!h.length) return h;
      const last = h[h.length - 1];
      setDoc(last);
      persist(last);
      return h.slice(0, -1);
    });
  }, [persist]);

  /* ---------- "Save as template & proceed" ---------- */
  const proceedToSend = useCallback(async () => {
    if (proceeding) return;
    setProceeding(true);
    try {
      const fingerprint = fingerprintLayers({ canvas: doc.canvas, layers: doc.layers });
      await saveTemplateDoc(template.id, doc, fingerprint);

      // Persisted recipients already? Keep them (idempotent upserts skip unchanged rows).
      const importedCount = (recipients ?? []).length;
      const variableLayers = doc.layers.filter((l) => l.type === 'text' && l.mode === 'variable');

      if (importedCount === 0 && sheetRef.current && variableLayers.length) {
        const sheet = sheetRef.current;
        const normalized = normalizeSheet(sheet.columns, sheet.rows, sheet.nameColumn ?? undefined);
        if (!normalized.rows.length) toast.error('The sheet has no usable rows (every row needs a valid email)');
        else {
          const result = await importRows.mutateAsync({ source: 'sheet', rows: normalized.rows });
          if (result?.row_errors?.length) {
            toast.warning(`${result.row_errors.length} row(s) were skipped — the list shows why`);
          }
        }
      }

      if (variableLayers.length && (recipients ?? []).length === 0 && !sheetRef.current) {
        toast.info('This design uses variables — import your CSV/XLSX (or load participants) on the next screen');
      }

      router.push(`/admin/ecert/${template.id}/send`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not proceed');
      setProceeding(false);
    }
  }, [doc, template.id, recipients, importRows, persist, proceeding, router]);

  const selected = useMemo(() => doc.layers.find((l) => l.id === selectedId) ?? null, [doc, selectedId]);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/ecert" className="text-neutral-400 hover:text-white" aria-label="Back">
            <ArrowLeft size={18} />
          </Link>
          <input
            value={name}
            onChange={(e) => updateName(e.target.value)}
            className="w-64 min-w-24 rounded px-1 text-sm font-bold outline-none focus:bg-white/5"
            aria-label="Template name"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-neutral-500">
            {saving && <Loader2 size={12} className="animate-spin" />}
            {saving ? 'Saving…' : 'All changes saved'}
          </span>
          <Button variant="ghost" onClick={undo} disabled={!history.length} aria-label="Undo">
            <Undo2 size={14} />
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <span className="flex items-center gap-2"><Plus size={14} /> Add Text/Component</span>
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={proceedToSend} disabled={proceeding}>
            {proceeding ? <Loader2 size={14} className="animate-spin" /> : (
              <span className="flex items-center gap-2"><Send size={14} /> Save as template &amp; proceed</span>
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex-1 bg-[radial-gradient(circle,#27272a_1px,transparent_1px)] bg-[length:16px_16px] p-4">
          <CanvasHost
            doc={doc}
            template={template}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDocChange={updateDoc}
          />
        </div>

        <aside className="w-full shrink-0 space-y-4 border-t border-white/10 p-4 lg:w-80 lg:border-l lg:border-t-0">
          <LayerInspector layer={selected} onDocChange={updateDoc} />
          <LayerList
            doc={doc}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onReorder={(from, to) =>
              updateDoc((d) => {
                const layers = [...d.layers];
                const [moved] = layers.splice(from, 1);
                layers.splice(to, 0, moved);
                layers.forEach((l, i) => (l.z = i));
                return { ...d, layers };
              })
            }
            onDelete={(layerId) => updateDoc((d) => ({ ...d, layers: d.layers.filter((l) => l.id !== layerId) }))}
            onDuplicate={(layerId) =>
              updateDoc((d) => {
                const source = d.layers.find((l) => l.id === layerId);
                if (!source) return d;
                const clone: EcertLayer = {
                  ...source,
                  id: `lyr_${Math.random().toString(36).slice(2, 10)}`,
                  x: Math.min(0.95, source.x + 0.02),
                  y: Math.min(0.95, source.y + 0.02)
                };
                return { ...d, layers: [...d.layers, clone] };
              })
            }
          />
        </aside>
      </div>

      {addOpen && (
        <AddLayerModal
          onClose={() => setAddOpen(false)}
          onAdd={(layer, sheet) => {
            sheetRef.current = sheet;
            updateDoc((d) => ({
              ...d,
              fonts: layer.type === 'text' ? [...new Set([...d.fonts, layer.fontFamily ?? ''].filter(Boolean))] : d.fonts,
              layers: [...d.layers, layer]
            }));
            setAddOpen(false);
            setSelectedId(layer.id);
          }}
          templateHeight={template.height}
        />
      )}
    </div>
  );
}

function ArrowLeftish() {
  return <span className="text-lg">&larr;</span>;
}

interface ParsedSheet {
  columns: string[];
  rows: Record<string, unknown>[];
  nameColumn?: string | null;
  fileName: string;
}

/* =====================================================================
 * Canvas host
 * ===================================================================== */

function CanvasHost({
  doc,
  template,
  selectedId,
  onSelect,
  onDocChange
}: {
  doc: CertDoc;
  template: EcertTemplate;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onDocChange: (updater: (d: CertDoc) => CertDoc, record?: boolean) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<FabricObj | null>(null);
  const objectsRef = useRef<Map<string, FabricObj>>(new Map());
  const docRef = useRef(doc);
  docRef.current = doc;
  const onDocChangeRef = useRef(onDocChange);
  onDocChangeRef.current = onDocChange;
  const [ready, setReady] = useState(false);
  const [fontsMissing, setFontsMissing] = useState<string[]>([]);
  const W = template.width;
  const H = template.height;

  /* StrictMode-safe init: guard + async dispose; rebuilds layer objects from the doc */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const fabric = await loadFabric();
        if (cancelled || !canvasElRef.current) return;
        const canvas: FabricObj = new fabric.Canvas(canvasElRef.current, {
          width: W,
          height: H,
          backgroundColor: '#ffffff',
          preserveObjectStacking: true
        });
        canvasRef.current = canvas;

        canvas.on('selection:created', (e: { selected?: FabricObj[] }) => {
          const obj = e.selected?.[0];
          if (obj?.ecertId) onSelect(obj.ecertId);
        });
        canvas.on('selection:updated', (e: { selected?: FabricObj[] }) => {
          const obj = e.selected?.[0];
          if (obj?.ecertId) onSelect(obj.ecertId);
        });
        canvas.on('selection:cleared', () => onSelect(null));
        canvas.on('object:modified', (e: { target?: FabricObj }) => {
          const obj = e.target;
          if (!obj?.ecertId) return;
          serializeModified(obj, W, H, onDocChangeRef.current, docRef.current);
        });

        // load fonts BEFORE marking ready — canvas effects (bg + layers) fire on
        // `ready`, and fabric objects must be created with the real glyphs
        try {
          const { missing } = await ensureFontsLoaded(docRef.current.fonts ?? []);
          if (!cancelled && missing.length) setFontsMissing(missing);
        } catch {
          /* fonts best-effort — canvas still renders with fallbacks */
        }
        if (cancelled) return;
        setReady(true);
      } catch (err) {
        console.error('Editor init failed:', err);
        toast.error('Canvas editor failed to start — reload the page');
      }
    })();

    return () => {
      cancelled = true;
      const c = canvasRef.current;
      canvasRef.current = null;
      objectsRef.current.clear();
      if (c) void c.dispose().catch?.(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id]);

  /* fit to container */
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const apply = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const availW = wrap.clientWidth - 24;
      const availH = Math.max(400, window.innerHeight - 220);
      const zoom = Math.max(0.05, Math.min(1, availW / W, availH / H));
      canvas.setZoom(zoom);
      canvas.setDimensions({ width: Math.round(W * zoom), height: Math.round(H * zoom) });
      canvas.requestRenderAll();
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [ready, W, H]);

  /* background + layer objects load once fonts resolve */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    let cancelled = false;
    (async () => {
      const fabric = await loadFabric();
      // background
      if (template.storage_path && !objectsRef.current.has('__bg__')) {
        try {
          const { bitmap } = await loadImageBytes(template.storage_path);
          if (!cancelled) {
            const holder = document.createElement('canvas');
            holder.width = bitmap.width;
            holder.height = bitmap.height;
            holder.getContext('2d')!.drawImage(bitmap, 0, 0);
            const bg = new fabric.FabricImage(holder, {
              left: 0, top: 0,
              scaleX: W / bitmap.width,
              scaleY: H / bitmap.height,
              selectable: false,
              evented: false
            });
            // fabric v6: insertAt(index, ...objects) — but add() is enough here:
            // the background is always the first object added after a full clear.
            canvas.add(bg);
            objectsRef.current.set('__bg__', bg);
          }
        } catch (e) {
          const reason = e instanceof Error ? e.message : String(e);
          toast.error(`Background failed to load: ${reason}`.slice(0, 160));
          console.warn('Background load failed:', e);
        }
      }
      // layers
      for (const layer of doc.layers) {
        if (objectsRef.current.has(layer.id)) continue;
        await addLayerObject(canvas, layer, W, H);
      }
      // deletions (or undo of an add): objects no longer in the doc must go
      for (const [id, obj] of objectsRef.current) {
        if (id === '__bg__') continue;
        if (!doc.layers.some((l) => l.id === id)) {
          canvas.remove(obj);
          objectsRef.current.delete(id);
          prevLayerSnapshot.delete(id);
        }
      }
      canvas.requestRenderAll();
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, W, H, doc.layers, template.storage_path]);

  /* reconciliation: inspector changes to layer properties → fabric objects */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    for (const layer of doc.layers) {
      const obj = objectsRef.current.get(layer.id);
      if (!obj) continue;
      const snapshot = JSON.stringify(layer);
      if (prevLayerSnapshot.get(layer.id) === snapshot) continue;
      prevLayerSnapshot.set(layer.id, snapshot);
      // load (and re-load) the requested family BEFORE restyling — otherwise
      // fabric paints with the fallback and "the font isn't changing"
      void (async () => {
        try {
          if (layer.type === 'text' && layer.fontFamily) {
            await ensureFontsLoaded([layer.fontFamily]);
          }
        } finally {
          const fabric = await loadFabric();
          syncLayerProps(canvas, fabric, obj, layer, W, H);
        }
      })();
    }
  }, [doc.layers, ready, W, H]);

  /* selection highlight sync (React → canvas) */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const active = canvas.getActiveObject?.();
    const want = selectedId ? objectsRef.current.get(selectedId) : null;
    if (want && active !== want) {
      canvas.setActiveObject(want);
      canvas.requestRenderAll();
    }
  }, [selectedId, ready]);

  return (
    <div ref={wrapRef} className="mx-auto max-w-full">
      {fontsMissing.length > 0 && (
        <p className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          Some fonts could not load ({fontsMissing.join(', ')}) — those use a fallback until the next successful load.
        </p>
      )}
      <div className="relative mx-auto w-fit overflow-hidden rounded-lg border border-white/10 shadow-2xl">
        <canvas ref={canvasElRef} />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80">
            <Loader2 className="animate-spin text-red-400" size={24} />
          </div>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-neutral-500">
        Drag, resize &amp; rotate with the handles · double-click constant text to edit · variables show as {'{column}'}
      </p>
    </div>
  );

  async function addLayerObject(canvas: FabricObj, layer: EcertLayer, W: number, H: number) {
    try {
      const fabric = await loadFabric();
      const resolve: ResolveText = (l) => (l.mode === 'variable' ? `{${l.variable}}` : l.value);
      const obj = await layerToFabricObject(fabric, layer, W, H, resolve);
      obj.ecertId = layer.id;
      objectsRef.current.set(layer.id, obj as FabricObj);
      prevLayerSnapshot.set(layer.id, JSON.stringify(layer));
      canvas.add(obj);
      canvas.requestRenderAll();
    } catch (e) {
      console.warn('Layer failed:', layer.id, e);
    }
  }
}

/* module-level memo map (doc-level: one snapshot per layer id, refreshed on edit) */
const prevLayerSnapshot = new Map<string, string>();

/** Serialize a modified canvas object back into the layer doc. */
function serializeModified(
  obj: FabricObj,
  W: number,
  H: number,
  onDocChange: (updater: (d: CertDoc) => CertDoc, record?: boolean) => void,
  currentDoc: CertDoc
) {
  const id = obj.ecertId!;
  const layer = currentDoc.layers.find((l) => l.id === id);
  if (!layer) return;

  const clamp = (v: number) => Math.max(0, Math.min(0.98, v));
  const clampSize = (v: number) => Math.max(0.005, Math.min(1, v));

  if (layer.type === 'text' && ('text' in obj || (obj.type ?? '').toLowerCase() === 'textbox')) {
    let fontSize = obj.fontSize as number;
    if (obj.scaleY !== 1) fontSize = Math.max(8, Math.round(fontSize * (obj.scaleY as number)));
    let width = (obj.width as number) * (obj.scaleX as number);
    // bake scale back into width/fontSize (Textbox semantics)
    obj.set({ scaleX: 1, scaleY: 1, width, fontSize });
    const textH = (obj.calcTextHeight?.() as number) ?? obj.height;

    // auto-fit re-check after any modify (typing a huge value via handles etc.)
    if (layer.autoFit !== false) {
      let guard = 300;
      const min = layer.minFontSizePx ?? 10;
      while ((obj.calcTextHeight?.() as number) > H * (layer.h ?? 0.1) && fontSize > min && guard-- > 0) {
        fontSize = Math.max(min, fontSize - 2);
        obj.set({ fontSize });
      }
    }

    onDocChange((d) => ({
      ...d,
      layers: d.layers.map((l) =>
        l.id === id
          ? {
              ...l,
              x: clamp((obj.left as number) / W),
              y: clamp((obj.top as number) / H),
              w: clampSize(width / W),
              h: clampSize((obj.calcTextHeight?.() as number ?? textH) / H),
              rotation: obj.angle as number,
              fontSizePx: Math.round(fontSize)
            }
          : l
      )
    }));
  } else if (layer.type === 'image') {
    const dw = (obj.width as number) * (obj.scaleX as number);
    const dh = (obj.height as number) * (obj.scaleY as number);
    onDocChange((d) => ({
      ...d,
      layers: d.layers.map((l) =>
        l.id === id
          ? {
              ...l,
              x: clamp(((obj.left as number) - dw / 2) / W),
              y: clamp(((obj.top as number) - dh / 2) / H),
              w: clampSize(dw / W),
              h: clampSize(dh / H),
              rotation: obj.angle as number
            }
          : l
      )
    }));
  }
}

/** Applies doc-side property edits to the live fabric object (inspector sync). */
async function syncLayerProps(
  canvas: FabricObj,
  fabric: FabricObj,
  obj: FabricObj,
  layer: EcertLayer,
  W: number,
  H: number
) {
  if (layer.type === 'text') {
    const expected = layer.mode === 'variable' ? `{${layer.variable}}` : layer.value;
    if (obj.text !== expected && layer.mode === 'constant') obj.set({ text: expected });
    obj.set({
      fontFamily: `"${layer.fontFamily ?? 'Montserrat'}", sans-serif`,
      fontSize: layer.fontSizePx ?? obj.fontSize,
      fontWeight: layer.fontWeight ?? 400,
      fontStyle: layer.italic ? 'italic' : 'normal',
      underline: !!layer.underline,
      fill: layer.color ?? '#111111',
      textAlign: layer.align ?? 'left',
      lineHeight: layer.lineHeight ?? 1.15,
      charSpacing: layer.letterSpacing ? Math.round(layer.letterSpacing * 1000) : 0,
      opacity: layer.opacity ?? 1,
      angle: layer.rotation ?? 0,
      width: layer.w * W
    });
    // effects
    obj.shadow = layer.shadow
      ? new (fabric as never as { Shadow: new (o: Record<string, unknown>) => unknown }).Shadow({
          color: layer.shadow.color,
          blur: layer.shadow.blur,
          offsetX: layer.shadow.offsetX,
          offsetY: layer.shadow.offsetY,
          nonScaling: true
        })
      : null;
    if (layer.stroke && layer.stroke.width > 0) {
      obj.set({
        stroke: layer.stroke.color,
        strokeWidth: layer.stroke.width,
        strokeLineJoin: 'round',
        paintFirst: 'stroke'
      });
    } else {
      obj.set({ strokeWidth: 0, stroke: null });
    }
    // auto-fit
    if (layer.autoFit !== false) {
      let fontSize = layer.fontSizePx ?? obj.fontSize;
      const min = layer.minFontSizePx ?? 10;
      let guard = 300;
      while (obj.calcTextHeight() > layer.h * H && fontSize > min && guard-- > 0) {
        fontSize = Math.max(min, fontSize - 2);
        obj.set({ fontSize });
      }
    }
  } else if (layer.type === 'image') {
    obj.set({
      left: (layer.x + layer.w / 2) * W, // center origin
      top: (layer.y + layer.h / 2) * H,
      scaleX: (layer.w * W) / (obj.width as number),
      scaleY: (layer.h * H) / (obj.height as number),
      angle: layer.rotation ?? 0
    });
  }
  obj.setCoords?.();
  canvas.requestRenderAll?.();
}

/* =====================================================================
 * Inspector
 * ===================================================================== */

function LayerInspector({
  layer,
  onDocChange
}: {
  layer: EcertLayer | null;
  onDocChange: (updater: (d: CertDoc) => CertDoc) => void;
}) {
  if (!layer) {
    return (
      <div className="rounded-xl border border-white/10 bg-neutral-900 p-4 text-sm text-neutral-400">
        <p className="font-semibold text-white">Nothing selected</p>
        <p className="mt-1 text-xs">Click an element on the canvas, or use “Add Text/Component” to place a new one.</p>
      </div>
    );
  }

  const patch = (changes: Partial<EcertLayer>) =>
    onDocChange((d) => ({ ...d, layers: d.layers.map((l) => (l.id === layer.id ? { ...l, ...changes } : l)) }));

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-neutral-900 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-white">{layer.type === 'text' ? 'Text element' : 'Image element'}</p>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${layer.mode === 'variable' ? 'border-blue-500/40 text-blue-300' : 'border-white/15 text-neutral-300'}`}>
          {layer.mode === 'variable' ? 'Variable' : 'Constant'}
        </span>
      </div>

      {layer.type === 'text' && (
        <>
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Font</span>
            <select
              value={layer.fontFamily ?? 'Poppins'}
              onChange={(e) => patch({ fontFamily: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-2 py-2 text-sm"
              style={{ fontFamily: `"${layer.fontFamily ?? DEFAULT_FONT}", sans-serif` }}
            >
              {ECERT_FONTS.map((f) => (
                <option key={f} value={f} style={{ fontFamily: `"${f}", sans-serif` }}>{f}</option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Size (px)</span>
              <input
                type="number" min={10} max={400}
                value={layer.fontSizePx ?? 40}
                onChange={(e) => patch({ fontSizePx: Math.max(8, Math.min(400, Number(e.target.value) || 12)) })}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-2 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Color</span>
              <input
                type="color"
                value={layer.color ?? '#111111'}
                onChange={(e) => patch({ color: e.target.value })}
                className="h-[38px] w-full rounded-lg border border-white/10 bg-neutral-800"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <FormatToggle
              active={(layer.fontWeight ?? 400) >= 600}
              onClick={() => patch({ fontWeight: (layer.fontWeight ?? 400) >= 600 ? 400 : 700 })}
            >
              B
            </FormatToggle>
            <FormatToggle active={!!layer.italic} onClick={() => patch({ italic: !layer.italic })}>
              I
            </FormatToggle>
            <FormatToggle active={!!layer.underline} onClick={() => patch({ underline: !layer.underline })}>
              U
            </FormatToggle>
            {(['left', 'center', 'right'] as const).map((a) => (
              <button
                key={a}
                onClick={() => patch({ align: a })}
                className={`h-8 w-8 rounded-lg border text-[10px] font-bold uppercase transition ${layer.align === a ? 'border-red-500/60 bg-red-600/30 text-white' : 'border-white/10 bg-neutral-800 text-neutral-300 hover:bg-white/10'}`}
              >
                {a[0]}
              </button>
            ))}
            <button
              onClick={() => patch({ autoFit: !(layer.autoFit !== false) })}
              className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition ${layer.autoFit !== false ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300' : 'border-white/10 bg-neutral-800 text-neutral-400'}`}
            >
              Auto-fit
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase text-neutral-500">Line height</span>
              <input
                type="number" step={0.05} min={0.8} max={2.5}
                value={layer.lineHeight ?? 1.15}
                onChange={(e) => patch({ lineHeight: Math.max(0.8, Math.min(2.5, Number(e.target.value) || 1.15)) })}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-2 py-1.5 text-xs"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase text-neutral-500">Letter sp.</span>
              <input
                type="number" step={0.02} min={-0.2} max={1}
                value={layer.letterSpacing ?? 0}
                onChange={(e) => patch({ letterSpacing: Number(e.target.value) || 0 })}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-2 py-1.5 text-xs"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase text-neutral-500">Opacity</span>
              <input
                type="number" step={0.1} min={0.1} max={1}
                value={layer.opacity ?? 1}
                onChange={(e) => patch({ opacity: Math.max(0.1, Math.min(1, Number(e.target.value) || 1)) })}
                className="w-full rounded-lg border border-white/10 bg-neutral-800 px-2 py-1.5 text-xs"
              />
            </label>
          </div>

          {layer.mode === 'variable' && (
            <div className="space-y-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
              <p className="text-xs font-semibold text-blue-300">{'{' + (layer.variable ?? '') + '}'}</p>
              <label className="flex items-start gap-2 text-xs text-neutral-300">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={layer.role === 'name'}
                  onChange={(e) => patch({ role: e.target.checked ? 'name' : null })}
                />
                This is the participant&apos;s name (then the sheet must contain an email column)
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => patch({ shadow: layer.shadow ? null : { color: 'rgba(0,0,0,0.4)', blur: 8, offsetX: 0, offsetY: 2 } })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${layer.shadow ? 'border-red-500/50 bg-red-500/15 text-red-300' : 'border-white/10 bg-neutral-800 text-neutral-300'}`}
            >
              Shadow
            </button>
            <button
              onClick={() => patch({ stroke: layer.stroke ? null : { color: '#ffffff', width: 2 } })}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${layer.stroke ? 'border-red-500/50 bg-red-500/15 text-red-300' : 'border-white/10 bg-neutral-800 text-neutral-300'}`}
            >
              Outline
            </button>
            {layer.shadow && (
              <label className="block text-[10px] text-neutral-500">
                blur
                <input
                  type="range" min={0} max={40}
                  value={layer.shadow.blur}
                  onChange={(e) => patch({ shadow: { ...layer.shadow!, blur: Number(e.target.value) } })}
                  className="ml-1 w-20 align-middle"
                />
              </label>
            )}
            {layer.stroke && (
              <input
                type="number" min={1} max={20} title="Outline width (px)"
                value={layer.stroke.width}
                onChange={(e) => patch({ stroke: { ...layer.stroke!, width: Math.max(1, Math.min(20, Number(e.target.value) || 2)) } })}
                className="w-16 rounded-lg border border-white/10 bg-neutral-800 px-2 py-1 text-xs"
              />
            )}
          </div>
        </>
      )}

      {layer.type === 'image' && (
        <div className="space-y-2 text-xs text-neutral-400">
          <p>Drag to position · corner handles to resize. Fit mode:</p>
          <button
            onClick={() => patch({ fit: layer.fit === 'cover' ? 'contain' : 'cover' })}
            className="rounded-lg border border-white/10 bg-neutral-800 px-2.5 py-1.5 font-semibold text-neutral-300"
          >
            {layer.fit ?? 'contain'} (click to switch)
          </button>
        </div>
      )}
    </div>
  );
}

const DEFAULT_FONT = 'Montserrat';

function FormatToggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`h-8 w-8 rounded-lg border text-sm font-bold transition ${active ? 'border-red-500/60 bg-red-600/30 text-white' : 'border-white/10 bg-neutral-800 text-neutral-300 hover:bg-white/10'}`}
    >
      {children}
    </button>
  );
}

/* =====================================================================
 * Layer list
 * ===================================================================== */

function LayerList({
  doc,
  selectedId,
  onSelect,
  onReorder,
  onDelete,
  onDuplicate
}: {
  doc: CertDoc;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (from: number, to: number) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900">
      <p className="border-b border-white/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        Elements ({doc.layers.length}) — bottom → top
      </p>
      <ul className="max-h-64 divide-y divide-white/5 overflow-y-auto">
        {doc.layers.length === 0 && <li className="px-4 py-3 text-xs text-neutral-500">No elements yet</li>}
        {doc.layers.map((l, i) => (
          <li
            key={l.id}
            className={`flex items-center gap-2 px-3 py-2 text-xs transition ${selectedId === l.id ? 'bg-red-500/10' : 'hover:bg-white/5'}`}
          >
            <button onClick={() => onSelect(l.id)} className="flex-1 truncate text-left text-neutral-300">
              {l.type === 'text' ? (
                <>
                  <span className="font-semibold">{l.mode === 'variable' ? `{${l.variable}}` : l.value?.slice(0, 28) || 'text'}</span>
                  <span className="ml-2 text-[10px] text-neutral-500">{l.mode}</span>
                </>
              ) : (
                'Image element'
              )}
            </button>
            <button
              aria-label="Layer up" disabled={i === doc.layers.length - 1}
              onClick={() => onReorder(i, i + 1)}
              className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-25"
            >
              <ChevronUp size={13} />
            </button>
            <button
              aria-label="Layer down" disabled={i === 0}
              onClick={() => onReorder(i, i - 1)}
              className="p-0.5 text-neutral-500 hover:text-white disabled:opacity-25"
            >
              <ChevronDown size={13} />
            </button>
            <button aria-label="Duplicate" onClick={() => onDuplicate(l.id)} className="p-0.5 text-neutral-500 hover:text-white">
              <Copy size={13} />
            </button>
            <button aria-label="Delete" onClick={() => onDelete(l.id)} className="p-0.5 text-red-400 hover:text-red-300">
              <Trash2 size={13} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* =====================================================================
 * Add-layer modal — Constant vs Variable, Text vs Upload image
 * ===================================================================== */

function AddLayerModal({
  onClose,
  onAdd,
  templateHeight
}: {
  onClose: () => void;
  onAdd: (layer: EcertLayer, sheet: ParsedSheet | null) => void;
  templateHeight: number;
}) {
  const [kind, setKind] = useState<'constant' | 'variable' | null>(null);
  const [kindIsText, setKindIsText] = useState<boolean | null>(null);
  const [constantText, setConstantText] = useState('');
  const [sheet, setSheet] = useState<ParsedSheet | null>(null);
  const [parsing, setParsing] = useState(false);
  const [variableColumn, setVariableColumn] = useState('');
  const [isName, setIsName] = useState(false);
  const [uploading, setUploading] = useState(false);

  function defaultLayer(partial: Partial<EcertLayer>): EcertLayer {
    return {
      id: `lyr_${Math.random().toString(36).slice(2, 10)}`,
      type: 'text',
      z: 0,
      x: 0.15,
      y: 0.4,
      w: 0.7,
      h: 0.1,
      rotation: 0,
      mode: 'constant',
      value: '',
      variable: '',
      fontFamily: DEFAULT_FONT,
      fontSizePx: Math.round(templateHeight * 0.075),
      fontWeight: 600,
      color: '#111111',
      align: 'center',
      lineHeight: 1.15,
      autoFit: true,
      minFontSizePx: 10,
      ...partial
    };
  }

  const handleSheet = async (file: File) => {
    setParsing(true);
    try {
      const parsed = await parseSheetFile(file);
      setSheet({ columns: parsed.columns, rows: parsed.rows, fileName: parsed.fileName });
      toast.success(`Parsed ${parsed.columns.length} columns · ${parsed.rows.length} rows`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not read the file');
    } finally {
      setParsing(false);
    }
  };

  const handleImageUpload = async (file: File, mode: 'constant' | 'variable') => {
    if (!/\.(png|jpe?g|pdf)$/i.test(file.name)) {
      toast.error('Elements support PNG, JPG/JPEG and PDF (first page becomes an image)');
      return;
    }
    setUploading(true);
    try {
      let blob: Blob = file;
      let mime = file.type || 'image/jpeg';
      if (mime === 'application/pdf' || /\.pdf$/i.test(file.name)) {
        const m = await import('@/lib/ecert/pdfBackground');
        const raster = await m.rasterizePdfFirstPage(file, file.name);
        blob = raster.blob;
        mime = 'image/jpeg';
      }
      const slug = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 40) || 'element';
      const path = `ecert/assets/${Date.now()}-${slug}.${mime === 'image/png' ? 'png' : 'jpg'}`;
      const fd = new FormData();
      fd.append('file', new File([blob], path.split('/').pop()!, { type: mime }));
      fd.append('path', path);
      const res = await fetch('/api/admin/ecert/upload', { method: 'POST', body: fd });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.url) throw new Error(json?.error ?? 'Upload failed');

      onAdd(
        defaultLayer({
          type: 'image',
          mode,
          value: file.name.slice(0, 60),
          src: json.path,
          url: json.url,
          w: 0.25,
          h: 0.25,
          fit: 'contain'
        }),
        sheet
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const sheetHasEmail = !!sheet?.columns.some((c) => c.toLowerCase() === 'email');

  return (
    <Modal title="Add Text / Component" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            onClick={() => setKind('constant')}
            className={`rounded-xl border-2 p-4 text-left transition ${kind === 'constant' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-neutral-800 hover:border-white/25'}`}
          >
            <p className="font-bold text-white">Constant</p>
            <p className="mt-1 text-xs text-neutral-400">Identical on every participant&apos;s certificate — a title, the event name, a date, a logo…</p>
          </button>
          <button
            onClick={() => setKind('variable')}
            className={`rounded-xl border-2 p-4 text-left transition ${kind === 'variable' ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-neutral-800 hover:border-white/25'}`}
          >
            <p className="font-bold text-white">Variable</p>
            <p className="mt-1 text-xs text-neutral-400">Changes per participant — driven by a column in your CSV/XLSX (or the participant list).</p>
          </button>
        </div>

        {kind && (
          <>
            <div className="flex gap-2">
              <button
                onClick={() => setKindIsText(true)}
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${kindIsText === true ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300 hover:bg-white/20'}`}
              >
                Text
              </button>
              <button
                onClick={() => setKindIsText(false)}
                className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${kindIsText === false ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-300 hover:bg-white/20'}`}
              >
                Upload image
              </button>
            </div>

            {kindIsText === false && (
              <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/15 bg-neutral-950 px-4 py-6 text-sm text-neutral-400 hover:border-red-500/50">
                {uploading ? 'Uploading…' : 'Click to upload (PNG, JPG/JPEG, PDF)'}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f && kind) handleImageUpload(f, kind);
                    e.target.value = '';
                  }}
                />
              </label>
            )}

            {kindIsText === true && kind === 'constant' && (
              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  Text (same for everyone)
                </span>
                <input
                  autoFocus
                  value={constantText}
                  onChange={(e) => setConstantText(e.target.value)}
                  placeholder="e.g. Certificate of Participation"
                  className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm"
                />
              </label>
            )}

            {kindIsText === true && kind === 'variable' && (
              <div className="space-y-3 rounded-xl border border-white/10 bg-neutral-800 p-3">
                {!sheet ? (
                  <div>
                    <p className="mb-2 text-xs text-neutral-400">
                      Upload the .csv / .xlsx with one row per participant — its columns become the variables you can bind.
                    </p>
                    <label className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/15 px-4 py-5 text-sm text-neutral-400 hover:border-red-500/50">
                      {parsing ? 'Parsing…' : 'Click to upload CSV / XLSX'}
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleSheet(f);
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-neutral-400">
                      Loaded <span className="font-semibold text-white">{sheet.fileName}</span> — {sheet.rows.length} row
                      {sheet.rows.length !== 1 ? 's' : ''}. Which column drives this element?
                    </p>
                    <div className="grid max-h-40 grid-cols-2 gap-1.5 overflow-y-auto">
                      {sheet.columns.map((c) => (
                        <button
                          key={c}
                          onClick={() => setVariableColumn(c)}
                          className={`truncate rounded-lg border px-2.5 py-2 text-left text-xs transition ${variableColumn === c ? 'border-red-500 bg-red-500/15 text-white' : 'border-white/10 bg-neutral-900 text-neutral-300 hover:border-white/30'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                    <label className="flex items-start gap-2 text-xs text-neutral-300">
                      <input
                        type="checkbox"
                        className="mt-0.5"
                        checked={isName}
                        onChange={(e) => setIsName(e.target.checked)}
                      />
                      This column contains the <span className="font-semibold">participant&apos;s name</span> — the sheet
                      must then include an email column (checked at import &amp; again at send).
                    </label>
                    {isName && !sheetHasEmail && (
                      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300">
                        No “email” column found in this sheet — you won&apos;t be able to import/send without one.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-neutral-400 hover:text-white">Cancel</button>
              <Button
                disabled={
                  uploading ||
                  kindIsText === null ||
                  (kindIsText === false) ||
                  (kindIsText === true && kind === 'variable' && (!sheet || !variableColumn)) ||
                  (kindIsText === true && kind === 'constant' && constantText.trim() === '')
                }
                onClick={() => {
                  if (kindIsText === true && kind === 'variable' && sheet && variableColumn) {
                    onAdd(
                      defaultLayer({
                        mode: 'variable',
                        variable: variableColumn,
                        value: `{${variableColumn}}`,
                        role: isName ? 'name' : null
                      }),
                      sheet
                    );
                  } else if (kindIsText === true && kind === 'constant') {
                    onAdd(defaultLayer({ mode: 'constant', value: constantText.trim() }), null);
                  }
                }}
              >
                Add to certificate
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}