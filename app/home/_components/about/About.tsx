'use client';
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import Shuffle from '@/components/Shuffle';
import { Users, Calendar, TrendingUp, Plus } from 'lucide-react';


// import FollowCursorHideCursor from "../ui/simpleCursor";

const About = React.memo(() => {
  const aboutText = useMemo(() => `
The Computer Society of India – MJCET (CSI MJCET) is one of the oldest student oldest chapter of MJCET, fostering a legacy of technical excellence. It's a vibrant community that hosts numerous workshops, hackathons, and projects to build students' programming, leadership, and collaborative skills, connecting them with industry certifications and national events.`, []);
  const [textInView, setTextInView] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTextInView(true);
        }
      },
      { threshold: 0.2 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="">

      <div className="relative pt-20 flex w-full flex-col items-center justify-center">


        <div className="relative z-10 w-full max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ margin: "-100px", once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-12">
              <Shuffle
                text="About CSI MJCET"
                tag="h1"
                className="!text-3xl md:!text-6xl !text-primary !normal-case !font-bold"
                style={{ fontFamily: 'var(--font-orbitron)' }}
                loop={true}
                loopDelay={2}
                duration={0.4}
                stagger={0.04}
                shuffleTimes={2}
                animationMode="evenodd"
                triggerOnce={false}
                triggerOnHover={true}
              />
            </div>

            <div
              ref={textRef}
              className="mx-auto mt-8 max-w-3xl"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {textInView && (
                <TextGenerateEffect
                  words={aboutText}
                  className="text-base md:text-lg text-white/80 leading-relaxed !font-light"
                  duration={0.5}
                  filter={true}
                />
              )}
            </div>
          </motion.div>

          <motion.div
  className="grid grid-cols-1 border-y border-white/10 sm:grid-cols-3"
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{
    duration: 0.65,
    ease: [0.16, 1, 0.3, 1],
  }}
>
  <StatsCard
    title="Members"
    value={200}
    description="Active Members"
    delay={0}
  />

  <div className="border-t border-white/10 sm:border-l sm:border-t-0">
    <StatsCard
      title="Events"
      value={130}
      description="Successfully Organized in 11 Years of CSI"
      delay={0.12}
    />
  </div>

  <div className="border-t border-white/10 sm:border-l sm:border-t-0">
    <StatsCard
      title="Reach"
      value={400000}
      description="Social Media Impact"
      delay={0.24}
    />
  </div>
</motion.div>
        </div>
      </div>
    </div>
  );
});

About.displayName = 'About';

const StatsCard = React.memo(({
  title,
  value,
  description,
  delay = 0,
}: {
  title: string;
  value: number;
  description: string;
  iconType?: 'users' | 'calendar' | 'trending';
  delay?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  });

  const motionValue = useMotionValue(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setCount(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value, motionValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex min-h-[220px] flex-col justify-center overflow-visible px-6 py-10 transition-colors duration-300 hover:bg-white/[0.02] sm:px-7 md:px-8 lg:min-h-[250px] lg:px-8"
    >
     <div className="flex items-baseline whitespace-nowrap">
  <h3 className="bg-gradient-to-tr from-[#ff1a1a] via-[#e60000] to-[#7f0000] bg-clip-text font-mono text-[clamp(2.2rem,4vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.15] pr-[0.08em] text-transparent">
    {count.toLocaleString("en-US")}
  </h3>

  <span className="ml-1 shrink-0 font-mono text-[clamp(2.2rem,4vw,3.5rem)] font-medium leading-tight tracking-normal text-[#e60000]">
    +
  </span>
</div>

      <p className="mt-8 font-mono text-xs font-medium uppercase leading-relaxed tracking-wide text-white/85">
        {title}
      </p>

      <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/75">
        {description}
      </p>

     <div className="absolute bottom-0 left-0 h-px w-0 bg-[#ff1a1a] transition-all duration-500 group-hover:w-full" /> 
      </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

export default About;
