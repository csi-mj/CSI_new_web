'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Field, FileUpload, Modal, api, inputCls, useConfirm } from '../_components/ui';

interface Member {
  id: string;
  sno: number | null;
  name: string;
  position: string | null;
  role: 'gb' | 'core' | 'execom';
  image_url: string | null;
  linkedin: string | null;
  github: string | null;
  mail: string | null;
  portfolio: string | null;
  gb_position: string | null;
  team_year: string | null;
  is_active: boolean;
}

const empty: Partial<Member> = { role: 'gb', is_active: true };
const roleLabels = { gb: 'Governing Body', core: 'Core Team', execom: 'Executive Committee' } as const;

export default function TeamAdmin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [role, setRole] = useState<'gb' | 'core' | 'execom'>('gb');
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [error, setError] = useState('');
  const { confirmDlg, dialog } = useConfirm();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data: Member[] = await api('/api/admin/team', 'GET');
      setMembers(data);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = members.filter(
    (m) => m.role === role && (showArchived ? !m.is_active : m.is_active)
  );

  const save = async () => {
    if (!editing?.name) return setError('Name is required');
    setError('');
    try {
      if (editing.id) {
        await api('/api/admin/team', 'PUT', editing);
      } else {
        await api('/api/admin/team', 'POST', { ...editing, role: editing.role || role });
      }
      setEditing(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (m: Member) => {
    if (!(await confirmDlg(`Delete ${m.name}? This cannot be undone.`))) return;
    try {
      await api('/api/admin/team', 'DELETE', { id: m.id });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const archiveTeam = async () => {
    if (
      !(await confirmDlg(
        'Archive the ENTIRE current team? All active members will be marked as previous team. You can then add the new team.'
      ))
    )
      return;
    try {
      await api('/api/admin/team/archive', 'POST', {});
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const restore = async (m: Member) => {
    try {
      await api('/api/admin/team', 'PUT', { id: m.id, is_active: true });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-orbitron text-2xl font-bold text-white">Team</h1>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? 'Show current team' : 'Show previous teams'}
          </Button>
          <Button variant="danger" onClick={archiveTeam}>Archive current team</Button>
          <Button onClick={() => setEditing({ ...empty, role })}>+ Add member</Button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {(Object.keys(roleLabels) as Array<keyof typeof roleLabels>).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              role === r ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            {roleLabels[r]}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <>
        {/* Mobile card list */}
        <div className="space-y-3 md:hidden">
          {visible.map((m) => (
            <div key={m.id} className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
              <div className="flex items-center gap-3">
                {m.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.image_url} alt={m.name} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-neutral-800" />
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{m.name}</p>
                  <p className="truncate text-xs text-neutral-400">
                    {m.role === 'gb' ? m.gb_position || m.position : m.position}
                    {m.portfolio ? ` · ${m.portfolio}` : ''}
                    {m.team_year ? ` · ${m.team_year}` : ''}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {m.linkedin && <a href={m.linkedin} target="_blank" className="text-xs text-blue-400 hover:underline">LinkedIn</a>}
                {m.github && <a href={m.github} target="_blank" className="text-xs text-neutral-300 hover:underline">GitHub</a>}
                <span className="flex-1" />
                {showArchived && <Button variant="ghost" onClick={() => restore(m)}>Restore</Button>}
                <Button variant="ghost" onClick={() => setEditing(m)}>Edit</Button>
                <Button variant="danger" onClick={() => remove(m)}>Delete</Button>
              </div>
            </div>
          ))}
          {visible.length === 0 && (
            <p className="p-6 text-center text-neutral-500">
              No {showArchived ? 'archived' : 'active'} members in this group.
            </p>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-900 text-neutral-400">
              <tr>
                <th className="p-3">Photo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Position</th>
                <th className="p-3">Portfolio</th>
                <th className="p-3">Year</th>
                <th className="p-3">Links</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {visible.map((m) => (
                <tr key={m.id} className="text-white">
                  <td className="p-3">
                    {m.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image_url} alt={m.name} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-neutral-800" />
                    )}
                  </td>
                  <td className="p-3 font-semibold">{m.name}</td>
                  <td className="p-3 text-neutral-300">{m.role === 'gb' ? m.gb_position || m.position : m.position}</td>
                  <td className="p-3 text-neutral-400">{m.portfolio || '—'}</td>
                  <td className="p-3 text-neutral-400">{m.team_year || '—'}</td>
                  <td className="p-3 space-x-2 text-xs">
                    {m.linkedin && <a href={m.linkedin} target="_blank" className="text-blue-400 hover:underline">LinkedIn</a>}
                    {m.github && <a href={m.github} target="_blank" className="text-neutral-300 hover:underline">GitHub</a>}
                  </td>
                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                    {showArchived && (
                      <Button variant="ghost" onClick={() => restore(m)}>Restore</Button>
                    )}
                    <Button variant="ghost" onClick={() => setEditing(m)}>Edit</Button>
                    <Button variant="danger" onClick={() => remove(m)}>Delete</Button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-neutral-500">
                    No {showArchived ? 'archived' : 'active'} members in this group.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit member' : 'Add member'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Name *">
              <input className={inputCls} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Group">
                <select className={inputCls} value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as Member['role'] })}>
                  <option value="gb">Governing Body</option>
                  <option value="core">Core Team</option>
                  <option value="execom">Executive Committee</option>
                </select>
              </Field>
              <Field label="Team year">
                <input className={inputCls} placeholder="2025-26" value={editing.team_year || ''} onChange={(e) => setEditing({ ...editing, team_year: e.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Position">
                <input className={inputCls} placeholder="e.g. Tech Captain" value={editing.position || ''} onChange={(e) => setEditing({ ...editing, position: e.target.value })} />
              </Field>
              <Field label="Portfolio (for grouping)">
                <input className={inputCls} placeholder="e.g. TECH, MEDIA" value={editing.portfolio || ''} onChange={(e) => setEditing({ ...editing, portfolio: e.target.value })} />
              </Field>
            </div>
            {editing.role === 'gb' && (
              <Field label="Governing Body position">
                <input className={inputCls} placeholder="e.g. Chief Coordinator" value={editing.gb_position || ''} onChange={(e) => setEditing({ ...editing, gb_position: e.target.value })} />
              </Field>
            )}
            <FileUpload
              folder="team"
              accept="image/*"
              label="Photo"
              currentUrl={editing.image_url || undefined}
              onUploaded={(url) => setEditing({ ...editing, image_url: url })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="LinkedIn URL">
                <input className={inputCls} value={editing.linkedin || ''} onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })} />
              </Field>
              <Field label="GitHub URL">
                <input className={inputCls} value={editing.github || ''} onChange={(e) => setEditing({ ...editing, github: e.target.value })} />
              </Field>
            </div>
            <Field label="Email">
              <input className={inputCls} value={editing.mail || ''} onChange={(e) => setEditing({ ...editing, mail: e.target.value })} />
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
