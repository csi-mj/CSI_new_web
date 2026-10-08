'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Users,
  Lightbulb,
  TrendingUp,
  Target,
  Sparkles
} from 'lucide-react';
import {
  iconColors,
  bgColors,
  borderColors,
  translucentBgColors
} from '@/config/colors';

const features = [
  {
    icon: Users,
    title: 'PEOPLE',
    color: 'blue'
  },
  {
    icon: Lightbulb,
    title: 'IDEAS',
    color: 'yellow'
  },
  {
    icon: TrendingUp,
    title: 'GROWTH',
    color: 'green'
  },
  {
    icon: Target,
    title: 'IMPACT',
    color: 'purple'
  }
] as const;

export default function RecruitmentHero() {
  return (
    <section className="relative mt-16 min-h-[calc(100vh-80px)] overflow-hidden bg-black px-6 py-20 text-white">
      {/* Background red glow - static */}
      <div
        className={`pointer-events-none absolute top-0 -right-40 h-[500px] w-[500px] rounded-full ${translucentBgColors.red} opacity-1 blur-[100px]`}
      />

      {/* Decorative curves */}
      <div
        className={`pointer-events-none absolute -top-48 -right-48 h-[600px] w-[600px] rounded-full border ${borderColors.red}`}
      />

      <div
        className={`pointer-events-none absolute -bottom-80 -left-80 h-[750px] w-[750px] rounded-full border ${borderColors.red}`}
      />

      <div className="pointer-events-none absolute -bottom-72 -left-72 h-[680px] w-[680px] rounded-full border border-white/15" />

      {/* Background red glow - static */}
      <div
        className={`pointer-events-none absolute -top-0 -right-40 h-[500px] w-[500px] rounded-full ${translucentBgColors.red} opacity-40 blur-[100px]`}
      />

      {/* Decorative curves */}
      <div
        className={`pointer-events-none absolute -top-48 -right-48 h-[600px] w-[600px] rounded-full border ${borderColors.red}`}
      />

      <div
        className={`pointer-events-none absolute -bottom-80 -left-80 h-[750px] w-[750px] rounded-full border ${borderColors.red}`}
      />

      <div className="pointer-events-none absolute -bottom-72 -left-72 h-[680px] w-[680px] rounded-full border border-white/15" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* CSI Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-5"
        >
          <span className={`h-px w-16 ${bgColors.red}`} />

          <span className="font-[Orbitron] text-[11px] font-medium tracking-[0.45em] text-white/80 sm:text-sm">
            COMPUTER SOCIETY OF INDIA
          </span>

          <span className={`h-px w-16 ${bgColors.red}`} />
        </motion.div>

        {/* CSI MJCET */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 font-[Orbitron] text-xs tracking-[0.5em] text-white/70 sm:text-sm"
        >
          CSI-MJCET
        </motion.p>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-[Orbitron] text-5xl leading-[1.05] font-medium tracking-tight uppercase sm:text-6xl md:text-7xl"
        >
          <span className="block text-white">Be a Part of</span>

          <span className="mt-2 block font-extrabold">
            <span className="text-white">Our </span>
            <span className={iconColors.red}>Team</span>
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="--font-poppins mt-8 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8"
        >
          Some students attend events. Others create them. Which one are you?
          <br className="hidden sm:block" />
          Want to be part of the team behind some of the most exciting,
          impactful, and talked-about events on campus?
        </motion.p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="#recruitment-form-start"
            className={`flex min-w-[230px] items-center justify-center gap-4 border ${borderColors.red} ${bgColors.red} cursor-target px-8 py-4 font-[Orbitron] text-sm font-bold tracking-wider text-white uppercase transition-colors duration-300 hover:bg-black`}
          >
            Apply Now
            <ArrowRight size={19} strokeWidth={2} />
          </Link>

          <Link
            href="#about-recruitment"
            className={`cursor-target flex min-w-[230px] items-center justify-center gap-4 border border-white/80 bg-transparent px-8 py-4 font-[Orbitron] text-sm font-bold tracking-wider text-white uppercase transition-colors duration-300 hover:${borderColors.red} hover:${iconColors.red} `}
          >
            Know More
            <ArrowRight size={19} strokeWidth={2} />
          </Link>
        </div>

        {/* Feature Row */}
        <div className="mt-16 flex w-full max-w-3xl flex-row items-center justify-center sm:flex-row ">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorKey = feature.color;

            return (
              <div
                key={feature.title}
                className="cursor-target flex w-full items-center justify-center"
              >
                <motion.div
                  className="flex flex-1 flex-col items-center justify-center py-5 sm:py-0"
                  whileHover="hover"
                  initial="initial"
                >
                  {/* Icon */}
                  <motion.div
                    variants={{
                      initial: { scale: 1 },
                      hover: { scale: 1.12 }
                    }}
                    transition={{
                      duration: 0.25,
                      ease: 'easeOut'
                    }}
                  >
                    <Icon
                      size={42}
                      strokeWidth={1.5}
                      className={iconColors[colorKey]}
                    />
                  </motion.div>

                  {/* Text */}
                  <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.45 + index * 0.1
                    }}
                    className="mt-4 font-[Orbitron] text-xs font-medium tracking-[0.3em] text-white"
                  >
                    {feature.title}
                  </motion.span>

                  {/* Line */}
                  <motion.span
                    variants={{
                      initial: { width: 40 },
                      hover: { width: 70 }
                    }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeOut'
                    }}
                    className={`mt-3 h-[3px] ${bgColors[colorKey]}`}
                  />
                </motion.div>

                {/* Divider */}
                {index !== features.length - 1 && (
                  <div className="hidden h-16 w-px bg-white/20 sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
