"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, ImageIcon, Brain, PartyPopper, Lightbulb } from "lucide-react";

/* ── Hardcoded Adsophos tokens ── */
const PINK = "#ec4899";
const YELLOW = "#ffba00";
const CYAN = "#00f5ff";

const features = [
  { icon: FileText, label: "Paper Presentation", desc: "Present your research & ideas", index: "01" },
  { icon: ImageIcon, label: "Poster Presentation", desc: "Showcase creative visual displays", index: "02" },
  { icon: Brain, label: "Quiz Competition", desc: "Test your knowledge & win", index: "03" },
  { icon: PartyPopper, label: "Fun Events", desc: "Treasure hunts & quizzes", index: "04" },
  { icon: Lightbulb, label: "Project Expo", desc: "Showcase your innovations", index: "05" },
];

/* ── FeatureCard (exact copy from Adsophos AboutSection) ── */
const FeatureCard = ({ f, i }: { f: (typeof features)[0]; i: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full"
    >
      <div
        style={{
          minHeight: 170,
          border: `2px solid ${PINK}`,
          boxShadow: `4px 4px 0 0 ${CYAN}`,
          backgroundColor: "rgb(24,24,27)", // zinc-900
        }}
        className="group relative flex-1 flex flex-col px-5 pt-6 pb-5 cursor-pointer overflow-visible transition-all duration-150 hover:shadow-[2px_2px_0_0_#00f5ff] hover:translate-y-[2px] hover:translate-x-[2px] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
      >
        {/* Hover fill — slides up from bottom */}
        <div
          className="absolute inset-0 origin-bottom scale-y-0 opacity-0 transition-all duration-300 group-hover:scale-y-100 group-hover:opacity-100 pointer-events-none"
          style={{ backgroundColor: `${PINK}1a` }}
        />

        {/* Index number */}
        <span
          className="mb-auto tracking-widest group-hover:text-[#ffba00] transition-colors relative z-10"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "9px",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          {f.index}
        </span>

        {/* Icon */}
        <div className="mt-4 mb-3 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
          <f.icon
            className="w-7 h-7 transition-colors duration-200 text-[#ffba00] group-hover:text-[#00f5ff]"
            strokeWidth={1.5}
          />
        </div>

        {/* Label */}
        <span
          className="text-white leading-snug tracking-wide mb-1.5 relative z-10"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            textShadow: "1px 1px 0px rgba(0,0,0,1)",
          }}
        >
          {f.label}
        </span>

        {/* Desc */}
        <span
          className="leading-relaxed font-bold group-hover:text-white/80 transition-colors relative z-10"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "10px",
            color: "rgb(113,113,122)",
          }}
        >
          {f.desc}
        </span>

        {/* Bottom border accent — expands on hover */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 pointer-events-none z-20"
          style={{ backgroundColor: PINK }}
        />
      </div>
    </motion.div>
  );
};

const EventGrid = () => {
  return (
    <div className="w-full py-12 px-4 md:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 bg-transparent p-2">
        {features.map((f, i) => (
          <FeatureCard key={f.label} f={f} i={i} />
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
