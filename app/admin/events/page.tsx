'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useConfirm } from '../_components/ui';
import { computeEventStatus } from '@/lib/eventStatus';
import { useAdminEvents, EventRow } from './hooks/useAdminEvents';

import { EventCard } from './_components/EventCard';
import { EventsHeader } from './_components/EventsHeader';
import { DataBoundary } from '@/components/ui/data-boundary';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;

export default function EventsAdmin() {
  const router = useRouter();
  const { events, isLoading, isMutating, isDeletingId, isUpdatingId, error: queryError, updateEvent, deleteEvent } = useAdminEvents();
  const [filter, setFilter] = useState<string>('all');
  const { confirmDlg, dialog } = useConfirm();

  const visible = filter === 'all' ? events : events.filter((e) => computeEventStatus(e) === filter);

  const toggleCancel = async (ev: EventRow) => {
    const cancelled = ev.status === 'cancelled';
    if (!cancelled && !(await confirmDlg(`Cancel "${ev.title}"? It will disappear from the website.`))) return;
    updateEvent({ id: ev.id, status: cancelled ? 'upcoming' : 'cancelled' });
  };

  const remove = async (ev: EventRow) => {
    if (!(await confirmDlg(`Delete "${ev.title}"? Registrations will also be deleted.`))) return;
    deleteEvent(ev.id);
  };

  return (
    <div>
      <EventsHeader
        onAddEvent={() => router.push('/admin/events/create')}
        filter={filter}
        setFilter={setFilter}
        statuses={['all', ...STATUSES]}
      />

      <div className="flex-1 min-h-0 overflow-auto">
        <DataBoundary
          isLoading={isLoading}
          isError={!!queryError}
          error={queryError}
          isEmpty={visible.length === 0}
          emptyIcon={CalendarDays}
          emptyTitle={filter !== 'all' ? `No ${filter} events` : "No events created"}
          emptyDescription={filter !== 'all' ? `There are no events matching the '${filter}' status.` : "You haven't created any events yet. Click 'Add Event' to get started."}
        >
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((ev) => (
              <EventCard
                key={ev.id}
                event={ev}
                disabled={isMutating}
                isDeleting={isDeletingId === ev.id}
                isUpdating={isUpdatingId === ev.id}
                onEdit={() => router.push(`/admin/events/${ev.id}`)}
                onCreateForm={() => router.push(`/admin/events/${ev.id}/builder`)}
                onViewParticipants={() => router.push(`/admin/events/${ev.id}/participants`)}
                onToggleCancel={() => toggleCancel(ev)}
                onDelete={() => remove(ev)}
              />
            ))}
          </div>
        </DataBoundary>
      </div>
      {dialog}
    </div>
  );
}
