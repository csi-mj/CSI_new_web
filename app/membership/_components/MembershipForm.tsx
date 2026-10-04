'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { PremiumInput } from '@/components/shared/fields/PremiumInput';
import { PremiumTextarea } from '@/components/shared/fields/PremiumTextarea';
import { PremiumSelect } from '@/components/shared/fields/PremiumSelect';
import { PremiumFileInput } from '@/components/shared/fields/PremiumFileInput';
import { PremiumRadioGroup } from '@/components/shared/fields/PremiumRadioGroup';
import { PremiumLabel } from '@/components/shared/fields/PremiumLabel';
import { Button } from '@/components/ui/button';
import { Loader2, User, Mail, Phone, Hash, BookOpen, GraduationCap, FileText, MessageSquare, IndianRupee, RotateCcw, AlertCircle} from 'lucide-react';
import { toast } from 'sonner';
import { iconColors, translucentBgColors } from '@/config/colors';
import { useSubmitMembership } from '../_hooks/useSubmitMembership';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MembershipHeader from './MembershipHeader';
import { SuccessState } from '@/components/ui/success-state';
import { useAdminSettings } from '@/app/admin/settings/hooks/useAdminSettings';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  contact: z.string().min(10, 'Contact number is required'),
  roll_no: z.string().min(1, 'Roll number is required'),
  branch: z.string().min(1, 'Branch is required'),
  year: z.string().min(1, 'Year of study is required'),
  about_yourself: z.string().optional(),
  queries: z.string().optional(),
  payment_mode: z.enum(['online', 'cash']),
  payment_screenshot: z.any().optional(),
}).superRefine((data, ctx) => {
  if (data.payment_mode === 'online' && !data.payment_screenshot) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['payment_screenshot'],
      message: 'Payment screenshot is required for online payment',
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

export default function MembershipForm() {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { settings } = useAdminSettings();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      contact: '',
      roll_no: '',
      branch: 'CSE',
      year: '',
      about_yourself: '',
      queries: '',
      payment_mode: 'online',
    }
  });

  const { mutate: submitMembership, isPending: isSubmitting } = useSubmitMembership({
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg(null);
      form.reset();
      toast.success('Registration completed successfully!');
      document.getElementById('membership-form-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    onError: (err) => {
      setErrorMsg(err);
      setSuccess(false);
      toast.error(err);
      document.getElementById('membership-form-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  const paymentMode = form.watch('payment_mode');

  const onSubmit = async (values: FormValues) => {
    if (values.payment_mode === 'online' && !values.payment_screenshot) {
      setErrorMsg('Payment screenshot is required for online payments.');
      toast.error('Payment screenshot is required for online payments.');
      document.getElementById('membership-form-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach(key => {
      const val = values[key as keyof FormValues];
      if (val !== undefined && val !== null) {
        if (key === 'payment_screenshot' && val instanceof File) {
          formData.append(key, val);
        } else if (key !== 'payment_screenshot') {
          formData.append(key, val as string);
        }
      }
    });

    await submitMembership(formData);
  };

  if (success) {
    return (
      <SuccessState 
        title="Registration Successful!"
        description="Thank you for applying for CSI Membership! Your application has been submitted and is currently pending verification. We will reach out to you shortly."
        action={
          <Button onClick={() => { form.reset(); setSuccess(false); }} className="flex items-center gap-2" variant="outline">
            <RotateCcw className={`h-4 w-4 ${iconColors.blue}`} /> Fill Again
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-center">
      <MembershipHeader />

      <div id="membership-form-start" className="w-full flex flex-col items-center pt-8 scroll-mt-24">
        {errorMsg && (
        <div className="w-full max-w-6xl mb-8 border border-border/50 bg-card/50 rounded-lg px-6 py-4">
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
                  {errorMsg}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-6xl space-y-8">
          
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
            {/* Personal Details */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <PremiumLabel required>Full Name</PremiumLabel>
                    <FormControl>
                      <PremiumInput icon={User} colorTheme="rose" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <PremiumLabel required>Email Address</PremiumLabel>
                    <FormControl>
                      <PremiumInput icon={Mail} colorTheme="blue" placeholder="john@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="contact" render={({ field }) => (
                  <FormItem>
                    <PremiumLabel required>Phone Number</PremiumLabel>
                    <FormControl>
                      <PremiumInput icon={Phone} colorTheme="green" placeholder="+91 9876543210" type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="roll_no" render={({ field }) => (
                  <FormItem>
                    <PremiumLabel required>Roll Number</PremiumLabel>
                    <FormControl>
                      <PremiumInput icon={Hash} colorTheme="orange" placeholder="1604-XX-XXX-XXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="branch" render={({ field }) => (
                  <FormItem>
                    <PremiumLabel required>Branch</PremiumLabel>
                    <FormControl>
                      <PremiumSelect 
                        icon={BookOpen} 
                        colorTheme="purple" 
                        placeholder="Select Branch" 
                        options={['CSE', 'IT', 'CS&AI', 'CS&ML', 'CS&DS', 'AI&ML', 'AI&DS', 'ECE', 'EEE', 'EIE', 'Civil', 'Mechanical']} 
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="year" render={({ field }) => (
                  <FormItem>
                    <PremiumLabel required>Year of Study</PremiumLabel>
                    <FormControl>
                      <PremiumSelect 
                        icon={GraduationCap} 
                        colorTheme="indigo" 
                        placeholder="Select Year" 
                        options={['1st Year', '2nd Year', '3rd Year', '4th Year']} 
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="md:col-span-2 mt-4 ">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> About You
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              
              <FormField control={form.control} name="about_yourself" render={({ field }) => (
                <FormItem>
                  <PremiumLabel>Why do you want to join CSI?</PremiumLabel>
                  <FormControl>
                    <PremiumTextarea icon={FileText} colorTheme="teal" placeholder="Tell us a bit about your interests..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="queries" render={({ field }) => (
                <FormItem>
                  <PremiumLabel>Any Questions?</PremiumLabel>
                  <FormControl>
                    <PremiumTextarea icon={MessageSquare} colorTheme="yellow" placeholder="Have any doubts? Ask here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card className="md:col-span-2 mt-4 ">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-primary" /> Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
              
              <FormField control={form.control} name="payment_mode" render={({ field }) => (
                <FormItem>
                  <PremiumLabel required>Payment Method</PremiumLabel>
                  <FormControl>
                    <PremiumRadioGroup 
                      colorTheme="rose"
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[
                        { label: 'Online (UPI / QR Code)', value: 'online' },
                        { label: 'Cash (Hand over to coordinator)', value: 'cash' }
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              {paymentMode === 'online' && (
                <div className="pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* QR Code Section */}
                    <div className="bg-muted/30 p-6 rounded-xl border border-border/50 flex flex-col items-center text-center">
                      <h4 className="text-lg font-semibold mb-2">Pay Membership Fee: ₹350</h4>
                      <p className="text-muted-foreground text-sm mb-4">Scan the QR code below to complete your payment.</p>
                      {settings?.default_payment_qr_url ? (
                        <div className="bg-white p-4 rounded-xl shadow-sm mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={settings.default_payment_qr_url} 
                            alt="Payment QR Code" 
                            className="w-48 h-48 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-48 h-48 bg-muted flex items-center justify-center rounded-xl mb-2 text-muted-foreground text-sm">
                          QR not available
                        </div>
                      )}
                    </div>

                    {/* Payment Fields */}
                    <div className="space-y-6">
                      <FormField control={form.control} name="payment_screenshot" render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <PremiumLabel required>Payment Screenshot</PremiumLabel>
                          <FormControl>
                            <PremiumFileInput 
                              onChange={(file) => onChange(file)} 
                              colorTheme="blue"
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-2 px-1">Please upload a clear screenshot of your transaction (Max 5MB).</p>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                </div>
              )}
              </CardContent>
            </Card>
          </div>

          <Button 
            type="submit" 
            size="lg"
            className="mt-8 w-full font-bold h-14 text-lg rounded-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting Application...
              </>
            ) : (
              'Apply for Membership'
            )}
          </Button>
        </form>
      </Form>
      </div>
    </div>
  );
}
