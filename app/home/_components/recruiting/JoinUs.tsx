"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RecruitmentHero from "@/app/recruitments/recruitmentHero"; 

export default function JoinUs() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-6 py-24 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">

        {/* Small Label */}
        <div className="mb-10 flex items-center gap-8">
          <span className="h-px w-20 bg-[#ff1e35]" />

          <span className="font-inter text-sm font-medium tracking-[0.55em] text-[#ff1e35]">
            JOIN US
          </span>

          <span className="h-px w-20 bg-[#ff1e35]" />
        </div>

        {/* Main Heading */}
        <h2 className="font-inter text-5xl font-bold uppercase leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          <span className="block text-white">
            Be a Part of
          </span>

          <span className="block bg-gradient-to-r from-[#ff152f] via-[#ff1e35] to-[#e50925] bg-clip-text text-transparent">
            Something Bigger
          </span>
        </h2>

        {/* Description */}
        <p className="mt-8 max-w-3xl font-inter text-xs uppercase leading-8 tracking-[0.22em] text-neutral-400 sm:text-sm">
          A community of curious minds, creators, and doers.
          <br className="hidden sm:block" />
          Learn. Build. Collaborate. Make an Impact.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex w-full flex-col items-center justify-center gap-5 sm:flex-row">

            {/* Become a Member */}
<motion.div
  initial="rest"
  animate="rest"
  whileHover="hover"
  whileTap={{ y: 0 }}
  variants={{
    rest: { y: 0 },
    hover: { y: -4 },
  }}
  transition={{ duration: 0.2 }}
>
  <Link
    href="/membership"
    className="
      group relative flex min-w-[260px] items-center justify-center gap-4
      overflow-hidden
      border border-[#ff1e35]
      bg-[#ff1e35]
      px-8 py-4
      font-inter text-sm font-bold uppercase tracking-wider
      text-white
      clip-cta
    "
  >
    {/* Black fill: bottom → top */}
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 origin-bottom bg-black"
      variants={{
        rest: { scaleY: 0 },
        hover: { scaleY: 1 },
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    />

    <span className="relative z-10">
      Become a Member
    </span>

    <ArrowRight
      size={19}
      strokeWidth={2}
      className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
    />
  </Link>
</motion.div>

{/* Get Recruited */}
<motion.div
  initial="rest"
  animate="rest"
  whileHover="hover"
  whileTap={{ y: 0 }}
  variants={{
    rest: { y: 0 },
    hover: { y: -4 },
  }}
  transition={{ duration: 0.2 }}
>
  <Link
    href="/recruitments"
    className="
      group relative flex min-w-[260px] items-center justify-center gap-4
      overflow-hidden
      border border-[#ff1e35]
      bg-transparent
      px-8 py-4
      font-inter text-sm font-bold uppercase tracking-wider
      text-white
      clip-cta
      transition-shadow duration-300
      hover:shadow-[0_0_30px_rgba(255,30,53,0.3)]
    "
  >
    {/* Red fill: bottom → top */}
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 origin-bottom bg-[#ff1e35]"
      variants={{
        rest: { scaleY: 0 },
        hover: { scaleY: 1 },
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    />

    <span className="relative z-10">
      Get Recruited
    </span>

    <ArrowRight
      size={19}
      strokeWidth={2}
      className="relative z-10 transition-transform duration-300 group-hover:translate-x-1.5"
    />
  </Link>
</motion.div>
    
</div>

        {/* Bottom Tagline */}
        <p className="mt-10 font-inter text-[10px] uppercase tracking-[0.35em] text-neutral-600">
          Learn · Build · Collaborate · Lead
        </p>

      </div>
    </section>
  );
}