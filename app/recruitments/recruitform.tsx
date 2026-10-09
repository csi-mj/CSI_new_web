"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  User,
  Mail,
  BookOpen,
  GraduationCap,
  Hash,
  Phone,
  Users,
  Grid2X2,
  FileText,
  UploadCloud,
  ChevronDown,
  ArrowRight,
  Check,
  AlertCircle,
  Download,
} from "lucide-react";
import { SuccessState } from "@/components/ui/success-state";
import { iconColors, translucentBgColors, bgColors } from "@/config/colors";
import { toast } from "sonner";

const branches = [
  "CSE",
  "IT",
  "AIML",
  "AIDS",
  "CSE AI",
  "ECE",
  "EEE",
  "CIVIL",
  "MECHANICAL",
];

const years = ["I Year", "II Year", "III Year", "IV Year"];

const portfolios = [
  "Marketing",
  "Design",
  "Events",
  "Web",
  "Tech & Innovation",
  "HR",
  "Media & Press",
  "Logistics",
  "Editorial",
  "Research & Development",
];

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useSubmitRecruitment } from "./_hooks/useSubmitRecruitment";
import { Loader2 } from "lucide-react";
import { PremiumInput } from "@/components/shared/fields/PremiumInput";
import { PremiumLabel } from "@/components/shared/fields/PremiumLabel";
import { PremiumSelect } from "@/components/shared/fields/PremiumSelect";
import { PremiumRadioGroup } from "@/components/shared/fields/PremiumRadioGroup";
import { PremiumCheckbox } from "@/components/shared/fields/PremiumCheckbox";
import { PremiumFileInput } from "@/components/shared/fields/PremiumFileInput";

const formSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  rollNumber: z.string().min(15, "Roll number must be in correct format"),
  contact: z.string().min(10, "Contact number must be at least 10 digits"),
  csiMember: z.enum(["yes", "no"]),
  execomCore: z.enum(["execom", "core"]),
  portfolios: z.array(z.string()).length(2, "Please select exactly 2 portfolios"),
  resume: z.any().refine((file) => !!file, "Resume is required"),
});

export default function MembershipForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      branch: "",
      year: "",
      rollNumber: "",
      contact: "",
      csiMember: "yes",
      execomCore: "execom",
      portfolios: [],
      resume: null,
    },
  });

  const handleRollNumber = (value: string) => {
    let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4) + "-" + cleaned.slice(4);
    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7) + "-" + cleaned.slice(7);
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11) + "-" + cleaned.slice(11);
    form.setValue("rollNumber", cleaned.slice(0, 16), { shouldValidate: true });
  };

  const togglePortfolio = (portfolio: string) => {
    const current = form.getValues("portfolios");
    const exists = current.includes(portfolio);

    if (exists) {
      form.setValue(
        "portfolios",
        current.filter((item) => item !== portfolio),
        { shouldValidate: true }
      );
    } else if (current.length < 2) {
      form.setValue("portfolios", [...current, portfolio], { shouldValidate: true });
    }
  };

  const validateFile = (file: File) => {
    const isPDF = file.type === "application/pdf";
    const isUnder5MB = file.size <= 5 * 1024 * 1024;

    if (!isPDF) {
      alert("Please upload a PDF file only.");
      return false;
    }

    if (!isUnder5MB) {
      alert("Resume must be smaller than 5MB.");
      return false;
    }

    return true;
  };

  const { mutate, isPending } = useSubmitRecruitment();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("branch", values.branch);
    formData.append("year", values.year);
    formData.append("roll_no", values.rollNumber);
    formData.append("contact", values.contact);
    formData.append("team", values.execomCore);
    formData.append("is_csi_member", values.csiMember === "yes" ? "true" : "false");
    
    // Add portfolios
    if (values.portfolios[0]) formData.append("portfolio_1", values.portfolios[0]);
    if (values.portfolios[1]) formData.append("portfolio_2", values.portfolios[1]);
    
    // Add file
    if (values.resume) {
      formData.append("resume", values.resume);
    }

    mutate(formData, {
      onSuccess: () => {
        setSuccess(true);
        setErrorMsg(null);
        form.reset();
        document.getElementById('recruitment-form-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      onError: (err) => {
        setErrorMsg(err.message || 'Something went wrong.');
        setSuccess(false);
        document.getElementById('recruitment-form-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  if (success) {
    return (
      <main className="relative min-h-screen overflow-hidden px-4 pt-40 py-7 text-white sm:px-6 lg:px-8">
        <SuccessState
          title="Application Successful!"
          description="Thank you for applying to the CSI-MJCET team! We have received your application and will send you an email regarding your interview soon."
          action={
            <Button
              onClick={() => {
                form.reset();
                setSuccess(false);
              }}
              className="flex items-center gap-2"
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
    <main id="recruitment-form-start" className="relative min-h-screen overflow-hidden px-4 pt-40 py-7 text-white sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto w-full max-w-[1070px]">
        {errorMsg && (
          <div className="mb-6 w-full max-w-[1070px] border border-border/50 bg-card/50 rounded-lg px-6 py-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`p-3 rounded-full ${translucentBgColors.red} shrink-0`}>
                  <AlertCircle className={`h-6 w-6 ${iconColors.red}`} />
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
                  <h5 className="text-xl font-bold m-0 text-foreground">
                    Submission Failed
                  </h5>
                  <p className="text-base text-muted-foreground m-0 leading-relaxed">
                    {errorMsg}
                  </p>
                </div>
              </div>
              
              {errorMsg.toLowerCase().includes('membership') && (
                <Button asChild className={`shrink-0 font-semibold shadow-md ${bgColors.red} mt-4 sm:mt-0`}>
                  <Link href="/membership">
                    Buy Membership
                  </Link>
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
              console.error("Form validation errors:", errors);
              const firstErrorField = Object.keys(errors)[0];
              const errorMessage = errors[firstErrorField as keyof typeof errors]?.message;
              toast.error(`Validation Failed: ${errorMessage}`);
            })}
            className="glass-panel px-5 py-7 sm:px-8 sm:py-9 lg:px-10"
          >
            {/* Header */}
            <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
              <div>

                <h1 className="text-[clamp(32px,4vw,42px)] font-inter font-semibold leading-none tracking-[-0.03em]">
                  Recruitment <span className="serif-accent text-[1.2em] text-[#ff2a3d]">form</span>
                </h1>

                <p className="mt-2 text-[15px] text-[#9b9ba3]">
                  Fill in your details to become a part of the CSI-MJCET community.
                </p>
              </div>

              <div className="flex min-w-0 items-center gap-4 sm:min-w-[290px]">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                  <Users size={22} strokeWidth={1.6} className="text-white/60" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-white">Learn. Build. Collaborate. Lead.</p>
                  <p className="mt-0.5 text-[12px] text-[#8d8d95]">Be a part of something bigger.</p>
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
                      <PremiumInput icon={User} placeholder="Enter your full name" colorTheme="blue" {...field} />
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
                      <PremiumInput icon={Mail} type="email" placeholder="you@example.com" colorTheme="yellow" {...field} />
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
                      <PremiumSelect icon={BookOpen} placeholder="Select your branch" options={branches} colorTheme="indigo" value={field.value} onValueChange={field.onChange} />
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
                      <PremiumSelect icon={GraduationCap} placeholder="Select year" options={years} colorTheme="purple" value={field.value} onValueChange={field.onChange} />
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
                      <PremiumInput icon={Hash} placeholder="1604 - XX - XXX - ZZZZ" colorTheme="cyan" {...field} onChange={(e) => handleRollNumber(e.target.value)} />
                    </FormControl>
                    <p className="mt-1 text-[12px] text-muted-foreground px-2">Format: 1604 - xx - xxx - zzzz</p>
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
                      <PremiumInput icon={Phone} type="tel" placeholder="+91 9876543210" colorTheme="green" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Radio groups */}
            <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="csiMember"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <PremiumLabel required>Are you a CSI Member?</PremiumLabel>
                    <FormControl>
                      <PremiumRadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        options={[
                          { value: "yes", label: "Yes" },
                          { value: "no", label: "No" },
                        ]}
                        colorTheme="rose"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          { value: "execom", label: "Execom" },
                          { value: "core", label: "Core" },
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
                    <Grid2X2 size={20} strokeWidth={1.8} className="text-[#ff1e35] ml-1" />
                    <PremiumLabel required className="ml-0 text-[#f1f1f2]">Select Portfolio (Choose exactly 2)</PremiumLabel>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-3 [&_label]:flex [&_label]:h-full [&_label]:w-full [&_label]:px-3 [&_label_span]:min-w-0 [&_label_span]:[overflow-wrap:break-word]">
                    {portfolios.map((portfolio) => {
                      const checked = field.value.includes(portfolio);
                      const disabled = !checked && field.value.length >= 2;

                      return (
                        <div key={portfolio} className={disabled ? "opacity-50 pointer-events-none" : ""}>
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
                    <p className="mt-2 text-[12px] text-muted-foreground px-2">
                      You must select exactly 2 portfolios.
                      {field.value.length > 0 && (
                        <span className="ml-1 text-primary font-semibold">
                          {field.value.length}/2 selected
                        </span>
                      )}
                    </p>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            {/* Resume template, for applicants who don't have a resume yet */}
            <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <FileText size={20} strokeWidth={1.6} className="text-white/60" aria-hidden />
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-white">Don&apos;t have a resume yet?</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-[#8d8d95]">
                    Download our template, fill in your details, and upload it below as a PDF.
                  </p>
                </div>
              </div>
              <a
                href="/pdfs/resume-template.pdf"
                download="CSI-Resume-Template.pdf"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#ff1e35]/60 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#ff1e35]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff1e35]"
              >
                <Download size={17} strokeWidth={2} aria-hidden />
                Download template
              </a>
            </div>

            {/* Resume */}
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem className="mt-5 space-y-3">
                  <PremiumLabel required>Upload Your Resume</PremiumLabel>
                  <FormControl>
                    <PremiumFileInput
                      value={field.value}
                      onChange={(file) => {
                        if (file && validateFile(file)) {
                          field.onChange(file);
                        } else if (!file) {
                          field.onChange(null);
                        }
                      }}
                      colorTheme="pink"
                      icon={FileText}
                      accept="application/pdf,.pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <Button type="submit" className="w-full mt-5 h-12" disabled={isPending}>
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