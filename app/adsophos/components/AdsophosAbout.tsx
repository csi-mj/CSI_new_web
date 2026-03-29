"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView, useVelocity, useSpring, useAnimationFrame, useMotionValue } from "framer-motion";
import { Button } from "@/components/ui/button";

/* ── Hardcoded Adsophos tokens ── */
const PINK = "#ec4899";
const YELLOW = "#ffba00";
const CYAN = "#00f5ff";



/* ── SplitText (exact copy) ── */
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
      className={className + ' cursor-target'}
      aria-label={text}
      style={{ display: 'inline-block ' }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: '100%', skewY: 8 }}
          animate={inView ? { opacity: 1, y: '0%', skewY: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.032,
            ease: [0.22, 1, 0.36, 1]
          }}
          style={{ display: 'inline-block', whiteSpace: 'pre' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

/* ── ParallaxDivider (exact copy) ── */
function ParallaxDivider({
  color,
  baseVelocity = 20,
}: {
  color: string;
  baseVelocity?: number;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const directionFactor = useRef<number>(baseVelocity < 0 ? -1 : 1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * Math.abs(baseVelocity) * (delta / 1000);
    const velocity = smoothVelocity.get();

    if (velocity < 0) {
      directionFactor.current = -1;
    } else if (velocity > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * Math.abs(velocity) * 0.002;

    let nextX = baseX.get() + moveBy;
    nextX = ((nextX % 16) + 16) % 16;
    baseX.set(nextX - 16);
  });

  return (
    <div className="w-[110vw] -ml-[5vw] overflow-hidden">
      <motion.div
        style={{
          x: baseX,
          height: "4px",
          backgroundImage: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 8px, transparent 8px, transparent 16px)`,
        }}
        className="w-full"
      />
    </div>
  );
}

/* ── FeatureCard (exact copy with hardcoded colors) ── */


/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT SECTION — 1:1 REPLICA
   ═══════════════════════════════════════════════════════════════════════════ */
const AdsophosAbout = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgNumY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-2"
    >
      {/* ── Background large ghost text ── */}
      <motion.div
        style={{ y: bgNumY }}
        className="pointer-events-none absolute top-10 -right-20 select-none opacity-[0.03]"
        aria-hidden
      >
        <span
          className="block text-[15vw] leading-none"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            letterSpacing: '-0.04em',
          }}
        >
          ADSOPHOS
        </span>
      </motion.div>

      {/* ── Pixel divider top (pink) ── */}
      <div className="mb-20">
        <ParallaxDivider color={PINK} baseVelocity={-20} />
      </div>

      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-[1.2fr_0.8fr] items-start">
          
          {/* ── LEFT COLUMN: ALL TEXT CONTENT ── */}
          <div className="flex flex-col">
            {/* Header Block */}
            <div className="mb-6 flex flex-col items-start">
              <div className="mb-2 overflow-hidden">
                <div
                  className="text-4xl leading-[1.2] tracking-wide text-white md:text-6xl"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    textShadow: `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,1)`
                  }}
                >
                  <SplitText text="A BLAST" delay={0.1} />
                </div>
              </div>
              <div className="mb-1 ml-2 overflow-hidden pl-1">
                <div
                  className="text-4xl leading-[1.2] tracking-wide md:text-6xl"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: YELLOW,
                    textShadow: '3px 3px 0px rgba(0,0,0,1)'
                  }}
                >
                  <SplitText text="FROM THE" delay={0.2} />
                </div>
              </div>
              <div className="mt-0 overflow-hidden">
                <div
                  className="text-4xl leading-[1.2] tracking-wide text-white md:text-6xl"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    textShadow: `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,1)`
                  }}
                >
                  <SplitText text="PAST." delay={0.3} />
                </div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-6 flex flex-col items-start"
              >
                <span
                  className="text-[12px] md:text-[16px] tracking-[0.2em] font-arcade"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    color: CYAN,
                    textShadow: '2px 2px 0px rgba(0,0,0,1)'
                  }}
                >
                  2-DAY FEST
                </span>
              </motion.div>
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12 h-px origin-left w-full max-w-2xl"
              style={{ backgroundColor: YELLOW }}
            />

            {/* Body Copy */}
            <div className="flex flex-col gap-4 max-w-2xl">
              {[
                "ADSOPHOS 2026 is a vibrant two-day fest where fun, creativity, and culinary delights come together. It's a space to explore, compete, and enjoy a variety of exciting activities with your friends.",
                'From thrilling challenges, a highly insightful Tech expo, to engaging quizzes, watch teams climb their way to the top and leave their mark. Play, compete, and make your place among the best.'
              ].map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="text-base md:text-lg cursor-target opacity-80"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: 'rgb(212,212,206)' // zinc-300
                  }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: EVENT POSTER ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: true, margin: '-5%' }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative group cursor-target mt-12 md:mt-0 perspective-1000"
          >
            <div 
              className="relative aspect-[3/4.2] overflow-hidden bg-zinc-950"
              style={{
                border: `4px solid ${PINK}`,
                boxShadow: `6px 6px 0px 0px ${CYAN}`
              }}
            >
              <Image
                src="/events/ongoing/adsophos.jpeg"
                alt="Adsophos Poster"
                fill
                className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-2"
                priority
              />
              
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Pixel divider bottom (yellow) ── */}
      <div className="mt-32">
        <ParallaxDivider color={YELLOW} baseVelocity={20} />
      </div>
    </section>
  );
};

export default AdsophosAbout;
