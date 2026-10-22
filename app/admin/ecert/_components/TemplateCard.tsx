'use client';

import { MoreVertical, Send, SquarePen, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { EcertTemplate } from '@/lib/ecert/types';
import { renderTemplateThumb, templateThumbFor } from '@/lib/ecert/thumbs';

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  ready: 'border-blue-500/30 bg-blue-500/15 text-blue-300',
  sent: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
};

export default function TemplateCard({
  template,
  onOpen,
  onDelete
}: {
  template: EcertTemplate;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  // The card shows the DESIGNED certificate (with all layers rendered) — the
  // bare uploaded background is only a fallback if the design render fails.
  const [preview, setPreview] = useState<string | null>(
    () => templateThumbFor(template.id, template.layers_fingerprint) ?? template.background_url
  );
  const [triedRender, setTriedRender] = useState(false);

  useEffect(() => {
    if (triedRender) return;
    let alive = true;
    setTriedRender(true);
    void renderTemplateThumb(template)
      .then((dataUrl) => {
        if (alive) setPreview(dataUrl);
      })
      .catch((e) => {
        console.warn('Template preview render failed (falling back to background):', e);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id, template.layers_fingerprint]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 transition hover:border-red-500/40">
      <button onClick={onOpen} className="block w-full text-left">
        <div className="relative aspect-[10/7] w-full overflow-hidden bg-neutral-800">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt={template.name}
              className="h-full w-full object-cover transition group-hover:scale-[1.02]"
              loading="lazy"
              onError={() => {
                if (preview !== template.background_url && template.background_url) setPreview(template.background_url);
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
              No background
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-semibold text-white">{template.name}</h3>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                STATUS_STYLES[template.status] ?? STATUS_STYLES.draft
              }`}
            >
              {template.status}
            </span>
          </div>
          <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
            {template.event_title ?? 'Event removed'}
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            {template.recipient_count ?? 0} recipient{(template.recipient_count ?? 0) !== 1 ? 's' : ''}
            {(template.sent_count ?? 0) > 0 && ` · ${(template.sent_count ?? template.sent_count)} sent`}
            {' · '}
            {template.format.toUpperCase()}
          </p>
        </div>
      </button>

      <div className="absolute right-3 top-3 z-10" onClick={(e) => e.stopPropagation()}>
        <button
          aria-label="Template actions"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg bg-black/60 p-1.5 text-neutral-300 opacity-0 backdrop-blur transition hover:text-white group-hover:opacity-100"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-40 overflow-hidden rounded-lg border border-white/10 bg-neutral-900 py-1 text-sm shadow-xl">
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push(`/admin/ecert/${template.id}/edit`);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-neutral-300 hover:bg-white/10"
            >
              <SquarePen size={14} /> Edit design
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push(`/admin/ecert/${template.id}/send`);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-neutral-300 hover:bg-white/10"
            >
              <Send size={14} /> Prepare &amp; Send
            </button>
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export { STATUS_STYLES };