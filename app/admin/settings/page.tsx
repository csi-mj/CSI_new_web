'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUpload } from '@/app/admin/_components/ui';
import { DataBoundary } from '@/components/ui/data-boundary';
import { Loader2, Settings } from 'lucide-react';
import { useAdminSettings } from './hooks/useAdminSettings';

const settingsSchema = z.object({
  platform_name: z.string().min(1, 'Platform name is required'),
  logo_url: z.string().optional().nullable(),
  default_payment_qr_url: z.string().optional().nullable(),
  contact_email: z.string().email('Invalid email address').or(z.literal('')).optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  instagram_url: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
  linkedin_url: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
  website_url: z.string().url('Must be a valid URL').or(z.literal('')).optional().nullable(),
});

export default function SettingsPage() {
  const { settings, isLoading, isError, error, updateSettings, isUpdating } = useAdminSettings();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      platform_name: '',
      logo_url: null,
      default_payment_qr_url: null,
      contact_email: '',
      contact_phone: '',
      instagram_url: '',
      linkedin_url: '',
      website_url: '',
    },
  });

  // Reset form values when data loads
  useEffect(() => {
    if (settings) {
      form.reset({
        platform_name: settings.platform_name || 'CSI Chapter',
        logo_url: settings.logo_url || null,
        default_payment_qr_url: settings.default_payment_qr_url || null,
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        instagram_url: settings.instagram_url || '',
        linkedin_url: settings.linkedin_url || '',
        website_url: settings.website_url || '',
      });
    }
  }, [settings, form]);

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    updateSettings(values);
  };

  return (
    <DataBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!settings}
    >
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your global organization settings and defaults.</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle>Branding & Defaults</CardTitle>
                <CardDescription>Global branding details that appear across the platform.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="platform_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. CSI VNRVJIET" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            folder="settings"
                            accept="image/*"
                            label="Organization Logo"
                            currentUrl={field.value || undefined}
                            onUploaded={(url) => form.setValue('logo_url', url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="default_payment_qr_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            folder="settings"
                            accept="image/*"
                            label="Default Payment QR Code"
                            currentUrl={field.value || undefined}
                            onUploaded={(url) => form.setValue('default_payment_qr_url', url)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Public contact details for student queries.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g. contact@csi.com" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. +91 98765 43210" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Links to your organization's social media pages.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="instagram_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://instagram.com/..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://linkedin.com/in/..." {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Main Website URL</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://your-website.com" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DataBoundary>
  );
}
