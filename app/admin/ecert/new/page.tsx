'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronDown, FileImage, ImagePlus, Loader2, PartyPopper, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button, Field, inputCls } from '@/app/admin/_components/ui';
import { rasterizePdfFirstPage, downscaleImage } from '@/lib/ecert/pdfBackground';
import { useTemplateMutations } from '../hooks/useEcert';
import type { EcertTemplate } from '@/lib/ecert/types';

interface AdminEventLite {
  id: string;
  title: string;
  poster_url: string;
  event_date: string;
}

interface ProcessedBackground {
  blob: Blob;
  ext: string; // 'jpg' | 'png'
  mime: string; // what gets stored
  sourceMime: string; // what was uploaded (pdf kept as reference)
  sourceBlob: Blob;
  width: number;
  height: number;
  previewUrl: string;
}

type Step = 1 | 2 | 3;

/**
 * "Create New and Send" wizard:
 *   Step 1 — pick the event (thumbnails + names, newest first)
 *   Step 2 — upload the certificate background (PDF rasterized / image downscaled locally)
 *   Step 3 — confirm → template row created (crash-safe from here on) → editor
 */
export default function NewEcertPage() {
  const router = useRouter();
  const { create } = useTemplateMutations();
  const [step, setStep] = useState<Step>(1);
  const [events, setEvents] = useState<AdminEventLite[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventId, setEventId] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState<ProcessedBackground | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoadingEvents(true);
        const res = await fetch('/api/admin/events');
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
        const list = Array.isArray(json) ? json : (json?.events ?? []);
        setEvents(list as AdminEventLite[]);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not load events');
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    })();
  }, []);

  const selectedEvent = useMemo(() => events.find((e) => e.id === eventId), [events, eventId]);

  // ---------- background processing ----------
  const handleBackground = async (file: File) => {
    const ok = /\.(pdf|png|jpe?g)$/i.test(file.name) || /image\/(png|jpe?g)|application\/pdf/.test(file.type);
    if (!ok) {
      toast.error('Upload a PDF, PNG, JPG or JPEG certificate');
      return;
    }
    setProcessing(true);
    try {
      if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
        const raster = await rasterizePdfFirstPage(file, file.name);
        void raster.pages;
        const previewUrl = URL.createObjectURL(raster.blob);
        setProcessed({
          blob: raster.blob,
          ext: 'jpg',
          mime: 'image/jpeg',
          sourceMime: 'application/pdf',
          sourceBlob: file,
          width: raster.width,
          height: raster.height,
          previewUrl
        });
        toast.success('PDF loaded — page 1 will be the certificate background');
      } else {
        const out = await downscaleImage(file, file.type);
        const mime = out.blob.type || 'image/jpeg';
        const ext = mime === 'image/png' ? 'png' : 'jpg';
        setProcessed({
          blob: out.blob,
          ext,
          mime,
          sourceMime: file.type || 'image/jpeg',
          sourceBlob: file,
          width: out.width,
          height: out.height,
          previewUrl: URL.createObjectURL(out.blob)
        });
      }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Could not process the certificate file');
      setProcessed(null);
    } finally {
      setProcessing(false);
    }
  };

  // ---------- confirm → create + open editor ----------
  const handleConfirm = async () => {
    if (!selectedEvent || !processed) return;
    try {
      setProcessing(true);
      // Upload the rasterized background (path under ecert/backgrounds/)
      const slug = (fileSlug: string) =>
        fileSlug.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 60);
      const path = `ecert/backgrounds/${Date.now()}-${slug(selectedEvent.title || 'certificate')}.${processed.ext}`;
      const fd = new FormData();
      fd.append('file', new File([processed.blob], path.split('/').pop()!, { type: processed.mime }));
      fd.append('path', path);
      const upRes = await fetch('/api/admin/ecert/upload', { method: 'POST', body: fd });
      const upJson = await upRes.json().catch(() => null);
      if (!upRes.ok || !upJson?.url) throw new Error(upJson?.error ?? `Background upload failed (HTTP ${upRes.status})`);

      const template = (await create.mutateAsync({
        event_id: selectedEvent.id,
        name: (name || `E-Certificates — ${selectedEvent.title}`).slice(0, 120),
        background_url: upJson.url,
        source_url: upJson.url, // the PDF original would be re-hosted below when larger
        background_mime: processed.mime,
        storage_path: upJson.path,
        width: processed.width,
        height: processed.height,
        event_title: selectedEvent.title,
        event_poster_url: selectedEvent.poster_url || null
      })) as unknown as EcertTemplate & { source_url: string };

      // Keep the original PDF (or original image) as reference — small files only.
      if (processed.sourceMime === 'application/pdf' && processed.sourceBlob.size <= 3 * 1024 * 1024) {
        try {
          const srcPath = `ecert/backgrounds/original-${Date.now()}.pdf`;
          const sfd = new FormData();
          sfd.append('file', new File([processed.sourceBlob], 'original.pdf', { type: 'application/pdf' }));
          sfd.append('path', srcPath);
          const sres = await fetch('/api/admin/ecert/upload', { method: 'POST', body: sfd });
          if (sres.ok) {
            const sjson = await sres.json();
            await fetch(`/api/admin/ecert/templates/${template.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ source_url: sjson.url })
            });
          }
        } catch {
          /* reference only — safe to skip */
        }
      }

      toast.success('Template created — opening the designer…');
      router.push(`/admin/ecert/${template.id}/edit`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not create the template');
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 text-white">
      <Link href="/admin/ecert" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
        ← All e-certificates
      </Link>

      {/* step indicators */}
      <div className="mb-8 flex items-center gap-2 text-xs">
        {(['1 Choose event', '2 Certificate', '3 Confirm'] as const).map((label, i) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-semibold transition ${
              step === i + 1 ? 'border-red-500/60 bg-red-600/20 text-white' : step > (i + 1) ? 'border-emerald-500/40 text-emerald-300' : 'border-white/10 text-neutral-500'
            }`}
          >
            {step > i + 1 ? <CheckCircle2 size={13} /> : <span className="opacity-70">{i + 1}</span>}
            {label}
          </div>
        ))}
      </div>

      {step === 1 && (
        <section className="space-y-5">
          <div>
            <h1 className="font-orbitron text-2xl font-bold">Choose the event</h1>
            <p className="mt-1 text-sm text-neutral-400">The certificate template is tied to one event so its recipient list, send history and designs stay organized.</p>
          </div>
          {loadingEvents ? (
            <div className="flex items-center gap-2 py-10 text-neutral-400"><Loader2 className="animate-spin" size={18} /> Loading events…</div>
          ) : events.length === 0 ? (
            <p className="rounded-lg border border-white/10 bg-neutral-900 p-4 text-sm text-neutral-400">
              No events found — create an event in the Events section first.
            </p>
          ) : (
            <EventDropdown events={events} value={eventId} onChange={(v) => setEventId(v)} />
          )}
          <Field label="Template name (optional)">
            <input
              className={inputCls}
              placeholder={`E-Certificates — ${selectedEvent?.title ?? 'auto from event'}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Button disabled={!eventId} onClick={() => setStep(2)}>
            Continue →
          </Button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-5">
          <div>
            <h1 className="font-orbitron text-2xl font-bold">Upload the certificate</h1>
            <p className="mt-1 text-sm text-neutral-400">
              PDF, PNG, JPG or JPEG. PDFs become the page-1 image automatically; large images are resized right here in your browser (nothing over ~3 MB ever leaves your machine).
            </p>
          </div>

          <UploadZone processing={processing} processed={processed} onFile={handleBackground} onClear={() => setProcessed(null)} />

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
            <Button disabled={!processed || processing} onClick={() => setStep(3)}>Confirm →</Button>
          </div>
        </section>
      )}

      {step === 3 && selectedEvent && processed && (
        <section className="space-y-5">
          <div>
            <h1 className="font-orbitron text-2xl font-bold flex items-center gap-2"><PartyPopper size={22} className="text-emerald-400" /> Confirm &amp; open the designer</h1>
            <p className="mt-1 text-sm text-neutral-400">
              After confirming, this template is saved as a <span className="text-amber-300">draft</span> — you can leave and come back at any time without losing anything.
            </p>
          </div>
          <div className="grid gap-3 rounded-xl border border-white/10 bg-neutral-900 p-4 text-sm sm:grid-cols-2">
            <InfoRow label="Event" value={selectedEvent.title} />
            <InfoRow label="Template name" value={name || `E-Certificates — ${selectedEvent.title}`} />
            <InfoRow label="Background" value={`${(processed.sourceMime.split('/')[1] || 'file').toUpperCase()} → ${processed.width} × ${processed.height}px`} />
            <InfoRow label="Output" value="You choose pdf/jpg/jpeg at send time" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => setStep(2)} disabled={processing}>← Back</Button>
            <Button onClick={handleConfirm} disabled={processing}>
              {processing ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={14} /> Working…</span> : 'Confirm & open designer'}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

function EventDropdown({
  events,
  value,
  onChange
}: {
  events: AdminEventLite[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = events.find((e) => e.id === value);
  useEffect(() => {
    const close = () => setOpen(false);
    if (open) {
      window.addEventListener('click', close);
      return () => window.removeEventListener('click', close);
    }
  }, [open]);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-neutral-800 px-3 py-2.5 text-left text-sm hover:border-red-500/40"
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-3">
            {selected.poster_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selected.poster_url} alt="" className="h-9 w-14 shrink-0 rounded object-cover" />
            )}
            <span className="truncate text-white">{selected.title}</span>
          </span>
        ) : (
          <span className="text-neutral-500">Select an event…</span>
        )}
        <ChevronDown size={16} className={`shrink-0 text-neutral-400 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-white/10 bg-neutral-900 py-1 shadow-2xl">
          {events.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => {
                onChange(e.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-white/10"
            >
              {e.poster_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={e.poster_url} alt="" className="h-9 w-14 shrink-0 rounded object-cover" />
              ) : (
                <span className="flex h-9 w-14 shrink-0 items-center justify-center rounded bg-neutral-800">
                  <FileImage size={14} className="text-neutral-500" />
                </span>
              )}
              <span className="truncate text-white">{e.title}</span>
              {value === e.id && <CheckCircle2 size={14} className="ml-auto shrink-0 text-emerald-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadZone({
  processing,
  processed,
  onFile,
  onClear
}: {
  processing: boolean;
  processed: ProcessedBackground | null;
  onFile: (file: File) => void;
  onClear: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`relative rounded-xl border-2 border-dashed p-6 transition ${dragOver ? 'border-red-500 bg-red-500/5' : 'border-white/15 bg-neutral-900'}`}
    >
      {processed ? (
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={processed.previewUrl} alt="Certificate preview" className="max-h-72 rounded-lg border border-white/10 shadow-lg" />
          <p className="text-xs text-neutral-500">
            {processed.width} × {processed.height}px · {(processed.blob.size / 1024).toFixed(0)} KB after processing · page 1 of the PDF
          </p>
          <button onClick={onClear} className="text-xs text-red-400 hover:text-red-300">
            Choose a different file
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center gap-3 py-10 text-center">
          {processing ? (
            <>
              <Loader2 className="animate-spin text-red-400" size={28} />
              <p className="text-sm text-neutral-400">Processing…</p>
            </>
          ) : (
            <>
              <Upload className="text-neutral-400" size={28} />
              <p className="text-sm font-semibold text-white">Click or drop your certificate here</p>
              <p className="text-xs text-neutral-500">PDF, PNG, JPG, JPEG</p>
              <span className="rounded bg-white/10 px-3 py-2 text-xs font-semibold">Browse files</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                  e.target.value = '';
                }}
              />
            </>
          )}
        </label>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-0.5 text-neutral-200">{value}</p>
    </div>
  );
}