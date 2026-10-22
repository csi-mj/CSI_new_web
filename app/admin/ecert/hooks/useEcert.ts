'use client';

/**
 * E-Certificate templates — react-query data layer.
 * Mirrors the other admin sections' hook patterns.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/app/admin/_components/ui';
import type {
  CertDoc,
  CreateTemplatePayload,
  EcertTemplate,
  EcertRecipient
} from '@/lib/ecert/types';

export function useEcertTemplates() {
  return useQuery<EcertTemplate[]>({
    queryKey: ['ecert-templates'],
    queryFn: async () => {
      const json = await api('/api/admin/ecert/templates', 'GET');
      return json?.data?.templates ?? [];
    }
  });
}

export function useEcertTemplate(templateId: string | null) {
  return useQuery<{
    template: EcertTemplate;
    recipient_count: number;
    sent_count: number;
  }>({
    queryKey: ['ecert-template', templateId],
    enabled: !!templateId,
    queryFn: async () => {
      const json = await api(`/api/admin/ecert/templates/${templateId}`, 'GET');
      return json?.data;
    }
  });
}

export function useTemplateMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['ecert-templates'] });
    void qc.invalidateQueries({ queryKey: ['ecert-template'] });
  };

  const create = useMutation({
    mutationFn: async (payload: CreateTemplatePayload) => {
      const json = api('/api/admin/ecert/templates', 'POST', payload);
      return (await json)?.data?.template as EcertTemplate;
    },
    onSuccess: () => {
      invalidate();
      toast.success('Certificate template created');
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const json = await api(`/api/admin/ecert/templates/${id}`, 'PATCH', patch);
      return json?.data?.template as EcertTemplate;
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await api(`/api/admin/ecert/templates/${id}`, 'DELETE');
    },
    onSuccess: () => {
      invalidate();
      toast.success('Template deleted');
    },
    onError: (e: Error) => toast.error(e.message)
  });

  return { create, update, remove };
}

/* ---------------- recipients ---------------- */

export function useEcertRecipients(templateId: string | null) {
  return useQuery<EcertRecipient[]>({
    queryKey: ['ecert-recipients', templateId],
    enabled: !!templateId,
    queryFn: async () => {
      const json = await api(`/api/admin/ecert/templates/${templateId}/recipients`, 'GET');
      return json?.data?.recipients ?? [];
    }
  });
}

export function useRecipientMutations(templateId: string | null) {
  const qc = useQueryClient();
  const invalidate = () =>
    void qc.invalidateQueries({ queryKey: ['ecert-recipients', templateId] });

  const importRows = useMutation({
    mutationFn: async ({
      source,
      rows
    }: {
      source: 'sheet' | 'participants';
      rows: { row_index: number; name: string; email: string; row_data: Record<string, string> }[];
    }) => {
      const json = await api(
        `/api/admin/ecert/templates/${templateId}/recipients`,
        'POST',
        { source, rows }
      );
      return json?.data;
    },
    onSuccess: () => invalidate(),
    onError: (e: Error) => toast.error(e.message)
  });

  const updateRecipient = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Record<string, unknown> }) => {
      const json = await api(`/api/admin/ecert/recipients/${id}`, 'PATCH', patch);
      return json?.data?.recipient as EcertRecipient;
    },
    onSuccess: (row) => {
      if (row && templateId) {
        // precise local update — no refetch of all rows
        qc.setQueryData<EcertRecipient[]>(['ecert-recipients', templateId], (old) =>
          (old ?? []).map((r) => (r.id === row.id ? row : r))
        );
      }
    },
    onError: (e: Error) => toast.error(e.message)
  });

  const clearAll = useMutation({
    mutationFn: async () => {
      await api(`/api/admin/ecert/templates/${templateId}/recipients`, 'DELETE');
    },
    onSuccess: () => invalidate(),
    onError: (e: Error) => toast.error(e.message)
  });

  return { importRows, updateRecipient, clearAll };
}

/** Saves the layered doc (used by the editor's debounced serializer). */
export async function saveTemplateDoc(id: string, doc: CertDoc, fingerprint: string) {
  const json = await api(`/api/admin/ecert/templates/${id}`, 'PATCH', {
    layers: doc,
    layers_fingerprint: fingerprint,
    data_columns: docDataColumns(doc)
  });
  return json?.data?.template;
}

function docDataColumns(doc: CertDoc) {
  const fromLayers = doc.layers
    .filter((l) => l.type === 'text' && l.mode === 'variable' && l.variable)
    .map((l) => ({ name: l.variable!, role: l.role ?? null }));
  return fromLayers;
}