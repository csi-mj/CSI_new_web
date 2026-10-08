'use client';

import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  Banknote,
  BookOpen,
  CheckCircle2,
  ChevronDown,
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
  User,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useSubmitMembership } from '../_hooks/useSubmitMembership';
import MembershipHeader from './MembershipHeader';
import { SuccessState } from '@/components/ui/success-state';
import { useAdminSettings } from '@/app/admin/settings/hooks/useAdminSettings';

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
    payment_screenshot: z.any().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.payment_mode === 'online' && !data.payment_screenshot) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['payment_screenshot'],
        message: 'Payment screenshot is required for online payment',
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

const inputBase =
  'h-[58px] w-full rounded-[18px] border border-white/10 bg-[#111113] px-4 text-[15px] text-white outline-none transition-all placeholder:text-[#66666f] focus:border-[#ff1e35] focus:ring-1 focus:ring-[#ff1e35]/40';

const textareaBase =
  'min-h-[132px] w-full resize-y rounded-[18px] border border-white/10 bg-[#111113] px-4 py-4 text-[15px] text-white outline-none transition-all placeholder:text-[#66666f] focus:border-[#ff1e35] focus:ring-1 focus:ring-[#ff1e35]/40';

function SectionHeader({
  icon: Icon,
  title,
  accent,
  subtitle,
}: {
  icon: LucideIcon;
  title: string;
  accent: string;
  subtitle: string;
}) {
  return (
    <div className="mb-9 flex items-center gap-5">
      <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[17px] border border-[#ff1e35]/25 bg-[#170d10] shadow-[0_0_25px_rgba(255,30,53,0.08)]">
        <Icon className="h-8 w-8 text-[#ff1e35]" strokeWidth={1.8} />
      </div>
      <div>
        <h2 className="text-[30px] font-orbitron tracking-wide font-bold tracking-[-0.02em] text-white">
          {title} <span className="text-[#ff1e35]">{accent}</span>
        </h2>
        <p className="mt-1 text-[16px] text-[#92929b]">{subtitle}</p>
      </div>
    </div>
  );
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-3 block text-[16px] font-semibold text-[#f4f4f5]">
      {children} {required && <span className="text-[#ff1e35]">*</span>}
    </label>
  );
}

function InputIcon({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="h-[21px] w-[21px] shrink-0 text-[#ff1e35]" strokeWidth={2} />;
}

function TextInput({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: LucideIcon }) {
  const Icon = icon;
  return (
    <div className="relative">
      <input {...props} className={`${inputBase} pl-[54px]`} />
      <div className="pointer-events-none absolute inset-y-0 left-0 flex w-[54px] items-center justify-center" aria-hidden>
        <InputIcon icon={Icon} />
      </div>
    </div>
  );
}

function SelectField({
  icon,
  value,
  onChange,
  options,
  placeholder,
}: {
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}) {
  const Icon = icon;
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  // Close when tapping/clicking anywhere outside (including another dropdown), or on Escape,
  // so only one dropdown is ever open
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const selectedOption = options.find((option) => option === value);

  return (
    <div ref={wrapperRef} className="relative" data-select-open={open}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`${inputBase} flex w-full cursor-pointer items-center justify-between pl-[54px] pr-12 text-left transition-all duration-200 ${
          open
            ? 'border-[#ff1e35]/70 bg-[#111113] shadow-[0_0_0_3px_rgba(255,30,53,0.08)]'
            : 'text-[#dedee3]'
        }`}
      >
        {/* Icon */}
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-[54px] items-center justify-center">
          <Icon
            className="h-[21px] w-[21px] text-[#ff1e35]"
            strokeWidth={2}
          />
        </span>

        {/* Selected value */}
        <span
          className={
            selectedOption ? 'text-[#dedee3]' : 'text-[#77777f]'
          }
        >
          {selectedOption || placeholder}
        </span>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
        >
          <ChevronDown
            className={`h-5 w-5 transition-colors duration-200 ${
              open ? 'text-[#ff1e35]' : 'text-[#b8b8c0]'
            }`}
          />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 6,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -6,
              scale: 0.98,
            }}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute left-0 right-0 z-50
              overflow-hidden rounded-xl
              border border-white/[0.08]
              bg-[#111113]/95
              p-1.5
              shadow-[0_20px_50px_rgba(0,0,0,0.55)]
              backdrop-blur-xl
            "
          >
            {options.map((option, index) => {
              const isSelected = option === value;

              return (
                <motion.button
                  key={option}
                  type="button"
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.025,
                    duration: 0.15,
                  }}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`
                    flex w-full items-center justify-between
                    rounded-lg px-4 py-3
                    text-sm
                    transition-all duration-150
                    ${
                      isSelected
                        ? 'bg-[#ff1e35]/10 text-[#ff1e35]'
                        : 'text-[#c8c8ce] hover:bg-white/[0.05] hover:text-white'
                    }
                  `}
                >
                  <span>{option}</span>

                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.15 }}
                      className="h-2 w-2 rounded-full bg-[#ff1e35] shadow-[0_0_10px_rgba(255,30,53,0.8)]"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={`relative rounded-[28px] border border-[#ff1e35]/65 has-[[data-select-open=true]]:z-30 bg-[linear-gradient(135deg,rgba(15,15,17,0.98),rgba(7,7,8,0.98))] px-5 py-7 shadow-[0_0_40px_rgba(255,20,45,0.035)] sm:px-8 sm:py-9 md:px-12 md:py-10 ${className}`}
    >
      {/* Glow is clipped to the card on its own, so dropdowns inside the card can still open past its edge */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ff1e35]/[0.025] blur-3xl" />
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}

export default function MembershipForm() {
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    },
  });

  const { mutate: submitMembership, isPending: isSubmitting } = useSubmitMembership({
    onSuccess: () => {
      setSuccess(true);
      setErrorMsg(null);
      form.reset();
      setFileName('');
      toast.success('Registration completed successfully!');
      document.getElementById('membership-form-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    onError: (err) => {
      setErrorMsg(err);
      setSuccess(false);
      toast.error(err);
      document.getElementById('membership-form-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
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
    Object.keys(values).forEach((key) => {
      const val = values[key as keyof FormValues];
      if (val !== undefined && val !== null) {
        if (key === 'payment_screenshot' && val instanceof File) formData.append(key, val);
        else if (key !== 'payment_screenshot') formData.append(key, val as string);
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
    <div className="min-h-screen w-full overflow-hidden bg-[#060607] text-white">
      <MembershipHeader />

      {/* Background glow / curved accents */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-48 top-56 h-[430px] w-[430px] rounded-full bg-[#ff1e35]/10 blur-[110px]" />
        <div className="absolute -right-48 top-24 h-[420px] w-[420px] rounded-full bg-[#ff1e35]/10 blur-[110px]" />
      </div>

      <div id="membership-form-start" className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-7 px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        {errorMsg && (
          <div className="flex items-start gap-4 rounded-2xl border border-[#ff1e35]/35 bg-[#13090b] px-5 py-4 shadow-[0_0_25px_rgba(255,30,53,0.06)]">
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-[#ff1e35]" />
            <div>
              <h4 className="font-bold text-white">Registration Failed</h4>
              <p className="mt-1 text-sm text-[#aaaab2]">{errorMsg}</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-7">
            {/* 01 — Personal details */}
            <FormCard>
              <SectionHeader
                icon={User}
                title="Personal"
                accent="Details"
                subtitle="Let's get to know you better."
              />

              <div className="grid grid-cols-1 gap-x-11 gap-y-8 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Full Name</FieldLabel>
                      <FormControl>
                        <TextInput icon={User} placeholder="John Doe" {...field} />
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
                        <TextInput icon={Mail} type="email" placeholder="john@example.com" {...field} />
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
                        <TextInput icon={Phone} type="tel" placeholder="+91 9876543210" {...field} />
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
                        <TextInput icon={Hash} placeholder="1604-XX-XXX-XXX" {...field} />
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
                        <SelectField
                          icon={BookOpen}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Branch"
                          options={['CSE', 'IT', 'CS&AI', 'CS&ML', 'CS&DS', 'AI&ML', 'AI&DS', 'ECE', 'EEE', 'EIE', 'Civil', 'Mechanical']}
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
                        <SelectField
                          icon={GraduationCap}
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select Year"
                          options={['1st Year', '2nd Year', '3rd Year', '4th Year']}
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
              />

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="about_yourself"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel required>Why do you want to join CSI?</FieldLabel>
                      <FormControl>
                        <div className="relative">
                          <div className="pointer-events-none absolute left-5 top-5">
                            <FileText className="h-5 w-5 text-[#ff1e35]" />
                          </div>
                          <textarea
                            {...field}
                            maxLength={500}
                            placeholder="Tell us a bit about your interests, goals, and why you want to be a part of CSI..."
                            className={`${textareaBase} min-h-[138px] pl-14 pr-5`}
                          />
                          <span className="absolute bottom-3 right-4 text-xs text-[#777780]">
                            {(field.value ?? '').length}/500
                          </span>
                        </div>
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
                        <div className="relative">
                          <div className="pointer-events-none absolute left-5 top-5">
                            <MessageSquare className="h-5 w-5 text-[#ff1e35]" />
                          </div>
                          <textarea
                            {...field}
                            maxLength={500}
                            placeholder="Have any doubts? Ask here..."
                            className={`${textareaBase} min-h-[138px] pl-14 pr-5`}
                          />
                          <span className="absolute bottom-3 right-4 text-xs text-[#777780]">
                            {(field.value ?? '').length}/500
                          </span>
                        </div>
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
                          className={`flex min-h-[76px] items-center gap-4 rounded-[18px] border px-5 text-left transition-all ${
                            field.value === 'online'
                              ? 'border-[#ff1e35] bg-[#180b0e] shadow-[0_0_24px_rgba(255,30,53,0.09)]'
                              : 'border-white/10 bg-[#101012] hover:border-white/20'
                          }`}
                        >
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${field.value === 'online' ? 'border-[#ff1e35]' : 'border-[#66666e]'}`}>
                            {field.value === 'online' && <span className="h-3 w-3 rounded-full bg-[#ff1e35]" />}
                          </span>
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#191013]">
                            <QrCode className="h-6 w-6 text-[#ff1e35]" />
                          </span>
                          <span>
                            <span className="block text-[16px] font-semibold text-white">Online (UPI / QR Code)</span>
                            <span className="mt-1 block text-sm text-[#85858e]">Pay using any UPI app</span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => field.onChange('cash')}
                          className={`flex min-h-[76px] items-center gap-4 rounded-[18px] border px-5 text-left transition-all ${
                            field.value === 'cash'
                              ? 'border-[#ff1e35] bg-[#180b0e] shadow-[0_0_24px_rgba(255,30,53,0.09)]'
                              : 'border-white/10 bg-[#101012] hover:border-white/20'
                          }`}
                        >
                          <span className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${field.value === 'cash' ? 'border-[#ff1e35]' : 'border-[#66666e]'}`}>
                            {field.value === 'cash' && <span className="h-3 w-3 rounded-full bg-[#ff1e35]" />}
                          </span>
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#15161a]">
                            <Banknote className="h-6 w-6 text-[#aeb0b9]" />
                          </span>
                          <span>
                            <span className="block text-[16px] font-semibold text-white">Cash (Hand over to coordinator)</span>
                            <span className="mt-1 block text-sm text-[#85858e]">Pay in person at the event</span>
                          </span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {paymentMode === 'cash' ? (
                <div className="mt-7 rounded-[22px] border border-white/10 bg-[#101012] p-5 sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1b0d10]">
                      <Banknote className="h-6 w-6 text-[#ff1e35]" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Cash Payment Selected</h3>
                  </div>
                  <p className="mt-5 leading-7 text-[#a4a4ad]">
                    To complete your membership registration, please hand over the fee of <strong className="text-white">₹350</strong> in cash to our coordinator.
                  </p>
                  <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-sm font-semibold text-white">Contact for Cash Payment:</p>
                    <p className="mt-1 text-base text-[#a9a9b1]">
                      Danish:{' '}
                      <a href="tel:+918106110632" className="font-bold text-[#ff1e35] hover:underline">
                        +91 81061 10632
                      </a>
                    </p>
                  </div>
                  <p className="mt-4 text-sm text-[#777780]">Your membership will remain pending until the cash payment is received and verified.</p>
                </div>
              ) : (
                <div className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2">
                  {/* QR */}
                  <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101012] p-5 sm:p-7">
                    <div className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full border border-[#ff1e35]/15 bg-[#ff1e35]/[0.035]" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                      <div className="mb-6 flex w-full items-start gap-4 text-left">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ff1e35]/20 bg-[#1a0c10]">
                          <QrCode className="h-6 w-6 text-[#ff1e35]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Pay Membership Fee: <span className="text-[#ff1e35]">₹350</span>
                          </h3>
                          <p className="mt-1 text-sm text-[#8d8d96]">Scan the QR code below to complete your payment.</p>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#ff1e35] bg-[#070708] p-5 shadow-[0_0_28px_rgba(255,30,53,0.08)]">
                        <p className="mb-4 text-sm font-medium text-white">Scan using any UPI App</p>
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
                        <p className="mt-4 text-sm font-bold tracking-wide text-white">DANISH AHMED</p>
                      </div>
                    </div>
                  </div>

                  {/* Upload */}
                  <FormField
                    control={form.control}
                    name="payment_screenshot"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101012] p-5 sm:p-7">
                        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[#ff1e35]/20 bg-[#ff1e35]/[0.04]" />
                        <div className="relative z-10">
                          <div className="mb-6 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ff1e35]/20 bg-[#1a0c10]">
                              <Upload className="h-6 w-6 text-[#ff1e35]" />
                            </div>
                            <div>
                              <FieldLabel required>Payment Screenshot</FieldLabel>
                              <p className="-mt-1 text-sm text-[#8d8d96]">Upload a clear screenshot of your transaction (Max 5MB).</p>
                            </div>
                          </div>

                          <input
                            {...fieldProps}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(element) => {
                              fileInputRef.current = element;
                              fieldProps.ref?.(element);
                            }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setPaymentFile(file);
                              onChange(file);
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            onDragEnter={(e) => {
                              e.preventDefault();
                              setIsDragging(true);
                            }}
                            onDragOver={(e) => e.preventDefault()}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsDragging(false);
                              const file = e.dataTransfer.files?.[0];
                              setPaymentFile(file);
                              onChange(file);
                            }}
                            className={`flex min-h-[218px] w-full flex-col items-center justify-center rounded-[22px] border border-dashed px-5 text-center transition-all ${
                              isDragging
                                ? 'border-[#ff1e35] bg-[#ff1e35]/10'
                                : 'border-[#ff1e35]/75 bg-[#0b0b0d] hover:bg-[#ff1e35]/[0.035]'
                            }`}
                          >
                            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#ff1e35]/25 bg-[#1a0c10] shadow-[0_0_25px_rgba(255,30,53,0.08)]">
                              {fileName ? <CheckCircle2 className="h-8 w-8 text-[#ff1e35]" /> : <Upload className="h-8 w-8 text-[#ff1e35]" />}
                            </span>
                            <span className="mt-5 text-base text-[#c9c9d0]">
                              {fileName ? (
                                <>
                                  <strong className="text-white">{fileName}</strong>
                                  <span className="block mt-1 text-sm text-[#777780]">Click to replace</span>
                                </>
                              ) : (
                                <>
                                  <strong className="text-white">Click to upload</strong> or drag and drop
                                </>
                              )}
                            </span>
                            {!fileName && <span className="mt-1 text-sm text-[#777780]">Max file size: 5MB</span>}
                          </button>

                          <div className="mt-5 flex items-start gap-3 rounded-[17px] border border-white/5 bg-white/[0.035] px-4 py-4">
                            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff1e35]" />
                            <p className="text-sm leading-6 text-[#a2a2ab]">
                              Please upload a clear screenshot of your transaction.<br />
                              Make sure the amount and transaction details are visible.
                            </p>
                          </div>
                          <FormMessage className="mt-2" />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </FormCard>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-[72px] w-full rounded-full border-0 bg-[#ff1e35] text-[20px] font-bold text-white shadow-[0_0_35px_rgba(255,30,53,0.22)] transition-all hover:bg-[#ff3046] hover:shadow-[0_0_45px_rgba(255,30,53,0.32)]"
            >
              {isSubmitting ? 'Submitting Application...' : 'Apply for Membership'}
              {!isSubmitting && <span className="ml-3 text-[27px] font-normal">→</span>}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
