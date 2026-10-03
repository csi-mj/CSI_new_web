'use client';

import { useParams } from 'next/navigation';
import { DataBoundary } from '@/components/ui/data-boundary';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { FormBuilder } from './_components/FormBuilder';

import { useAdminFormBuilder } from '../../hooks/useAdminFormBuilder';

export default function FormBuilderPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { fields, isLoading, isError, error, refetch, saveForm, isSaving } = useAdminFormBuilder(eventId);

  return (
    <DataBoundary 
      isLoading={isLoading} 
      isError={isError} 
      isEmpty={false} 
      error={error} 
      onRetry={refetch}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-2">
          <Link href="/admin/events">
            <Button variant="outline" size="sm" className="w-fit">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to events
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Form Builder</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Design the registration form for this event.
          </p>
        </div>
        
        {fields && (
          <FormBuilder 
            initialFields={fields} 
            onSave={saveForm} 
            isSaving={isSaving} 
          />
        )}
      </div>
    </DataBoundary>
  );
}
