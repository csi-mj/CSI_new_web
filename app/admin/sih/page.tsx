'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, api, useConfirm } from '../_components/ui';

interface Reg {
  id: string;
  team_name: string;
  team_leader: string;
  roll_number: string;
  phone: string;
  email: string;
  file_url: string | null;
  created_at: string;
}

export default function SihAdmin() {
  const [rows, setRows] = useState<Reg[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { confirmDlg, dialog } = useConfirm();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await api('/api/admin/sih', 'GET'));
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (r: Reg) => {
    if (!(await confirmDlg(`Delete registration of team "${r.team_name}"?`))) return;
    try {
      await api('/api/admin/sih', 'DELETE', { id: r.id });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const exportCsv = () => {
    const header = ['Team Name', 'Team Leader', 'Roll Number', 'Phone', 'Email', 'File URL', 'Registered At'];
    const lines = rows.map((r) =>
      [r.team_name, r.team_leader, r.roll_number, r.phone, r.email, r.file_url || '', r.created_at]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    );
    const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sih-registrations.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-orbitron text-2xl font-bold text-white">SIH Registrations ({rows.length})</h1>
        <Button variant="ghost" onClick={exportCsv} disabled={rows.length === 0}>Export CSV</Button>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-neutral-500">No registrations yet.</p>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/10 bg-neutral-900/60 p-4">
                <p className="font-semibold text-white">{r.team_name}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {r.team_leader} · {r.roll_number} · {r.phone}
                </p>
                <p className="text-xs text-neutral-500">{r.email}</p>
                <div className="mt-3 flex gap-2">
                  {r.file_url && (
                    <a href={r.file_url} target="_blank" className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20">
                      Team file
                    </a>
                  )}
                  <Button variant="danger" onClick={() => remove(r)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-900 text-neutral-400">
                <tr>
                  <th className="p-3">Team</th>
                  <th className="p-3">Leader</th>
                  <th className="p-3">Roll No</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">File</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((r) => (
                  <tr key={r.id} className="text-white">
                    <td className="p-3 font-semibold">{r.team_name}</td>
                    <td className="p-3">{r.team_leader}</td>
                    <td className="p-3 text-neutral-300">{r.roll_number}</td>
                    <td className="p-3 text-neutral-300">{r.phone}</td>
                    <td className="p-3 text-neutral-400">{r.email}</td>
                    <td className="p-3">
                      {r.file_url ? (
                        <a href={r.file_url} target="_blank" className="text-blue-400 hover:underline">Open</a>
                      ) : '—'}
                    </td>
                    <td className="p-3 text-neutral-400">
                      {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="danger" onClick={() => remove(r)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {dialog}
    </div>
  );
}
