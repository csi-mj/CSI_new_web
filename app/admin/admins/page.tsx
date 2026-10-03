'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, api, inputCls, useConfirm } from '../_components/ui';

interface AdminUser {
  email: string;
  added_by: string | null;
  created_at: string;
}

export default function AdminsAdmin() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { confirmDlg, dialog } = useConfirm();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAdmins(await api('/api/admin/admins', 'GET'));
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async () => {
    if (!email.includes('@')) return setError('Enter a valid email');
    setError('');
    try {
      await api('/api/admin/admins', 'POST', { email });
      setEmail('');
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (a: AdminUser) => {
    if (!(await confirmDlg(`Remove admin access for ${a.email}?`))) return;
    try {
      await api('/api/admin/admins', 'DELETE', { email: a.email });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="mb-2 font-orbitron text-2xl font-bold text-white">Admins</h1>
      <p className="mb-6 text-sm text-neutral-400">
        People listed here can sign in to this portal with their Google account. Emails must match their Google login exactly.
      </p>

      <div className="mb-6 flex gap-2">
        <input
          className={inputCls}
          placeholder="person@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <Button onClick={add}>Add admin</Button>
      </div>
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="divide-y divide-white/5 rounded-xl border border-white/10">
          {admins.map((a) => (
            <div key={a.email} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold text-white">{a.email}</p>
                <p className="text-xs text-neutral-500">
                  added by {a.added_by || 'setup'} · {new Date(a.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
              <Button variant="danger" onClick={() => remove(a)}>Remove</Button>
            </div>
          ))}
        </div>
      )}
      {dialog}
    </div>
  );
}
