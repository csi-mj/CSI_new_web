"use client";
import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";

type FacultyProps = {
  image?: string;
  name?: string;
  department?: string;
  quote?: string;
};

const Faculty = React.memo(function Faculty({
  image =
    "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop",
  name = "Zainuddin Naveed",
  department = "Department of Computer Science & Engineering",
  quote = "Inspiring minds to build the future.",
}: FacultyProps) {
  const [titleInView, setTitleInView] = React.useState(false);
  const [nameInView, setNameInView] = React.useState(false);
  const [imgInView, setImgInView] = React.useState(false);
  const [contentInView, setContentInView] = React.useState(false);

  const handleTitleEnter = useCallback(() => setTitleInView(true), []);
  const handleTitleLeave = useCallback(() => setTitleInView(false), []);
  const handleNameEnter = useCallback(() => setNameInView(true), []);
  const handleNameLeave = useCallback(() => setNameInView(false), []);
  const handleImgEnter = useCallback(() => setImgInView(true), []);
  const handleImgLeave = useCallback(() => setImgInView(false), []);
  const handleContentEnter = useCallback(() => setContentInView(true), []);
  const handleContentLeave = useCallback(() => setContentInView(false), []);

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/5 p-3 sm:p-4 md:p-6 backdrop-blur-xs shadow-[0_8px_40px_rgba(0,0,0,0.25)] relative overflow-hidden"
      >
      <motion.div
        className="text-center"
        initial={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        onViewportEnter={handleTitleEnter}
        onViewportLeave={handleTitleLeave}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ amount: 0.6 }}
      >
        {titleInView ? (
          <TextGenerateEffect
            words="Faculty Coordinator"
            duration={1}
            delay={.1}
            className="text-primary font-orbitron pb-3 text-3xl md:text-5xl font-semibold tracking-tight mb-4"
          />
        ) :
        (
          <h2 className="text-center text-primary font-orbitron pb-3 text-3xl md:text-5xl font-semibold tracking-tight mb-4">Faculty Coordinator</h2>
        )}
      </motion.div>

        {/* subtle corner shine */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-3xl" />

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-center gap-4 md:gap-6">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            onViewportEnter={handleImgEnter}
            onViewportLeave={handleImgLeave}
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
            <div className="absolute inset-0 cursor-target bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            animate={contentInView ? { opacity: 1, x: 0 } : {}}
            onViewportEnter={handleContentEnter}
            onViewportLeave={handleContentLeave}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="min-w-0 relative"
          >
            {/* Decorative background elements */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl opacity-50" />
            <div className="absolute -left-4 -bottom-4 h-32 w-32 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-xl opacity-30" />

            {/* Content wrapper with enhanced styling */}
            <div className="relative space-y-4">
              {/* Name Section */}
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                whileInView={{ opacity: 1, y: 0 }}
                onViewportEnter={handleNameEnter}
                onViewportLeave={handleNameLeave}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ amount: 0.6 }}
                className="space-y-2"
              >
                {nameInView && (
                  <>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="h-1 w-8 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
                      <span className="text-xs md:text-sm font-medium text-white/60 uppercase tracking-wider cursor-target">
                        Faculty Member
                      </span>
                    </div>
                    <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                      <span id="cursor" className="cursor-target bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
                        {name}
                      </span>
                    </h2>
                  </>
                )}
              </motion.div>

              {/* Department Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="flex items-start gap-3 p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-target group">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-primary opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs md:text-sm font-medium text-white/50 uppercase tracking-wide mb-1">
                      Department
                    </p>
                    <p className="text-white/90 text-sm md:text-base font-medium leading-relaxed">
                      <span id="cursor" className="cursor-target">{department}</span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Quote Section - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative"
              >
                <div className="relative p-4 md:p-5 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm overflow-hidden cursor-target group">
                 
                  {/* Quote content */}
                  <div className="relative z-10 flex items-start gap-3">
                   
                    <div className="flex-1">
                      <p className="text-sm md:text-base font-medium text-white/95 leading-relaxed italic">
                        <span id="cursor" className="cursor-target">{quote}</span>
                      </p>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full opacity-50" />
                </div>
              </motion.div>

              {/* Enhanced Divider with decorative elements */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={contentInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative pt-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-white/30" />
                  <div className="h-2 w-2 rounded-full bg-primary/60" />
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/20 to-white/30" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

Faculty.displayName = 'Faculty';

export default Faculty;
