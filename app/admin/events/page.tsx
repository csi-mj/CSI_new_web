'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Field, FileUpload, Modal, api, inputCls, useConfirm } from '../_components/ui';
import { computeEventStatus } from '@/lib/eventStatus';

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  poster_url: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  event_date: string;
  event_end_date: string | null;
  venue: string | null;
  category: string | null;
  is_registration_open: boolean;
  is_active: boolean;
}

const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;
const statusColors: Record<string, string> = {
  upcoming: 'bg-blue-500/20 text-blue-300',
  ongoing: 'bg-green-500/20 text-green-300',
  completed: 'bg-neutral-500/20 text-neutral-300',
  cancelled: 'bg-red-500/20 text-red-300'
};

export default function EventsAdmin() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [editing, setEditing] = useState<Partial<EventRow> | null>(null);
  const [error, setError] = useState('');
  const { confirmDlg, dialog } = useConfirm();
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setEvents(await api('/api/admin/events', 'GET'));
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = filter === 'all' ? events : events.filter((e) => computeEventStatus(e) === filter);

  const save = async () => {
    if (!editing?.title) return setError('Title is required');
    if (!editing?.event_date) return setError('Event date is required');
    setError('');
    try {
      if (editing.id) await api('/api/admin/events', 'PUT', editing);
      else await api('/api/admin/events', 'POST', { status: 'upcoming', is_active: true, ...editing });
      setEditing(null);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const toggleCancel = async (ev: EventRow) => {
    const cancelled = ev.status === 'cancelled';
    if (!cancelled && !(await confirmDlg(`Cancel "${ev.title}"? It will disappear from the website.`))) return;
    try {
      await api('/api/admin/events', 'PUT', { id: ev.id, status: cancelled ? 'upcoming' : 'cancelled' });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const remove = async (ev: EventRow) => {
    if (!(await confirmDlg(`Delete "${ev.title}"? Registrations will also be deleted.`))) return;
    try {
      await api('/api/admin/events', 'DELETE', { id: ev.id });
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-orbitron text-2xl font-bold text-white">Events</h1>
        <Button onClick={() => setEditing({})}>+ Add event</Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
              filter === s ? 'bg-red-600 text-white' : 'bg-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <p className="text-neutral-500">Loading…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((ev) => (
            <div key={ev.id} className="rounded-2xl border border-white/10 bg-neutral-900/60 p-4">
              {ev.poster_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ev.poster_url} alt={ev.title} className="mb-3 h-36 w-full rounded-lg object-cover" />
              )}
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-semibold text-white">{ev.title}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[computeEventStatus(ev)]}`}>
                  {computeEventStatus(ev)}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {new Date(ev.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {ev.venue ? ` · ${ev.venue}` : ''}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button variant="ghost" onClick={() => setEditing(ev)}>Edit</Button>
                <Button variant="ghost" onClick={() => toggleCancel(ev)}>
                  {ev.status === 'cancelled' ? 'Restore' : 'Cancel event'}
                </Button>
                <Button variant="danger" onClick={() => remove(ev)}>Delete</Button>
              </div>
            </div>
          ))}
          {visible.length === 0 && <p className="text-neutral-500">No events.</p>}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? 'Edit event' : 'Add event'} onClose={() => setEditing(null)}>
          <div className="space-y-4">
            <Field label="Title *">
              <input className={inputCls} value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea className={inputCls} rows={3} value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </Field>
            <FileUpload
              folder="events"
              accept="image/*"
              label="Poster"
              currentUrl={editing.poster_url || undefined}
              onUploaded={(url) => setEditing({ ...editing, poster_url: url })}
            />
            <Field label="Category">
              <input className={inputCls} placeholder="e.g. Hackathon" value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
            </Field>
            <p className="text-xs text-neutral-500">
              Status is automatic: upcoming before the start date, ongoing between start and end, completed after the end date. Use &quot;Cancel event&quot; on the card to cancel.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Start date & time *">
                <input type="datetime-local" className={inputCls} value={editing.event_date?.slice(0, 16) || ''} onChange={(e) => setEditing({ ...editing, event_date: new Date(e.target.value).toISOString() })} />
              </Field>
              <Field label="End date & time">
                <input type="datetime-local" className={inputCls} value={editing.event_end_date?.slice(0, 16) || ''} onChange={(e) => setEditing({ ...editing, event_end_date: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </Field>
            </div>
            <Field label="Venue">
              <input className={inputCls} value={editing.venue || ''} onChange={(e) => setEditing({ ...editing, venue: e.target.value })} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={editing.is_registration_open || false}
                onChange={(e) => setEditing({ ...editing, is_registration_open: e.target.checked })}
              />
              Registration open
            </label>
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
