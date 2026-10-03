'use client';

import EventCard from './EventCard';
import type { Event } from '@/lib/types/events';
import { useEvents } from '../hooks/useEvents';
import { DataBoundary } from '@/components/ui/data-boundary';

type Tab = 'upcoming' | 'ongoing' | 'past';

export default function EventGrid({ activeTab }: { activeTab: Tab }) {
  const {
    data: events = [],
    isLoading,
    isError,
    error,
    refetch
  } = useEvents(activeTab);

  return (
    <DataBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      onRetry={refetch}
      isEmpty={events.length === 0}
      loadingTitle="Loading events..."
      loadingDescription={`Fetching ${activeTab} events for you.`}
      emptyTitle={`No ${activeTab} events`}
      emptyDescription={`Check back later for new ${activeTab} events or explore other categories.`}
    >
      <div className="grid h-full grid-cols-1 gap-10 p-4 md:p-12 xl:grid-cols-2">
        {events.map((ev, i) => (
          <EventCard key={ev.id} event={ev} reverse={i % 2 !== 0} />
        ))}
      </div>
    </DataBoundary>
  );
}
