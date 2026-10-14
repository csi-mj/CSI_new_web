'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  User,
  Mail,
  BookOpen,
  GraduationCap,
  Hash,
  Phone,
  Users,
  Grid2X2,
  ChevronDown,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { SuccessState } from '@/components/ui/success-state';
import { iconColors, translucentBgColors, bgColors } from '@/config/colors';
import { toast } from 'sonner';

const branches = [
  'CSE',
  'IT',
  'AIML',
  'AIDS',
  'CSE AI',
  'ECE',
  'EEE',
  'CIVIL',
  'MECHANICAL'
];

const years = ['I Year', 'II Year', 'III Year', 'IV Year'];

const portfolios = [
  'Marketing',
  'Design',
  'Events',
  'Web',
  'Tech & Innovation',
  'HR',
  'Media & Press',
  'Logistics',
  'Editorial',
  'Research & Development'
];

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { useSubmitRecruitment } from './_hooks/useSubmitRecruitment';
import { Loader2 } from 'lucide-react';
import { PremiumInput } from '@/components/shared/fields/PremiumInput';
import { PremiumLabel } from '@/components/shared/fields/PremiumLabel';
import { PremiumSelect } from '@/components/shared/fields/PremiumSelect';
import { PremiumRadioGroup } from '@/components/shared/fields/PremiumRadioGroup';
import { PremiumCheckbox } from '@/components/shared/fields/PremiumCheckbox';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Full name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Invalid email address'),
  branch: z.string().trim().min(1, 'Branch is required'),
  year: z.string().trim().min(1, 'Year is required'),
  rollNumber: z
    .string()
    .trim()
    .min(10, 'Roll number must be at least 10 characters')
    .max(20, 'Roll number cannot exceed 20 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'Roll number can only contain letters, numbers, and hyphens'),
  contact: z.string().trim().min(10, 'Contact number must be at least 10 digits'),
  execomCore: z.enum(['execom', 'core']),
  portfolios: z
    .array(z.string())
    .length(2, 'Please select exactly 2 portfolios'),
});

const formatRollNumber = (value: string) => {
  const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (raw.startsWith('1604') && raw.length >= 10) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 9)}-${raw.slice(9)}`;
  }
  return value.trim().toUpperCase();
};

export default function MembershipForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      branch: '',
      year: '',
      rollNumber: '',
      contact: '',
      execomCore: 'execom',
      portfolios: [],
    }
  });

  const togglePortfolio = (portfolio: string) => {
    const current = form.getValues('portfolios');
    const exists = current.includes(portfolio);

    if (exists) {
      form.setValue(
        'portfolios',
        current.filter((item) => item !== portfolio),
        { shouldValidate: true }
      );
    } else if (current.length < 2) {
      form.setValue('portfolios', [...current, portfolio], {
        shouldValidate: true
      });
    }
  };

  const { mutate, isPending } = useSubmitRecruitment();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      branch: values.branch.trim(),
      year: values.year.trim(),
      roll_no: formatRollNumber(values.rollNumber.trim()),
      contact: values.contact.trim(),
      team: values.execomCore,
      portfolio_1: values.portfolios[0] || '',
      portfolio_2: values.portfolios[1] || null,
    };

    mutate(payload, {
      onSuccess: () => {
        setSuccess(true);
        setErrorMsg(null);
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        setErrorMsg(err.message || 'Something went wrong.');
        setSuccess(false);
        document
          .getElementById('recruitment-form-start')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  useEffect(() => {
    if (success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document
        .getElementById('recruitment-success-top')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [success]);

  if (success) {
    return (
      <main
        id="recruitment-success-top"
        className="relative min-h-screen overflow-hidden px-4 py-7 pt-40 text-white sm:px-6 lg:px-8"
      >
        <SuccessState
          title="Application Successful!"
          description="Thank you for applying to the CSI-MJCET team! We have received your application and will send you an email regarding your interview soon."
          action={
            <Button
              onClick={() => {
                form.reset();
                setSuccess(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-target cursor-pointer flex items-center gap-2"
              variant="outline"
            >
              Fill Again
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main
      id="recruitment-form-start"
      className="relative min-h-screen overflow-hidden px-4 py-7 pt-20 text-white sm:px-6 lg:px-8"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1070px]">
        {errorMsg && (
          <div className="border-border/50 bg-card/50 mb-6 w-full max-w-[1070px] rounded-lg border px-6 py-4 shadow-sm">
            <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div
                  className={`rounded-full p-3 ${translucentBgColors.red} shrink-0`}
                >
                  <AlertCircle className={`h-6 w-6 ${iconColors.red}`} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
                  <h5 className="text-foreground m-0 text-xl font-bold">
                    Submission Failed
                  </h5>
                  <p className="text-muted-foreground m-0 text-base leading-relaxed">
                    {errorMsg}
                  </p>
                </div>
              </div>

              {errorMsg.toLowerCase().includes('membership') && (
                <Button
                  asChild
                  className={`shrink-0 font-semibold shadow-md ${bgColors.red} mt-4 sm:mt-0`}
                >
                  <Link href="/membership">Buy Membership</Link>
                </Button>
              )}
            </div>
          </div>
        )}
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-[#ff1e35]" />

          <span className="font-inter text-[11px] font-medium tracking-[0.45em] text-white/80 sm:text-sm">
            APPLY NOW
          </span>

          <span className="h-px w-16 bg-[#ff1e35]" />
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.error('Form validation errors:', errors);
              const firstErrorField = Object.keys(errors)[0];
              const errorMessage =
                errors[firstErrorField as keyof typeof errors]?.message;
              toast.error(`Validation Failed: ${errorMessage}`);
            })}
            className="glass-panel px-5 py-7 sm:px-8 sm:py-9 lg:px-10 cursor-target"
          >
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div>
                <h1 className="font-inter text-[clamp(32px,4vw,42px)] leading-none font-semibold tracking-[-0.03em]">
                  Recruitment{' '}
                  <span className="serif-accent text-[1.2em] text-[#ff2a3d]">
                    form
                  </span>
                </h1>

                <p className="mt-2 text-[15px] text-[#9b9ba3]">
                  Fill in your details to become a part of the CSI-MJCET
                  community.
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-4 sm:min-w-[290px]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <Users
                    size={22}
                    strokeWidth={1.6}
                    className="text-white/60"
                  />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">
                    Learn. Build. Collaborate. Lead.
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#8d8d95]">
                    Be a part of something bigger.
                  </p>
                </div>
              </div>
            </div>

            {/* Main fields */}
            <div className="grid grid-cols-1 gap-x-9 gap-y-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <PremiumLabel required>Full Name</PremiumLabel>
                    <FormControl>
                      <PremiumInput
                        icon={User}
                        placeholder="Enter your full name"
                        colorTheme="blue"
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
                  <FormItem className="space-y-1">
                    <PremiumLabel required>Email Address</PremiumLabel>
                    <FormControl>
                      <PremiumInput
                        icon={Mail}
                        type="email"
                        placeholder="you@example.com"
                        colorTheme="yellow"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.trim().toLowerCase())}
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
                  <FormItem className="space-y-1">
                    <PremiumLabel required>Branch</PremiumLabel>
                    <FormControl>
                      <PremiumSelect
                        icon={BookOpen}
                        placeholder="Select your branch"
                        options={branches}
                        colorTheme="indigo"
                        value={field.value}
                        onValueChange={field.onChange}
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
                  <FormItem className="space-y-1">
                    <PremiumLabel required>Year of Study</PremiumLabel>
                    <FormControl>
                      <PremiumSelect
                        icon={GraduationCap}
                        placeholder="Select year"
                        options={years}
                        colorTheme="purple"
                        value={field.value}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rollNumber"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <PremiumLabel required>Roll Number</PremiumLabel>
                    <FormControl>
                      <PremiumInput
                        icon={Hash}
                        placeholder="1604-23-733-311"
                        colorTheme="cyan"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9-]/g, '')
                            .slice(0, 18);
                          field.onChange(val);
                        }}
                        onBlur={() => {
                          field.onBlur();
                          if (field.value && !field.value.includes('-')) {
                            const formatted = formatRollNumber(field.value);
                            field.onChange(formatted);
                          }
                        }}
                      />
                    </FormControl>
                    <p className="text-muted-foreground mt-1 px-2 text-[12px]">
                      Format: 1604-xx-xxx-xxx (or enter without hyphens)
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <PremiumLabel required>Contact Number</PremiumLabel>
                    <FormControl>
                      <PremiumInput
                        icon={Phone}
                        type="tel"
                        inputMode="tel"
                        placeholder="+91 9876543210"
                        colorTheme="green"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Execom or Core */}
            <div className="mt-7">
              <FormField
                control={form.control}
                name="execomCore"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <PremiumLabel required>Execom or Core?</PremiumLabel>
                    <FormControl>
                      <PremiumRadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: 'execom', label: 'Execom' },
                          { value: 'core', label: 'Core' }
                        ]}
                        colorTheme="orange"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Portfolio */}
            <FormField
              control={form.control}
              name="portfolios"
              render={({ field }) => (
                <FormItem className="mt-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <Grid2X2
                      size={20}
                      strokeWidth={1.8}
                      className="ml-1 text-[#ff1e35]"
                    />
                    <PremiumLabel required className="ml-0 text-[#f1f1f2]">
                      Select Portfolio (Choose exactly 2)
                    </PremiumLabel>
                  </div>

                  <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 [&_label]:flex [&_label]:h-full [&_label]:w-full [&_label]:px-3 [&_label_span]:min-w-0 [&_label_span]:[overflow-wrap:break-word]">
                    {portfolios.map((portfolio) => {
                      const checked = field.value.includes(portfolio);
                      const disabled = !checked && field.value.length >= 2;

                      return (
                        <div
                          key={portfolio}
                          className={
                            disabled ? 'pointer-events-none opacity-50' : ''
                          }
                        >
                          <PremiumCheckbox
                            label={portfolio}
                            checked={checked}
                            onCheckedChange={() => togglePortfolio(portfolio)}
                            colorTheme="teal"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground mt-2 px-2 text-[12px]">
                      You must select exactly 2 portfolios.
                      {field.value.length > 0 && (
                        <span className="text-primary ml-1 font-semibold">
                          {field.value.length}/2 selected
                        </span>
                      )}
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />


            {/* Submit */}
            <Button
              type="submit"
              className="cursor-target cursor-pointer mt-5 h-12 w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
