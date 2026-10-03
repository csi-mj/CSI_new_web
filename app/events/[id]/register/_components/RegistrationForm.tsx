'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SuccessState } from '@/components/ui/success-state';
import { DynamicField } from './form/DynamicField';
import { PaymentDetails } from './form/PaymentDetails';
import type { Event, RegistrationFormField } from '@/lib/types/events';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { iconColors, translucentBgColors, bgColors } from '@/config/colors';
import { cn } from '@/lib/utils';

interface RegistrationFormProps {
  fields: RegistrationFormField[];
  eventId: string;
  event: Event;
}

export default function RegistrationForm({
  fields,
  eventId,
  event
}: RegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Dynamically generate the Zod schema based on the fields
  const formSchema = React.useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      // The builder type supports checkbox/radio which are now in RegistrationFormField
      if (field.type === 'checkbox') {
        fieldSchema = z.boolean().default(false);
        if (field.required) {
          fieldSchema = z.boolean().refine((val) => val === true, {
            message: `${field.label} is required`
          });
        }
      } else if (field.type === 'email') {
        let strSchema = z.string().email({ message: "Invalid email address" });
        fieldSchema = field.required 
          ? strSchema 
          : z.union([strSchema, z.literal('')]).optional();
      } else if (field.type === 'url') {
        let strSchema = z.string().url({ message: "Invalid URL" });
        fieldSchema = field.required 
          ? strSchema 
          : z.union([strSchema, z.literal('')]).optional();
      } else if (field.type === 'tel') {
        let strSchema = z.string()
          .min(10, { message: "Invalid phone number (too short)" })
          .regex(/^\d+$/, { message: "Phone number can only contain digits" });
        fieldSchema = field.required 
          ? strSchema 
          : z.union([strSchema, z.literal('')]).optional();
      } else if (field.type === 'number') {
        fieldSchema = z.coerce.number({ message: "Must be a valid number" });
        if (!field.required) fieldSchema = fieldSchema.optional();
      } else {
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, {
            message: `${field.label} is required`
          });
        } else {
          fieldSchema = fieldSchema.optional();
        }
      }

      shape[field.name] = fieldSchema;
    });

    let baseSchema: z.ZodTypeAny = z.object(shape);

    if (event.is_paid) {
      baseSchema = z.object({
        ...shape,
        payment_mode: z.enum(['online', 'cash']).default('online'),
        transaction_id: z.string().optional(),
        payment_screenshot: z.any().optional()
      }).superRefine((data: any, ctx) => {
        const isCsi = data.is_csi_member === true || data.is_csi_member === 'Yes' || data.is_csi_member === 'yes';
        const fee = (isCsi && event.csi_entry_fee != null) ? event.csi_entry_fee : (event.entry_fee || 0);

        if (fee > 0 && data.payment_mode === 'online') {
          if (!data.transaction_id || data.transaction_id.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Transaction ID is required for online payments',
              path: ['transaction_id']
            });
          }
          if (!data.payment_screenshot) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Payment screenshot is required for online payments',
              path: ['payment_screenshot']
            });
          }
        }
      });
    }

    return baseSchema;
  }, [fields, event.is_paid, event.csi_entry_fee, event.entry_fee]);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: fields.reduce(
      (acc, field) => {
        if (field.type === 'checkbox') {
          acc[field.name] = false;
        } else {
          acc[field.name] = '';
        }
        return acc;
      },
      { payment_mode: 'online' } as Record<string, any>
    )
  });

  const isCsiMemberVal = form.watch('is_csi_member');
  const isCsiMember = isCsiMemberVal === true || isCsiMemberVal === 'Yes' || isCsiMemberVal === 'yes';
  const activeFee = (isCsiMember && event.csi_entry_fee != null) ? event.csi_entry_fee : (event.entry_fee || 0);

  async function onSubmit(values: any) {
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorMsg = result.error?.message || 'Failed to submit registration. Please check your information and try again.';
        setServerError(errorMsg);
        toast.error(errorMsg);
        setIsSubmitting(false);
        // Scroll to the error alert slightly above the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setIsSuccess(true);
      toast.success('Registration completed successfully!');
    } catch (error: any) {
      const errorMsg = error.message || 'An unexpected error occurred during registration. Please try again.';
      setServerError(errorMsg);
      toast.error(errorMsg);
      console.error('Submission error:', error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <SuccessState 
        title="Registration Successful!" 
        description="We have received your registration. We'll send you an email with more details shortly." 
        action={
          <Button variant="outline" asChild className="px-8 font-semibold">
            <Link href="/events" className="flex items-center gap-2">
              <ArrowLeft className={cn("size-4", iconColors.rose)} />
              Back to Events
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="border-border/50 mb-10 w-full border-b pb-6 text-center">
        <h2 className="text-primary text-3xl font-black md:text-5xl">
          Complete Registration
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">
          Please fill out the form below to secure your spot.
        </p>
      </div>

      {serverError && (
        <div className="w-full max-w-6xl mb-8 border border-border/50 bg-card/50 rounded-lg px-6 py-4 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div className={`p-3 rounded-full ${translucentBgColors.red} shrink-0`}>
                <AlertCircle className={`h-6 w-6 ${iconColors.red}`} />
              </div>
              <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
                <h5 className="text-xl font-bold m-0 text-foreground">
                  Registration Failed
                </h5>
                <p className="text-base text-muted-foreground m-0 leading-relaxed">
                  {serverError}
                </p>
              </div>
            </div>
            
            {serverError.toLowerCase().includes('membership') && (
              <Button asChild className={`shrink-0 font-semibold shadow-md ${bgColors.red} mt-4 sm:mt-0`}>
                <Link href="/membership">
                  Buy Membership
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}

      <Form {...(form as any)}>
        <form
          noValidate
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-6xl space-y-8"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
            {fields.map((field) => (
              <DynamicField key={field.name} form={form} field={field} />
            ))}
          </div>

          <PaymentDetails event={event} form={form} activeFee={activeFee} />

          <Button
            type="submit"
            size="lg"
            className="mt-8 h-12 w-full text-base font-bold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Registration'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
