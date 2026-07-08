'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Field, FileUpload, Modal, api, inputCls, useConfirm } from '../_components/ui';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  pdf_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export default function ResourcesAdmin() {
  const [items, setItems] = useState<Resource[]>([]);
  const [editing, setEditing] = useState<Partial<Resource> | null>(null);
  const [error, setError] = useState('');
  const { confirmDlg, dialog } = useConfirm();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api('/api/admin/resources', 'GET'));
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing?.title) return setError('Title is required');
    if (!editing?.pdf_url && !editing?.link_url) return setError('Upload a PDF or provide a link');
    setError('');
    try {
      if (editing.id) await api('/api/admin/resources', 'PUT', editing);
      else await api('/api/admin/resources', 'POST', { sort_order: items.length, is_active: true, ...editing });
      setEditing(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (r: Resource) => {
    if (!(await confirmDlg(`Delete "${r.title}"?`))) return;
    try {
      await api('/api/admin/resources', 'DELETE', { id: r.id });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-orbitron text-2xl font-bold text-white">Resources</h1>
        <Button onClick={() => setEditing({})}>+ Add resource</Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
              {r.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image_url} alt={r.title} className="mb-3 h-32 w-full rounded-lg object-cover" />
              )}
              <h3 className="font-semibold text-white">{r.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-400">{r.description}</p>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" onClick={() => setEditing(r)}>Edit</Button>
                <Button variant="danger" onClick={() => remove(r)}>Delete</Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500">No resources yet.</p>}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit resource' : 'Add resource'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Title *">
              <input className={inputCls} placeholder="e.g. Cyber Security" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className={inputCls} rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <FileUpload folder="resources" accept="image/*" label="Card image" currentUrl={editing.image_url || undefined} onUploaded={(url) => setEditing({ ...editing, image_url: url })} />
            <FileUpload folder="resources" accept="application/pdf" label="Resource PDF" currentUrl={editing.pdf_url || undefined} onUploaded={(url) => setEditing({ ...editing, pdf_url: url })} />
            <Field label="Or external link (used if no PDF)">
              <input className={inputCls} placeholder="https://…" value={editing.link_url || ''} onChange={(e) => setEditing({ ...editing, link_url: e.target.value })} />
            </Field>
            <Field label="Sort order (lower = first)">
              <input type="number" className={inputCls} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
            </Field>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </Modal>
      )}
      {dialog}
    </div>
  );
}
