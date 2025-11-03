"use client";
import React from "react";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

type FacultyProps = {
  image?: string;
  name?: string;
  department?: string;
  quote?: string;
};

export default function Faculty({
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

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-5xl rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-6 md:p-8 backdrop-blur-xs shadow-[0_8px_40px_rgba(0,0,0,0.25)] relative overflow-hidden"
      >
      <motion.div
        className="text-center"
        initial={{ opacity: 1, y: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        onViewportEnter={() => setTitleInView(true)}
        onViewportLeave={() => setTitleInView(false)}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ amount: 0.6 }}
      >
        {titleInView ? (
          <TextGenerateEffect
            words="Faculty Coordinator"
            duration={1}
            delay={.1}
            className="text-primary font-orbitron pb-6 text-3xl md:text-5xl font-semibold tracking-tight mb-6"
          />
        ) :
        (
          <h2 className="text-center text-primary font-orbitron pb-6 text-3xl md:text-5xl font-semibold tracking-tight mb-6">Faculty Coordinator</h2>
        )}
      </motion.div>

        {/* subtle corner shine */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-white/5 to-transparent blur-3xl" />

        <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] items-center gap-6 md:gap-8">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            animate={imgInView ? { opacity: 1, x: 0 } : {}}
            onViewportEnter={() => setImgInView(true)}
            onViewportLeave={() => setImgInView(false)}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/15 bg-black/20"
          >
            <img
              src={image}
              alt={name}
              className="absolute inset-0 cursor-target h-full w-full object-cover"
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
            onViewportEnter={() => setContentInView(true)}
            onViewportLeave={() => setContentInView(false)}
            viewport={{ amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.05 }}
            className="min-w-0"
          >
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              onViewportEnter={() => setNameInView(true)}
              onViewportLeave={() => setNameInView(false)}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ amount: 0.6 }}
            >
              {nameInView && (
                <h2 className="text-white  text-2xl md:text-3xl font-semibold tracking-tight">
                  <span className="cursor-target">{name}</span>
                </h2>
              )}
            </motion.div>
            <p className="mt-2 text-white/80 cursor-target text-sm md:text-base">
              <span className="cursor-target">{department}</span>
            </p>

            <div className="mt-4 cursor-target inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs  md:text-sm text-white/85">{quote}</span>
            </div>

            {/* Divider */}
            <div className="mt-6 h-px w-full bg-gradient-to-r from-white/20 via-white/10 to-transparent" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
