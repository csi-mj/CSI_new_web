'use client';
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { TracingBeam } from '@/components/ui/tracing-beam';
import { cn } from '@/lib/utils';
import Shuffle from '@/components/Shuffle';
import { Users, Calendar, TrendingUp } from 'lucide-react';

// import FollowCursorHideCursor from "../ui/simpleCursor";

const About = () => {
  const aboutText = `At CSI MJCET, we are dedicated to fostering a vibrant community of tech enthusiasts and future innovators. Our mission is to bridge the gap between academic learning and industry requirements, providing students with hands-on experience and exposure to cutting-edge technologies.`;

  return (
    <div className="pt-12">
      <div className="relative flex w-full flex-col items-center justify-center bg-black">

        <div className="relative z-10 w-full max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
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

            <div className="mx-auto mt-8 max-w-3xl" style={{ fontFamily: 'var(--font-inter)' }}>
              <TextGenerateEffect 
                words={aboutText} 
                className="text-base md:text-lg text-white/80 leading-relaxed !font-light" 
                duration={0.5}
                filter={true}
              />
            </div>
          </motion.div>

          <motion.div 
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <StatsCard
              title="Members"
              value={200}
              description="Active Members"
              icon={<Users className="w-6 h-6" />}
              delay={0}
            />
            <StatsCard
              title="Events"
              value={50}
              description="Successfully Organized"
              icon={<Calendar className="w-6 h-6" />}
              delay={0.1}
            />
            <StatsCard
              title="Reach"
              value={20000}
              description="Social Media Impact"
              icon={<TrendingUp className="w-6 h-6" />}
              delay={0.2}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({
  title,
  value,
  description,
  icon,
  delay = 0
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCount(Math.min(Math.round(increment * (currentStep + 1)), value));
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <motion.div
      ref={cardRef}
      className="group cursor-target relative flex flex-col justify-between space-y-4 rounded-xl border border-white/[0.2] bg-black p-6 transition-all duration-300 hover:border-white/[0.3]"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      viewport={{ once: true }}
    >
      <div className="flex items-center justify-between">
        <div className="text-neutral-400">
          {icon}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-neutral-200">
            {count.toLocaleString()}
          </span>
          <span className="text-xl font-semibold text-neutral-400">+</span>
        </div>
        <div className="mt-2">
          <p className="font-sans font-bold text-neutral-200">{title}</p>
          <p className="font-sans text-xs text-neutral-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
