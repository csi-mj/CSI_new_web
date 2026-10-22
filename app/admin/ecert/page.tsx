'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ImagePlus, Layers } from 'lucide-react';
import { Button, useConfirm } from '@/app/admin/_components/ui';
import { DataBoundary } from '@/components/ui/data-boundary';
import { useEcertTemplates, useTemplateMutations } from './hooks/useEcert';
import TemplateCard from './_components/TemplateCard';
import TemplateDetailModal from './_components/TemplateDetailModal';

/**
 * E-Certificates — the template matrix.
 * Each card: background thumbnail, event, recipient/send stats, lifecycle.
 * "Create New and Send" walks the wizard (event → background → editor).
 */
export default function EcertPage() {
  const templates = useEcertTemplates();
  const { remove } = useTemplateMutations();
  const { confirmDlg, dialog } = useConfirm();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const list = templates.data ?? [];
    const byEvent = new Map<string, typeof list>();
    for (const t of list) {
      const key = t.event_id ?? 'none';
      byEvent.set(key, [...(byEvent.get(key) ?? []), t]);
    }
    return [...byEvent.entries()];
  }, [templates.data]);

  const handleDelete = async (id: string, name: string) => {
    const ok = await confirmDlg(
      `Delete the template "${name}" and its recipient list + rendered certificates? This cannot be undone. (Any certificates already emailed are NOT affected.)`
    );
    if (ok) remove.mutate(id);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-white">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft size={16} /> Dashboard
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-2xl font-bold">E-Certificates</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Design a certificate once, bind variables to your spreadsheet, review every student&apos;s copy, then email them individually or in bulk.
          </p>
        </div>
        <Link href="/admin/ecert/new">
          <Button>
            <span className="flex items-center gap-2">
              <ImagePlus size={16} /> Create New and Send
            </span>
          </Button>
        </Link>
      </div>

      <DataBoundary
        isLoading={templates.isLoading}
        isError={templates.isError}
        error={templates.error}
        onRetry={() => void templates.refetch()}
        isEmpty={(templates.data ?? []).length === 0}
        emptyIcon={Layers}
        emptyTitle="No e-certificate templates yet"
        emptyDescription='Click "Create New and Send" to design your first one.'
      >
        <div className="space-y-10">
          {(templates.data ?? []).length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(templates.data ?? []).map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  onOpen={() => setSelectedId(t.id)}
                  onDelete={() => handleDelete(t.id, t.name)}
                />
              ))}
            </div>
          )}
          {grouped.length > 0 && (
            <p className="text-xs text-neutral-500">
              {grouped.length} event{grouped.length !== 1 ? 's' : ''} · {(templates.data ?? []).length} template
              {(templates.data ?? []).length !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
      </DataBoundary>

      {selectedId && (
        <TemplateDetailModal
          templateId={selectedId}
          onClose={() => setSelectedId(null)}
          onDelete={(id, name) => handleDelete(id, name)}
        />
      )}
      {dialog}
    </div>
  );
}