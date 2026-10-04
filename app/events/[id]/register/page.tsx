'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useEventRegistration } from '../../hooks/useEventRegistration';
import { DataBoundary } from '@/components/ui/data-boundary';
import EventRegisterHero from './_components/EventRegisterHero';
import RegistrationForm from './_components/RegistrationForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { iconColors } from '@/config/colors';
import { cn } from '@/lib/utils';

export default function EventRegistrationPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError, error, refetch } = useEventRegistration(id);

  return (
    <div className="bg-background  flex min-h-screen flex-col">
      <div className="flex w-full flex-1 flex-col">
        <DataBoundary
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={refetch}
          isEmpty={!data}
          loadingTitle="Loading Event Details..."
          loadingDescription="Please wait while we fetch the registration form."
        >
          {data && (
            <div className="relative w-full flex-1">
              {/* Back to Events Button */}
              <div className="absolute top-0 left-4 md:left-14 z-[100]">
                <Button 
                  variant="outline" 
                  asChild 
                  className="bg-background/50"
                >
                  <Link href="/events" className="flex items-center gap-2">
                    <ArrowLeft className={cn("w-4 h-4 text-primary", iconColors.rose)} />
                    Back to events
                  </Link>
                </Button>
              </div>

              {/* Hero Banner (Top) */}
              <EventRegisterHero event={data.event} />

              {/* Form Section (Below the hero) */}
              <div className="relative z-20 container mx-auto px-4 pb-20">
                <RegistrationForm fields={data.formSchema.form_fields} eventId={id} event={data.event} />
              </div>
            </div>
          )}
        </DataBoundary>
      </div>
    </div>
  );
}
