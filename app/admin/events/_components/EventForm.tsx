'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '../../_components/ui';
import { useAdminEvents, EventRow } from '../hooks/useAdminEvents';
import { Loader2 } from 'lucide-react';

function toDatetimeLocal(isoStr?: string | null) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${h}:${min}`;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  poster_url: z.string().optional().nullable(),
  category: z.string().optional(),
  event_date: z.string().min(1, 'Start date is required'),
  event_end_date: z.string().optional().nullable(),
  venue: z.string().optional(),
  is_registration_open: z.boolean(),
  is_paid: z.boolean(),
  entry_fee: z.coerce.number().optional().nullable(),
  csi_entry_fee: z.coerce.number().optional().nullable(),
  payment_qr_url: z.string().optional().nullable(),
  registration_start_date: z.string().optional().nullable(),
  registration_end_date: z.string().optional().nullable(),
  max_participants: z.coerce.number().optional().nullable(),
  tags: z.string().optional(),
  email_template: z.string().optional().nullable(),
});

export function EventForm({ initialData }: { initialData?: Partial<EventRow> }) {
  const router = useRouter();
  const { createEvent, updateEvent, isMutating } = useAdminEvents();
  const [submitError, setSubmitError] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      poster_url: initialData?.poster_url || null,
      category: initialData?.category || '',
      event_date: toDatetimeLocal(initialData?.event_date),
      event_end_date: toDatetimeLocal(initialData?.event_end_date),
      venue: initialData?.venue || '',
      is_registration_open: initialData?.is_registration_open ?? false,
      is_paid: initialData?.is_paid ?? false,
      entry_fee: initialData?.entry_fee ?? null,
      csi_entry_fee: initialData?.csi_entry_fee ?? null,
      payment_qr_url: initialData?.payment_qr_url || null,
      registration_start_date: toDatetimeLocal(initialData?.registration_start_date),
      registration_end_date: toDatetimeLocal(initialData?.registration_end_date),
      max_participants: initialData?.max_participants ?? null,
      tags: initialData?.tags?.join(', ') || '',
      email_template: initialData?.email_template || '',
    },
  });

  const isPaid = form.watch('is_paid');

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSubmitError('');
    const payload: Partial<EventRow> = {
      ...values,
      tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      event_date: new Date(values.event_date).toISOString(),
      event_end_date: values.event_end_date ? new Date(values.event_end_date).toISOString() : null,
      registration_start_date: values.registration_start_date ? new Date(values.registration_start_date).toISOString() : null,
      registration_end_date: values.registration_end_date ? new Date(values.registration_end_date).toISOString() : null,
    };
    
    if (initialData?.id) payload.id = initialData.id;

    const onSuccess = () => router.push('/admin/events');
    const onError = (error: Error) => setSubmitError(error.message || 'An error occurred while saving.');

    if (payload.id) {
      updateEvent(payload, { onSuccess, onError });
    } else {
      createEvent(payload, { onSuccess, onError });
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Core details about the event.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="Event description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control as any}
                name="poster_url"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FileUpload
                        folder="events"
                        accept="image/*"
                        label="Poster"
                        currentUrl={field.value || undefined}
                        onUploaded={(url) => form.setValue('poster_url', url)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control as any}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Hackathon" {...field} />
                      </FormControl>
                      <FormDescription>
                        Status is automatically managed based on dates.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. AI, Workshop, Coding" {...field} />
                      </FormControl>
                      <FormDescription>Helps students filter events.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scheduling & Venue</CardTitle>
              <CardDescription>When and where the event takes place.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control as any}
                  name="event_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start date & time *</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="event_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End date & time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue</FormLabel>
                    <FormControl>
                      <Input placeholder="Event venue" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registration & Capacity</CardTitle>
              <CardDescription>Manage how and when students can register.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control as any}
                name="is_registration_open"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4 bg-muted/20">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Registration Open
                      </FormLabel>
                      <FormDescription>
                        Manually toggle whether users can register right now.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control as any}
                  name="registration_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Start</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="registration_end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration End</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control as any}
                name="max_participants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 100" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormDescription>Leave blank for unlimited capacity.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticketing & Payment</CardTitle>
              <CardDescription>Configure entry fees and payment collection.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control as any}
                name="is_paid"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Paid Event
                      </FormLabel>
                      <FormDescription>
                        Check this if the event requires an entry fee.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isPaid && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 rounded-md border border-border p-4 bg-muted/20">
                  <FormField
                    control={form.control as any}
                    name="entry_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entry Fee (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 500" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="csi_entry_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CSI Member Fee (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 200 (or 0 for free)" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control as any}
                    name="payment_qr_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            folder="events"
                            accept="image/*"
                            label="Payment QR Code (Optional)"
                            currentUrl={field.value || undefined}
                            onUploaded={(url) => form.setValue('payment_qr_url', url)}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank to use the global default CSI payment QR code.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Post-Registration Actions</CardTitle>
              <CardDescription>Customize the confirmation email sent to participants when they register.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control as any}
                name="email_template"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Guidelines (Plain Text)</FormLabel>
                    <FormControl>
                      <Textarea 
                        rows={6} 
                        placeholder={"Dear Participant,\n\nThank you for registering...\n\nGuidelines:\n* Bring your laptop...\n* Join WhatsApp group..."} 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      This text will be wrapped in a professional CSI email layout. The system will automatically generate and attach the participant's unique QR code at the bottom of the email, so you do not need to add it here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>


          {submitError && <p className="text-sm font-medium text-destructive">{submitError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => router.push('/admin/events')} disabled={isMutating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Event
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
