"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Hardcoded Adsophos tokens (repo-independent) ── */
const PINK = "#ec4899";
const YELLOW = "#ffba00";     // arcade-yellow
const CYAN = "#00f5ff";       // arcade-cyan

const BORDER = `4px solid ${PINK}`;
const SHADOW = `3px 3px 0px ${CYAN}`;
const TEXT_3D = `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,1)`;
const TEXT_3D_YELLOW = `3px 3px 0px rgba(0,0,0,1)`;

/* ── SplitText (exact copy from Adsophos) ── */
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
    <span
      ref={ref}
      className={className}
      aria-label={text}
      style={{ display: "inline-block" }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "100%", skewY: 8 }}
          animate={inView ? { opacity: 1, y: "0%", skewY: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.032,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const AdsophosHero = () => {
  return (
    <div className="w-full flex flex-col items-start gap-4 py-12 px-4 md:px-0">
      {/* ── HEADER BLOCK (exact layout from AboutSection) ── */}
      <div className="grid md:grid-cols-[1fr_auto] gap-8 items-end mb-4 w-full">
        <div>
          <div className="overflow-hidden mb-3">
            <div
              className="text-3xl md:text-5xl leading-[1.2] tracking-wide text-white"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                textShadow: TEXT_3D,
              }}
            >
              <SplitText text="A BLAST" delay={0.1} />
            </div>
          </div>
          <div className="overflow-hidden mb-3 pl-1 ml-1">
            <div
              className="text-3xl md:text-5xl leading-[1.2] tracking-wide"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                color: YELLOW,
                textShadow: TEXT_3D_YELLOW,
              }}
            >
              <SplitText text="FROM THE" delay={0.2} />
            </div>
          </div>
          <div className="overflow-hidden mt-1">
            <div
              className="text-3xl md:text-5xl leading-[1.2] tracking-wide text-white"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                textShadow: TEXT_3D,
              }}
            >
              <SplitText text="PAST." delay={0.3} />
            </div>
          </div>
        </div>

        {/* Right meta block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden md:flex flex-col items-end gap-1 pb-1"
        >
          <span
            className="text-[15px] tracking-widest"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: CYAN,
              textShadow: "2px 2px 0px rgba(0,0,0,1)",
            }}
          >
            2-DAY FEST
          </span>
        </motion.div>
      </div>

      {/* Animated underline rule */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-px origin-left mb-12 w-full"
        style={{ backgroundColor: YELLOW }}
      />

      {/* ── BODY COPY ── */}
      <div className="grid md:grid-cols-2 gap-10 mb-0">
        {[
          "ADSOPHOS 2026 is a vibrant two-day fest where fun, creativity, and culinary delights come together. It's a space to explore, compete, and enjoy a variety of exciting activities with your friends.",
          "From thrilling challenges, a highly insightful Tech expo, to engaging quizzes, watch teams climb their way to the top and leave their mark. Play, compete, and make your place among the best.",
        ].map((para, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{
              duration: 0.6,
              delay: 0.1 + i * 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-sm leading-relaxed"
            style={{
              fontFamily: "'Space Mono', monospace",
              color: "rgb(113,113,122)", // zinc-500
            }}
          >
            {para}
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default AdsophosHero;
