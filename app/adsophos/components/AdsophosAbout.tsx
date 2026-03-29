"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { FileText, ImageIcon, Brain, PartyPopper, Lightbulb } from "lucide-react";

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
      className="relative overflow-hidden px-6 py-4"
    >
      {/* ── Background large ghost text ── */}
      <motion.div
        style={{ y: bgNumY }}
        className="pointer-events-none absolute top-0 -right-8 select-none"
        aria-hidden
      >
        <span
          className="block text-[22vw] leading-none"
          style={{
            fontFamily: "'Press Start 2P', cursive",
            letterSpacing: '-0.04em',
            color: 'rgba(255,255,255,0.03)'
          }}
        >
          2026
        </span>
      </motion.div>

      {/* ── Pixel divider top (pink) ── */}
      <ParallaxDivider color={PINK} baseVelocity={-20} />

      <div className="container mx-auto mt-20 max-w-5xl ">
        {/* ── HEADER BLOCK ── */}
        <div className="mb-4 grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-3 overflow-hidden">
              <div
                className="text-3xl leading-[1.2] tracking-wide text-white md:text-5xl"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  textShadow: `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,1)`
                }}
              >
                <SplitText text="A BLAST" delay={0.1} />
              </div>
            </div>
            <div className="mb-3 ml-1 overflow-hidden pl-1">
              <div
                className="text-3xl leading-[1.2] tracking-wide md:text-5xl"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  color: YELLOW,
                  textShadow: '3px 3px 0px rgba(0,0,0,1)'
                }}
              >
                <SplitText text="FROM THE" delay={0.2} />
              </div>
            </div>
            <div className="mt-1 overflow-hidden">
              <div
                className="text-3xl leading-[1.2] tracking-wide text-white md:text-5xl"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  textShadow: `3px 3px 0px ${PINK}, 6px 6px 0px rgba(0,0,0,1)`
                }}
              >
                <SplitText text="PAST." delay={0.3} />
              </div>
            </div>
          </div>

          {/* Right meta */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="hidden flex-col items-end gap-1 pb-1 md:flex"
          >
            <span
              className="text-[15px] tracking-widest"
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
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 h-px origin-left"
          style={{ backgroundColor: YELLOW }}
        />

        {/* ── BODY COPY ── */}
        <div className="mb-0 grid gap-10 md:grid-cols-2">
          {[
            "ADSOPHOS 2026 is a vibrant two-day fest where fun, creativity, and culinary delights come together. It's a space to explore, compete, and enjoy a variety of exciting activities with your friends.",
            'From thrilling challenges, a highly insightful Tech expo, to engaging quizzes, watch teams climb their way to the top and leave their mark. Play, compete, and make your place among the best.'
          ].map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{
                duration: 0.6,
                delay: 0.1 + i * 0.12,
                ease: [0.22, 1, 0.36, 1]
              }}
              className="text-sm leading-relaxed cursor-target"
              style={{
                fontFamily: "'Space Mono', monospace",
                color: 'rgb(113,113,122)'
              }}
            >
              {para}
            </motion.p>
          ))}
        </div>
      </div>

      {/* ── FEATURE CARDS ── */}
      

        {/* ── Background ghost text "ADSOPHOS" ── */}
        {/* <motion.div
          style={{ y: bgNumY }}
          className="pointer-events-none absolute -right-36 -bottom-40 select-none"
          aria-hidden
        >
          <span
            className="block text-[12vw] leading-none"
            style={{
              fontFamily: "'Press Start 2P', cursive",
              letterSpacing: '-0.04em',
              color: 'rgba(255,255,255,0.03)'
            }}
          >
            ADSOPHOS
          </span>
        </motion.div> */}


      {/* ── Pixel divider bottom (yellow) ── */}
      <div className="mt-16">
        <ParallaxDivider color={YELLOW} baseVelocity={20} />
      </div>
    </section>
  );
};

export default AdsophosAbout;
