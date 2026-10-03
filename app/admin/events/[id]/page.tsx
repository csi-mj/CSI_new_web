'use client';

import { useParams } from 'next/navigation';
import { EventForm } from '../_components/EventForm';
import { useAdminEvents } from '../hooks/useAdminEvents';
import { DataBoundary } from '@/components/ui/data-boundary';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { events, isLoading, error } = useAdminEvents();

  const event = events.find((e) => e.id === eventId);

  return (
    <DataBoundary
      isLoading={isLoading}
      isError={!!error}
      error={error}
      isEmpty={!isLoading && !event}
      emptyTitle="Event not found"
      emptyDescription="The event you are trying to edit does not exist or has been deleted."
    >
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-col gap-2">
          <Link href="/admin/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to events
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Edit Event</h1>
          <p className="mt-1 text-sm text-muted-foreground">Update the details of this event.</p>
        </div>
        {event && <EventForm initialData={event} />}
      </div>
    </DataBoundary>
  );
}
