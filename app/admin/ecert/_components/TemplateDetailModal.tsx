'use client';

import { Trash2, SquarePen, Send, Layers, Type, Variable } from 'lucide-react';
import { Modal, Button } from '@/app/admin/_components/ui';
import { DataBoundary } from '@/components/ui/data-boundary';
import { useEcertTemplate } from '../hooks/useEcert';
import { parseDoc } from '@/lib/ecert/types';

/** Full detail popup for a saved template — the grid card's click target. */
export default function TemplateDetailModal({
  templateId,
  onClose,
  onDelete
}: {
  templateId: string;
  onClose: () => void;
  onDelete: (id: string, name: string) => void;
}) {
  const { data, isLoading, isError } = useEcertTemplate(templateId);
  const template = data?.template;
  const doc = template ? parseDoc((template as unknown as { layers: unknown }).layers) : null;

  return (
    <Modal title={template?.name ?? 'Template'} onClose={onClose}>
      <DataBoundary
        isLoading={isLoading}
        isError={isError}
        isEmpty={false}
        emptyIcon={Layers}
        emptyTitle=""
        emptyDescription=""
      >
        {template && doc && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-800">
              {template.background_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={template.background_url} alt={template.name} className="max-h-64 w-full object-contain" />
              ) : (
                <div className="flex h-40 items-center justify-center text-neutral-500">No background</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Event">{template.event_title ?? 'Event removed'}</Info>
              <Info label="Status">{template.status}</Info>
              <Info label="Recipients">{data?.recipient_count ?? 0}</Info>
              <Info label="Sent">{data?.sent_count ?? 0}</Info>
              <Info label="Output format">{template.format.toUpperCase()}</Info>
              <Info label="Canvas">
                {template.width} × {template.height}px
              </Info>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                <Layers size={12} /> Canvas elements ({doc.layers.length})
              </p>
              {doc.layers.length ? (
                <ul className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-white/10 bg-neutral-800 p-2 text-xs">
                  {doc.layers.map((l) => (
                    <li key={l.id} className="flex items-center gap-2 text-neutral-300">
                      {l.type === 'text' ? <Type size={12} className="shrink-0" /> : <Layers size={12} className="shrink-0" />}
                      <span>
                        {l.type === 'text'
                          ? l.mode === 'variable'
                            ? `{${l.variable}}`
                            : l.value?.slice(0, 40)
                          : 'Image element'}
                        <span className="ml-2 text-neutral-500">
                          {l.mode === 'variable' ? 'Variable' : 'Constant'}
                          {l.role === 'name' ? ' · name field' : ''}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500">No elements added yet — open the editor to design the certificate.</p>
              )}
            </div>

            {(template.data_columns?.length ?? 0) > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  <Variable size={12} /> Spreadsheet columns
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {template.data_columns?.map((c) => (
                    <span key={c.name} className="rounded-full border border-white/10 bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">
                      {c.name}
                      {c.role === 'name' && <span className="ml-1 text-red-400">*</span>}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-neutral-500">* marked as the participant&apos;s name column (email required)</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <a href={`/admin/ecert/${template.id}/edit`}>
                <Button variant="ghost">
                  <span className="flex items-center gap-2"><SquarePen size={14} /> Edit design</span>
                </Button>
              </a>
              <a href={`/admin/ecert/${template.id}/send`}>
                <Button>
                  <span className="flex items-center gap-2"><Send size={14} /> Prepare &amp; Send</span>
                </Button>
              </a>
              <Button variant="danger" onClick={() => onDelete(template.id, template.name)}>
                <span className="flex items-center gap-2"><Trash2 size={14} /> Delete</span>
              </Button>
            </div>
          </div>
        )}
      </DataBoundary>
    </Modal>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/10 bg-neutral-800 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{label}</p>
      <p className="mt-0.5 text-sm text-neutral-200">{children}</p>
    </div>
  );
}