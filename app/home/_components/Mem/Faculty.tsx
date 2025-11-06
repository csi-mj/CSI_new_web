"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import image from "@/public/about/zainsir.jpg";

type FacultyProps = {
  image?: string;
  name?: string;
  department?: string;
  quote?: string;
};

const Faculty = React.memo(function Faculty({
  name = "Zainuddin Naveed",
  department = "Department of Computer Science & Engineering",
  quote = "Inspiring minds to build the future.",
}: FacultyProps) {
  const [titleInView, setTitleInView] = React.useState(false);

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-4">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/5 p-3 sm:p-4 md:p-6 backdrop-blur-xs shadow-[0_8px_40px_rgba(0,0,0,0.25)] relative overflow-hidden">
        
        <motion.div
          className="text-center"
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setTitleInView(true)}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 0.6, once: true }}
        >
          {titleInView ? (
            <TextGenerateEffect
              words="Faculty Coordinator"
              duration={1}
              delay={0.1}
              className="text-primary font-orbitron pb-3 text-3xl md:text-5xl font-semibold tracking-tight mb-4"
            />
          ) : (
            <h2 className="text-center text-primary font-orbitron pb-3 text-3xl md:text-5xl font-semibold tracking-tight mb-4">
              Faculty Coordinator
            </h2>
          )}
        </motion.div>

        {/* subtle corner shine */}
        {/* <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-3xl" /> */}

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-4 md:gap-6">
          
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/15 bg-black/20"
          >
            <Image
              src={image}
              alt={name}
              width={300}
              height={400}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              fetchPriority="low"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="min-w-0 relative"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl opacity-50" />
            <div className="absolute -left-4 -bottom-4 h-32 w-32 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-xl opacity-30" />

            <div className="relative space-y-4">
              
              {/* Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-1 w-8 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                  <span className="text-xs md:text-sm font-medium text-white/60 uppercase tracking-wider">
                    Faculty Member
                  </span>
                </div>
                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                  {name}
                </h2>
              </div>

              {/* Department */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-xs md:text-sm font-medium text-white/50 uppercase tracking-wide mb-1">Department</p>
                  <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">
                    {department}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="relative p-4 md:p-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm overflow-hidden">
                <p className="text-sm md:text-base font-medium text-white/95 leading-relaxed italic">
                  {quote}
                </p>
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full opacity-50" />
              </div>

              {/* Divider */}
              <div className="relative pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-white/30" />
                  <div className="h-2 w-2 rounded-full bg-primary/60" />
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/20 to-white/30" />
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Faculty.displayName = "Faculty";

export default Faculty;
