'use client';

import { EventForm } from '../_components/EventForm';
import { DataBoundary } from '@/components/ui/data-boundary';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateEventPage() {
  return (
    <DataBoundary isLoading={false} isError={false} isEmpty={false}>
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-col gap-2">
          <Link href="/admin/events">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to events
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Event</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add a new event to the platform.</p>
        </div>
        <EventForm />
      </div>
    </DataBoundary>
  );
}
