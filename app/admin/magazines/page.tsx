'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Field, FileUpload, Modal, api, inputCls, useConfirm } from '../_components/ui';

interface Magazine {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  pdf_url: string;
  pages: number;
  sort_order: number;
  is_active: boolean;
}

export default function MagazinesAdmin() {
  const [items, setItems] = useState<Magazine[]>([]);
  const [editing, setEditing] = useState<Partial<Magazine> | null>(null);
  const [error, setError] = useState('');
  const { confirmDlg, dialog } = useConfirm();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await api('/api/admin/magazines', 'GET'));
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
    if (!editing?.pdf_url) return setError('PDF is required — upload one');
    setError('');
    try {
      if (editing.id) await api('/api/admin/magazines', 'PUT', editing);
      else await api('/api/admin/magazines', 'POST', { sort_order: -1, is_active: true, ...editing });
      setEditing(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (m: Magazine) => {
    if (!(await confirmDlg(`Delete "${m.title}"?`))) return;
    try {
      await api('/api/admin/magazines', 'DELETE', { id: m.id });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-orbitron text-2xl font-bold text-white">Magazines</h1>
        <Button onClick={() => setEditing({})}>+ Add magazine</Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((m) => (
            <div key={m.id} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
              {m.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.cover_url} alt={m.title} className="mb-3 h-44 w-full rounded-lg object-cover" />
              ) : (
                <div className="mb-3 flex h-44 w-full items-center justify-center rounded-lg bg-neutral-800 text-neutral-500">No cover</div>
              )}
              <h3 className="font-semibold text-white">{m.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-400">{m.description}</p>
              <div className="mt-3 flex gap-2">
                <a href={m.pdf_url} target="_blank" className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20">View PDF</a>
                <Button variant="ghost" onClick={() => setEditing(m)}>Edit</Button>
                <Button variant="danger" onClick={() => remove(m)}>Delete</Button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500">No magazines yet.</p>}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit magazine' : 'Add magazine'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Title *">
              <input className={inputCls} placeholder="e.g. Edition 12" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className={inputCls} rows={2} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <FileUpload folder="magazines" accept="image/*" label="Cover image" currentUrl={editing.cover_url || undefined} onUploaded={(url) => setEditing({ ...editing, cover_url: url })} />
            <FileUpload folder="magazines" accept="application/pdf" label="Magazine PDF *" currentUrl={editing.pdf_url || undefined} onUploaded={(url) => setEditing({ ...editing, pdf_url: url })} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Pages">
                <input type="number" className={inputCls} value={editing.pages ?? 1} onChange={(e) => setEditing({ ...editing, pages: Number(e.target.value) })} />
              </Field>
              <Field label="Sort order (lower = first)">
                <input type="number" className={inputCls} value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} />
              </Field>
            </div>
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
