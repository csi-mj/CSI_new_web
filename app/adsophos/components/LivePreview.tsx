"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Hardcoded Adsophos tokens ── */
const PINK = "#ec4899";
const YELLOW = "#ffba00";
const CYAN = "#00f5ff";

const BORDER = `4px solid ${PINK}`;
const SHADOW = `3px 3px 0px ${CYAN}`;

/* ── SplitText ── */
const SplitText = ({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <span ref={ref} className={className} aria-label={text} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", skewY: 8 }}
          animate={inView ? { opacity: 1, y: "0%", skewY: 0 } : {}}
          transition={{ duration: 0.5, delay: delay + i * 0.032, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const LivePreview = () => {
  return (
    <div className="w-full py-20 px-4 md:px-0 flex flex-col items-center gap-12">
      {/* ── Section Header (exact Adsophos EventsSection header) ── */}
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="overflow-hidden mb-1">
          <h2
            className="text-4xl md:text-6xl text-center text-white"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              textShadow: `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,1)`,
            }}
          >
            <SplitText text="EXPLORE" delay={0.1} />
          </h2>
        </div>
        <div className="overflow-hidden">
          <h2
            className="text-4xl md:text-6xl text-center"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              color: YELLOW,
              textShadow: "3px 3px 0px rgba(0,0,0,1)",
            }}
          >
            <SplitText text="THE ARENA" delay={0.3} />
          </h2>
        </div>
        <p
          className="text-center mb-8 mt-4 uppercase tracking-widest"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: "10px",
            color: CYAN,
            textShadow: "2px 2px 0px rgba(0,0,0,1)",
          }}
        >
          PREVIEW THE FULL ADSOPHOS EXPERIENCE
        </p>
      </div>

      {/* ── Iframe Container (styled like an EventCard) ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -6, boxShadow: `5px 5px 0px ${CYAN}` }}
        className="w-full max-w-6xl overflow-hidden"
        style={{
          backgroundColor: "rgb(9,9,11)", // zinc-950
          border: BORDER,
          boxShadow: SHADOW,
        }}
      >
        {/* Browser Top Bar */}
        <div
          className="w-full flex items-center justify-between px-4 py-3"
          style={{ borderBottom: BORDER }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: "#ff4c4c", border: "1px solid rgba(0,0,0,0.3)" }} />
            <div className="w-3 h-3" style={{ backgroundColor: YELLOW, border: "1px solid rgba(0,0,0,0.3)" }} />
            <div className="w-3 h-3" style={{ backgroundColor: CYAN, border: "1px solid rgba(0,0,0,0.3)" }} />
          </div>
          <div
            className="hidden md:flex px-3 py-1 justify-center"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: "8px",
              color: CYAN,
              textShadow: "1px 1px 0px rgba(0,0,0,1)",
              border: `2px solid ${PINK}`,
              boxShadow: `2px 2px 0px rgba(0,0,0,1)`,
              backgroundColor: "rgb(9,9,11)",
            }}
          >
            ADSOPHOS.VERCEL.APP
          </div>
          <div className="w-10" />
        </div>

        {/* The Preview Frame */}
        <div className="w-full relative" style={{ height: "500px", backgroundColor: "#000" }}>
          <iframe
            src="https://adsophos.vercel.app/"
            className="w-full h-full border-none"
            title="Adsophos Preview"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default LivePreview;
