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

const features = [
  { icon: FileText, label: "Paper Presentation", desc: "Present your research & ideas", index: "01" },
  { icon: ImageIcon, label: "Poster Presentation", desc: "Showcase creative visual displays", index: "02" },
  { icon: Brain, label: "Quiz Competition", desc: "Test your knowledge & win", index: "03" },
  { icon: PartyPopper, label: "Fun Events", desc: "Treasure hunts & quizzes", index: "04" },
  { icon: Lightbulb, label: "Project Expo", desc: "Showcase your innovations", index: "05" },
];

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
          backgroundColor: "rgb(24,24,27)",
        }}
        className="group relative flex-1 flex flex-col px-5 pt-6 pb-5 cursor-pointer overflow-visible transition-all duration-150 hover:shadow-[2px_2px_0_0_#00f5ff] hover:translate-y-[2px] hover:translate-x-[2px] active:shadow-none active:translate-y-[4px] active:translate-x-[4px]"
      >
        {/* Hover fill */}
        <div
          className="absolute inset-0 origin-bottom scale-y-0 opacity-0 transition-all duration-300 group-hover:scale-y-100 group-hover:opacity-100 pointer-events-none"
          style={{ backgroundColor: `${PINK}1a` }}
        />

        {/* Index */}
        <span
          className="mb-auto tracking-widest transition-colors relative z-10"
          style={{
            fontFamily: "'Press Start 2P', cursive",
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
            fontFamily: "'Press Start 2P', cursive",
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

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 pointer-events-none z-20"
          style={{ backgroundColor: PINK }}
        />
      </div>
    </motion.div>
  );
};

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

      <div className="container mx-auto mt-28 max-w-5xl ">
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
      <div className="relative container mx-auto mt-10 max-w-5xl">
        <div className="grid grid-cols-1 gap-4 bg-transparent p-2 sm:grid-cols-2 md:grid-cols-5">
          {features.map((f, i) => (
            <div key={f.label} className="cursor-target"><FeatureCard f={f} i={i}/></div>
          ))}
        </div>

        {/* ── Background ghost text "ADSOPHOS" ── */}
        <motion.div
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
        </motion.div>
      </div>

      {/* ── Pixel divider bottom (yellow) ── */}
      <div className="mt-28">
        <ParallaxDivider color={YELLOW} baseVelocity={20} />
      </div>
    </section>
  );
};

export default AdsophosAbout;
