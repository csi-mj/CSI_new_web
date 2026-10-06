"use client";

import React, { useRef, useState } from "react";
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
} from "lucide-react";

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

type DropdownProps = {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
};

function CustomDropdown({
  value,
  placeholder,
  options,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-[54px] w-full items-center justify-between rounded-[15px] border bg-[#0d0d0e] px-4  text-left transition-all duration-200 ${
          open
            ? "border-[#ff1e35] shadow-[0_0_0_1px_rgba(255,30,53,0.15),0_0_25px_rgba(255,30,53,0.08)]"
            : "border-white/[0.14] hover:border-[#ff1e35]/50"
        }`}
      >
        <span
          className={
            value
              ? "text-[14px] text-white"
              : "text-[14px] text-[#73737b]"
          }
        >
          {value || placeholder}
        </span>

        <ChevronDown
          size={19}
          strokeWidth={1.8}
          className={`text-[#a8a8b0] transition-transform duration-200 ${
            open ? "rotate-180 text-[#ff1e35]" : ""
          }`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close dropdown"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-0 right-0 top-[62px] z-40 overflow-hidden rounded-[14px] border border-[#ff1e35]/30 bg-[#111112] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            <div className="max-h-[230px] overflow-y-auto pr-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#ff1e35]/40">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[13px] transition-colors ${
                    value === option
                      ? "bg-[#ff1e35]/10 text-[#ff394f]"
                      : "text-[#bcbcc4] hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span>{option}</span>

                  {value === option && (
                    <Check size={16} className="text-[#ff1e35]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type InputFieldProps = {
  label: string;
  required?: boolean;
     icon: LucideIcon;
    placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function InputField({
  label,
  required = true,
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-semibold text-[#f1f1f2]">
        {label}
        {required && <span className="ml-1 text-[#ff1e35]">*</span>}
      </label>

      <div className="group relative">
        <Icon
          size={22}
          strokeWidth={1.7}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#ff1e35] transition-transform duration-200 group-focus-within:scale-110"
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-[54px] w-full rounded-[15px] border border-white/[0.14] bg-[#0d0d0e] pl-[64px] pr-4 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[#71717a] hover:border-[#ff1e35]/50 focus:border-[#ff1e35] focus:shadow-[0_0_0_1px_rgba(255,30,53,0.15),0_0_25px_rgba(255,30,53,0.07)]"
        />
      </div>
    </div>
  );
}

export default function MembershipForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    branch: "",
    year: "",
    rollNumber: "",
    contact: "",
    csiMember: "yes",
    execomCore: "execom",
    portfolios: [] as string[],
  });

  const [resume, setResume] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRollNumber = (value: string) => {
    let cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (cleaned.length > 4) {
      cleaned =
        cleaned.slice(0, 4) +
        "-" +
        cleaned.slice(4);
    }

    if (cleaned.length > 7) {
      cleaned =
        cleaned.slice(0, 7) +
        "-" +
        cleaned.slice(7);
    }

    if (cleaned.length > 11) {
      cleaned =
        cleaned.slice(0, 11) +
        "-" +
        cleaned.slice(11);
    }

    updateField("rollNumber", cleaned.slice(0, 16));
  };

  const togglePortfolio = (portfolio: string) => {
    setForm((prev) => {
      const exists = prev.portfolios.includes(portfolio);

      if (exists) {
        return {
          ...prev,
          portfolios: prev.portfolios.filter((item) => item !== portfolio),
        };
      }

      if (prev.portfolios.length >= 2) {
        return prev;
      }

      return {
        ...prev,
        portfolios: [...prev.portfolios, portfolio],
      };
    });
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

  const handleFile = (file?: File) => {
    if (!file) return;

    if (validateFile(file)) {
      setResume(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.portfolios.length !== 2) {
      alert("Please select exactly 2 portfolios.");
      return;
    }

    if (!resume) {
      alert("Please upload your resume.");
      return;
    }

    console.log({
      ...form,
      resume,
    });

    // Keep your existing backend/API submission here.
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-4 pt-40 py-7 text-white sm:px-6 lg:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-[180px] top-[90px] h-[300px] w-[500px] rotate-[28deg] rounded-[50%] border border-[#ff1e35]/60 shadow-[0_0_45px_rgba(255,30,53,0.18)]" />

        <div className="absolute -right-[180px] top-[0px] h-[300px] w-[500px] rotate-[-28deg] rounded-[50%] border border-[#ff1e35]/50 shadow-[0_0_45px_rgba(255,30,53,0.16)]" />

        <div className="absolute -left-[180px] bottom-[20px] h-[300px] w-[500px] rotate-[-28deg] rounded-[50%] border border-[#ff1e35]/40 shadow-[0_0_45px_rgba(255,30,53,0.13)]" />

        <div className="absolute -right-[180px] bottom-[80px] h-[300px] w-[500px] rotate-[28deg] rounded-[50%] border border-[#ff1e35]/50 shadow-[0_0_45px_rgba(255,30,53,0.16)]" />

        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff1e35]/[0.025] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1070px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[27px] border border-[#ff1e35]/80 bg-[linear-gradient(135deg,rgba(20,20,21,0.97),rgba(7,7,8,0.97))] px-5 py-7 shadow-[0_0_70px_rgba(255,30,53,0.08)] sm:px-8 sm:py-9 lg:px-10"
        >
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
            <div>
              <p className="mb-1.5 text-[13px] font-bold tracking-[0.32em] text-[#ff394f]">
                CSI-MJCET
              </p>

              <h1 className="text-[38px] font-extrabold leading-none tracking-[-0.035em] sm:text-[42px]">
                Membership{" "}
                <span className="text-[#ff263d]">Application</span>
              </h1>

              <p className="mt-2 text-[15px] text-[#9b9ba3]">
                Fill in your details to become a part of the CSI-MJCET
                community.
              </p>
            </div>

            <div className="flex min-w-[290px] items-center gap-4 rounded-[14px] border border-[#ff1e35]/50 bg-[#ff1e35]/[0.035] px-5 py-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff1e35]/10">
                <Users
                  size={27}
                  strokeWidth={1.7}
                  className="text-[#ff3047]"
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
            <InputField
              label="Full Name"
              icon={User}
              placeholder="Enter your full name"
              value={form.name}
              onChange={(value) => updateField("name", value)}
            />

            <InputField
              label="Email Address"
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(value) => updateField("email", value)}
            />

            <div>
              <label className="mb-2 block text-[14px] font-semibold text-[#f1f1f2]">
                Branch <span className="ml-1 text-[#ff1e35]">*</span>
              </label>

              <div className="relative">
                <BookOpen
                  size={22}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-[#ff1e35]"
                />

                <div className="pl-[64px]">
                  <CustomDropdown
                    value={form.branch}
                    placeholder="Select your branch"
                    options={branches}
                    onChange={(value) => updateField("branch", value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-semibold text-[#f1f1f2]">
                Year of Study <span className="ml-1 text-[#ff1e35]">*</span>
              </label>

              <div className="relative">
                <GraduationCap
                  size={23}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-[#ff1e35]"
                />

                <div className="pl-[64px]">
                  <CustomDropdown
                    value={form.year}
                    placeholder="Select year"
                    options={years}
                    onChange={(value) => updateField("year", value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <InputField
                label="Roll Number"
                icon={Hash}
                placeholder="1604 - XX - XXX - ZZZZ"
                value={form.rollNumber}
                onChange={handleRollNumber}
              />

              <p className="mt-1 text-[12px] text-[#85858d]">
                Follow the format: 1604 - xx - xxx - zzzz
              </p>
            </div>

            <InputField
              label="Contact Number"
              icon={Phone}
              type="tel"
              placeholder="+91 9876543210"
              value={form.contact}
              onChange={(value) => updateField("contact", value)}
            />
          </div>

          {/* Radio groups */}
          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2.5 block text-[14px] font-semibold">
                Are you a CSI Member?
                <span className="ml-1 text-[#ff1e35]">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ].map((item) => {
                  const active = form.csiMember === item.value;

                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() =>
                        updateField("csiMember", item.value)
                      }
                      className={`flex h-[54px] items-center gap-3 rounded-[15px] border px-4 text-left transition-all duration-200 ${
                        active
                          ? "border-[#ff1e35] bg-[#ff1e35]/[0.035]"
                          : "border-white/[0.12] bg-[#0d0d0e] hover:border-[#ff1e35]/40"
                      }`}
                    >
                      <span
                        className={`flex h-[21px] w-[21px] items-center justify-center rounded-full border ${
                          active
                            ? "border-[#ff1e35]"
                            : "border-[#73737b]"
                        }`}
                      >
                        {active && (
                          <span className="h-[11px] w-[11px] rounded-full bg-[#ff1e35]" />
                        )}
                      </span>

                      <span className="text-[14px] font-medium text-[#dedee2]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2.5 block text-[14px] font-semibold">
                Execom or Core?
                <span className="ml-1 text-[#ff1e35]">*</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "execom", label: "Execom" },
                  { value: "core", label: "Core" },
                ].map((item) => {
                  const active = form.execomCore === item.value;

                  return (
                    <button
                      type="button"
                      key={item.value}
                      onClick={() =>
                        updateField("execomCore", item.value)
                      }
                      className={`flex h-[54px] items-center gap-3 rounded-[15px] border px-4 text-left transition-all duration-200 ${
                        active
                          ? "border-[#ff1e35] bg-[#ff1e35]/[0.035]"
                          : "border-white/[0.12] bg-[#0d0d0e] hover:border-[#ff1e35]/40"
                      }`}
                    >
                      <span
                        className={`flex h-[21px] w-[21px] items-center justify-center rounded-full border ${
                          active
                            ? "border-[#ff1e35]"
                            : "border-[#73737b]"
                        }`}
                      >
                        {active && (
                          <span className="h-[11px] w-[11px] rounded-full bg-[#ff1e35]" />
                        )}
                      </span>

                      <span className="text-[14px] font-medium text-[#dedee2]">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Portfolio */}
          <div className="mt-7">
            <div className="mb-2.5 flex items-center gap-2">
              <Grid2X2
                size={20}
                strokeWidth={1.8}
                className="text-[#ff1e35]"
              />

              <label className="text-[14px] font-semibold text-[#f1f1f2]">
                Select Portfolio (Choose any 2)
                <span className="ml-1 text-[#ff1e35]">*</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
              {portfolios.map((portfolio) => {
                const selected = form.portfolios.includes(portfolio);
                const disabled =
                  !selected && form.portfolios.length >= 2;

                return (
                  <button
                    type="button"
                    key={portfolio}
                    disabled={disabled}
                    onClick={() => togglePortfolio(portfolio)}
                    className={`flex min-h-[50px] items-center gap-3 rounded-[10px] border px-3 text-left transition-all duration-200 ${
                      selected
                        ? "border-[#ff1e35] bg-[#ff1e35]/[0.08] text-white"
                        : disabled
                          ? "cursor-not-allowed border-white/[0.06] bg-white/[0.01] text-[#55555c]"
                          : "border-white/[0.11] bg-[#0d0d0e] text-[#c6c6cc] hover:-translate-y-[1px] hover:border-[#ff1e35]/50 hover:bg-[#ff1e35]/[0.025]"
                    }`}
                  >
                    <span
                      className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[4px] border ${
                        selected
                          ? "border-[#ff1e35] bg-[#ff1e35]"
                          : "border-[#777780]"
                      }`}
                    >
                      {selected && (
                        <Check
                          size={13}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}
                    </span>

                    <span className="text-[12px] font-medium leading-tight">
                      {portfolio}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-2 text-[12px] text-[#777780]">
              You can select up to 2 portfolios.
              {form.portfolios.length > 0 && (
                <span className="ml-1 text-[#ff394f]">
                  {form.portfolios.length}/2 selected
                </span>
              )}
            </p>
          </div>

          {/* Resume */}
          <div className="mt-7">
            <div className="mb-2.5 flex items-center gap-2">
              <FileText
                size={20}
                strokeWidth={1.8}
                className="text-[#ff1e35]"
              />

              <label className="text-[14px] font-semibold">
                Upload Your Resume
                <span className="ml-1 text-[#ff1e35]">*</span>
              </label>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              className={`flex min-h-[130px] w-full flex-col items-center justify-center rounded-[16px] border border-dashed transition-all duration-200 ${
                dragging
                  ? "border-[#ff1e35] bg-[#ff1e35]/[0.06]"
                  : resume
                    ? "border-[#ff1e35]/70 bg-[#ff1e35]/[0.035]"
                    : "border-[#ff1e35]/70 bg-[#0b0b0c] hover:bg-[#ff1e35]/[0.025]"
              }`}
            >
              <div className="mb-2 flex h-[58px] w-[58px] items-center justify-center rounded-full border border-[#ff1e35]/60 bg-[#ff1e35]/10 shadow-[0_0_25px_rgba(255,30,53,0.08)]">
                {resume ? (
                  <Check
                    size={27}
                    strokeWidth={2}
                    className="text-[#ff3047]"
                  />
                ) : (
                  <UploadCloud
                    size={27}
                    strokeWidth={1.7}
                    className="text-[#ff3047]"
                  />
                )}
              </div>

              {resume ? (
                <>
                  <p className="text-[14px] font-semibold text-white">
                    {resume.name}
                  </p>
                  <p className="mt-1 text-[12px] text-[#85858d]">
                    {(resume.size / 1024 / 1024).toFixed(2)} MB • PDF
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[14px] text-[#d6d6da]">
                    <span className="font-semibold text-white">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>

                  <p className="mt-1 text-[12px] text-[#85858d]">
                    PDF only (Max file size: 5MB)
                  </p>
                </>
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="group mt-5 flex h-[51px] w-full items-center justify-center gap-3 rounded-full bg-[#ff1e35] text-[14px] font-bold text-white shadow-[0_8px_30px_rgba(255,30,53,0.15)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#ff293f] hover:shadow-[0_10px_40px_rgba(255,30,53,0.25)] active:translate-y-0"
          >
            <span>Submit Application</span>

            <ArrowRight
              size={20}
              strokeWidth={1.8}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </form>
      </div>
    </main>
  );
}