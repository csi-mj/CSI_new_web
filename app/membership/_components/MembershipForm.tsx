'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowRight,
  Banknote,
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Hash,
  IndianRupee,
  Mail,
  MessageSquare,
  Phone,
  QrCode,
  RotateCcw,
  Upload,
  User
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useSubmitMembership } from '../_hooks/useSubmitMembership';
import MembershipHeader from './MembershipHeader';
import { SuccessState } from '@/components/ui/success-state';
import { useAdminSettings } from '@/app/admin/settings/hooks/useAdminSettings';
import { PremiumInput } from '@/components/shared/fields/PremiumInput';
import { PremiumSelect } from '@/components/shared/fields/PremiumSelect';
import { PremiumTextarea } from '@/components/shared/fields/PremiumTextarea';
import { PremiumFileInput } from '@/components/shared/fields/PremiumFileInput';
import { iconColors, IconColor } from '@/config/colors';

const formSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    contact: z.string().min(10, 'Contact number is required'),
    roll_no: z.string().min(1, 'Roll number is required'),
    branch: z.string().min(1, 'Branch is required'),
    year: z.string().min(1, 'Year of study is required'),
    about_yourself: z.string().optional(),
    queries: z.string().optional(),
    payment_mode: z.enum(['online', 'cash']),
    payment_screenshot: z.any().optional()
  })
  .superRefine((data, ctx) => {
    if (data.payment_mode === 'online' && !data.payment_screenshot) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payment_screenshot'],
        message: 'Payment screenshot is required for online payment'
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

function SectionHeader({
  icon: Icon,
  title,
  accent,
  subtitle,
  color = 'red'
}: {
  icon: LucideIcon;
  title: string;
  accent: string;
  subtitle: string;
  color?: IconColor;
}) {
  return (
    <div className="mb-9 flex items-center gap-5 ">
      <div
        className={`flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[17px] border border-current bg-transparent ${iconColors[color]} opacity-90`}
      >
        <Icon className="h-8 w-8" strokeWidth={1.8} />
      </div>
      <div>
        <h2 className="font-orbitron text-[30px] font-bold tracking-[-0.02em] tracking-wide text-white">
          {title} <span className={iconColors[color]}>{accent}</span>
        </h2>
        <p className="mt-1 text-[16px] text-[#92929b]">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  required = false
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-3 block text-[16px] font-semibold text-[#f4f4f5]">
      {children} {required && <span className="text-[#ff1e35]">*</span>}
    </label>
  );
}

function FormCard({
  children,
  className = ''
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`border-primary/30 bg-card/30 relative rounded-[28px] border px-5 py-7 sm:px-8 sm:py-9 md:px-12 md:py-10 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default function MembershipForm() {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
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
      payment_mode: 'online'
    }
  });

  const { mutate: submitMembership, isPending: isSubmitting } =
    useSubmitMembership({
      onSuccess: () => {
        setSuccess(true);
        setErrorMsg(null);
        form.reset();
        setFileName('');
        toast.success('Registration completed successfully!');
        document
          .getElementById('membership-form-start')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      onError: (err) => {
        setErrorMsg(err);
        setSuccess(false);
        toast.error(err);
        document
          .getElementById('membership-form-start')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

  const paymentMode = form.watch('payment_mode');

  const onSubmit = async (values: FormValues) => {
    if (values.payment_mode === 'online' && !values.payment_screenshot) {
      setErrorMsg('Payment screenshot is required for online payments.');
      toast.error('Payment screenshot is required for online payments.');
      document
        .getElementById('membership-form-start')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const val = values[key as keyof FormValues];
      if (val !== undefined && val !== null) {
        if (key === 'payment_screenshot' && val instanceof File)
          formData.append(key, val);
        else if (key !== 'payment_screenshot')
          formData.append(key, val as string);
      }
    });

    await submitMembership(formData);
  };

  const setPaymentFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be 5MB or less.');
      return;
    }
    form.setValue('payment_screenshot', file, { shouldValidate: true });
    setFileName(file.name);
  };

  if (success) {
    return (
      <SuccessState
        title="Registration Successful!"
        description="Thank you for applying for CSI Membership! Your application has been submitted and is currently pending verification. We will reach out to you shortly."
        action={
          <Button
            onClick={() => {
              form.reset();
              setSuccess(false);
              setFileName('');
            }}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4" /> Fill Again
          </Button>
        }
      />
    );
  }

  return (
    <div className="min-h-screen w-full overflow-hidden text-white ">
      <MembershipHeader />
      <div
        id="membership-form-start"
        className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-4 pt-8 pb-16 scroll-mt-28 sm:px-6 sm:scroll-mt-32 lg:px-10"
      >
        {errorMsg && (
          <div className="flex items-start gap-4 rounded-2xl border border-[#ff1e35]/35 bg-[#13090b] px-5 py-4 ">
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-[#ff1e35]" />
            <div>
              <h4 className="font-bold text-white">Registration Failed</h4>
              <p className="mt-1 text-sm text-[#aaaab2]">{errorMsg}</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="cursor-target mx-auto flex w-full max-w-7xl flex-col gap-7"
          >
            {/* 01 — Personal details */}
            <FormCard>
              <SectionHeader
                icon={User}
                title="Personal"
                accent="Details"
                subtitle="Let's get to know you better."
                color="blue"
              />

              <div className="grid grid-cols-1 gap-x-11 gap-y-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Full Name</FieldLabel>
                      <FormControl>
                        <PremiumInput
                          icon={User}
                          colorTheme="blue"
                          placeholder="John Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Email Address</FieldLabel>
                      <FormControl>
                        <PremiumInput
                          icon={Mail}
                          colorTheme="teal"
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Phone Number</FieldLabel>
                      <FormControl>
                        <PremiumInput
                          icon={Phone}
                          colorTheme="green"
                          type="tel"
                          placeholder="+91 9876543210"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roll_no"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Roll Number</FieldLabel>
                      <FormControl>
                        <PremiumInput
                          icon={Hash}
                          colorTheme="purple"
                          placeholder="1604-XX-XXX-XXX"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Branch</FieldLabel>
                      <FormControl>
                        <PremiumSelect
                          icon={BookOpen}
                          colorTheme="orange"
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select Branch"
                          options={[
                            'CSE',
                            'IT',
                            'CS&AI',
                            'CS&ML',
                            'CS&DS',
                            'AI&ML',
                            'AI&DS',
                            'ECE',
                            'EEE',
                            'EIE',
                            'Civil',
                            'Mechanical'
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Year of Study</FieldLabel>
                      <FormControl>
                        <PremiumSelect
                          icon={GraduationCap}
                          colorTheme="indigo"
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select Year"
                          options={[
                            '1st Year',
                            '2nd Year',
                            '3rd Year',
                            '4th Year'
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormCard>

            {/* 02 — About you */}
            <FormCard>
              <SectionHeader
                icon={FileText}
                title="About"
                accent="You"
                subtitle="Help us know you better."
                color="pink"
              />

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="about_yourself"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>
                        Why do you want to join CSI?
                      </FieldLabel>
                      <FormControl>
                        <PremiumTextarea
                          icon={FileText}
                          colorTheme="pink"
                          maxLength={500}
                          placeholder="Tell us a bit about your interests, goals, and why you want to be a part of CSI..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="queries"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Any Questions?</FieldLabel>
                      <FormControl>
                        <PremiumTextarea
                          icon={MessageSquare}
                          colorTheme="cyan"
                          maxLength={500}
                          placeholder="Have any doubts? Ask here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormCard>

            {/* 03 — Payment */}
            <FormCard>
              <SectionHeader
                icon={IndianRupee}
                title="Payment"
                accent="Details"
                subtitle="Complete your payment to proceed with your membership."
                color="green"
              />

              <FormField
                control={form.control}
                name="payment_mode"
                render={({ field }) => (
                  <FormItem>
                    <FieldLabel required>Payment Method</FieldLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => field.onChange('online')}
                          className={`flex min-h-[76px] items-center gap-4 rounded-2xl border px-5 text-left transition-all ${
                            field.value === 'online'
                              ? 'border-border bg-card/60'
                              : 'border-border/50 bg-card/30 hover:bg-card/50'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${field.value === 'online' ? 'border-blue-500' : 'border-border'}`}
                          >
                            {field.value === 'online' && (
                              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                            )}
                          </span>
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                            <QrCode className="h-5 w-5 text-blue-500" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-white">
                              Online (UPI / QR Code)
                            </span>
                            <span className="text-muted-foreground mt-0.5 block text-xs">
                              Pay using any UPI app
                            </span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange('cash')}
                          className={`flex min-h-[76px] items-center gap-4 rounded-2xl border px-5 text-left transition-all ${
                            field.value === 'cash'
                              ? 'border-border bg-card/60'
                              : 'border-border/50 bg-card/30 hover:bg-card/50'
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${field.value === 'cash' ? 'border-green-500' : 'border-border'}`}
                          >
                            {field.value === 'cash' && (
                              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                            )}
                          </span>
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                            <Banknote className="h-5 w-5 text-green-500" />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-white">
                              Cash (Hand over to coordinator)
                            </span>
                            <span className="text-muted-foreground mt-0.5 block text-xs">
                              Pay in person at the event
                            </span>
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMode === 'cash' ? (
                <div className="border-border bg-card/30 mt-7 rounded-2xl border p-5 sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
                      <Banknote className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      Cash Payment Selected
                    </h3>
                  </div>
                  <p className="text-muted-foreground mt-4 leading-7">
                    Please hand over the fee of{' '}
                    <strong className="text-white">₹350</strong> in cash to our
                    coordinator.
                  </p>
                  <div className="border-border/50 bg-card/40 mt-4 rounded-xl border p-4">
                    <p className="text-sm font-semibold text-white">
                      Contact for Cash Payment:
                    </p>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Danish:{' '}
                      <a
                        href="tel:+918106110632"
                        className="font-bold text-green-500 hover:underline"
                      >
                        +91 81061 10632
                      </a>
                    </p>
                  </div>
                  <p className="text-muted-foreground/70 mt-3 text-sm">
                    Your membership will remain pending until the cash payment
                    is received and verified.
                  </p>
                </div>
              ) : (
                <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2">
                  {/* QR */}
                  <div className="border-border bg-card/30 relative overflow-hidden rounded-2xl border p-5 sm:p-7">
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="mb-6 flex w-full items-start gap-4 text-left">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                          <QrCode className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            Pay Membership Fee:{' '}
                            <span className="text-blue-500">₹350</span>
                          </h3>
                          <p className="text-muted-foreground mt-1 text-sm">
                            Scan the QR code below to complete your payment.
                          </p>
                        </div>
                      </div>

                      <div className="border-border bg-card/40 rounded-2xl border p-5">
                        <p className="mb-4 text-sm font-medium text-white">
                          Scan using any UPI App
                        </p>
                        {settings?.default_payment_qr_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={settings.default_payment_qr_url}
                            alt="Payment QR Code"
                            className="aspect-square h-auto w-full max-w-[250px] rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex aspect-square w-full max-w-[250px] items-center justify-center rounded-md bg-white text-sm text-black">
                            QR not available
                          </div>
                        )}
                        <p className="mt-4 text-sm font-bold tracking-wide text-white">
                          DANISH AHMED
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Upload */}
                  <FormField
                    control={form.control}
                    name="payment_screenshot"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="border-border bg-card/30 rounded-2xl border p-5 sm:p-7">
                        <div className="mb-4 flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10">
                            <Upload className="h-5 w-5 text-teal-500" />
                          </div>
                          <div>
                            <FieldLabel required>Payment Screenshot</FieldLabel>
                            <p className="text-muted-foreground -mt-1 text-sm">
                              Upload a clear screenshot of your transaction (Max
                              5MB).
                            </p>
                          </div>
                        </div>

                        <FormControl>
                          <PremiumFileInput
                            colorTheme="teal"
                            accept="image/*"
                            value={value as File | null}
                            onChange={(file) => {
                              if (!file) {
                                onChange(null);
                                setFileName('');
                                return;
                              }
                              if (!file.type.startsWith('image/')) {
                                toast.error('Please upload an image file.');
                                return;
                              }
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error('File size must be 5MB or less.');
                                return;
                              }
                              onChange(file);
                              setFileName(file.name);
                            }}
                            {...fieldProps}
                          />
                        </FormControl>

                        <div className="border-border/50 bg-card/30 mt-4 flex items-start gap-3 rounded-xl border px-4 py-3">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                          <p className="text-muted-foreground text-sm leading-6">
                            Please upload a clear screenshot of your
                            transaction.
                            <br />
                            Make sure the amount and transaction details are
                            visible.
                          </p>
                        </div>
                        <FormMessage className="mt-2" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </FormCard>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-14 gap-0 text-lg"
              size="lg"
            >
              {isSubmitting
                ? 'Submitting Application...'
                : 'Apply for Membership'}
              {!isSubmitting && (
                <span className="ml-3 text-[27px] font-normal">
                  <ArrowRight />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
