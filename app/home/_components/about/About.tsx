'use client';
import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import Shuffle from '@/components/Shuffle';
import { Users, Calendar, TrendingUp, Plus } from 'lucide-react';


// import FollowCursorHideCursor from "../ui/simpleCursor";

const About = React.memo(() => {
  const aboutText = useMemo(() => `
The Computer Society of India – MJCET (CSI MJCET) is the college's oldest student chapter, fostering a legacy of technical excellence. It's a vibrant community that hosts numerous workshops, hackathons, and projects to build students' programming, leadership, and collaborative skills, connecting them with industry certifications and national events.`, []);
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
            viewport={{  margin: "-100px" }}
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
            className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
            initial={{ opacity: 1, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            viewport={{  margin: "-10px" }}
          >
            <StatsCard
              title="Members"
              value={200}
              description="Active Members"
              iconType="users"
              delay={0}
            />
            <StatsCard
              title="Events"
              value={130}
              description="Successfully Organized in 11 Years of CSI"
              iconType="calendar"
              delay={0.1}
            />
            <StatsCard
              title="Reach"
              value={400000}
              description="Social Media Impact"
              iconType="trending"
              delay={0.2}
            />
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
  iconType,
  delay = 0
}: {
  title: string;
  value: number;
  description: string;
  iconType: 'users' | 'calendar' | 'trending';
  delay?: number;
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  // Icon configuration with colors - memoized
  const iconConfig = useMemo(() => ({
    users: {
      icon: <Users className="w-10 h-10" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/40',
      shadowColor: 'shadow-blue-500/20',
      accentColor: 'bg-blue-500'
    },
    calendar: {
      icon: <Calendar className="w-10 h-10" />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/40',
      shadowColor: 'shadow-purple-500/20',
      accentColor: 'bg-purple-500'
    },
    trending: {
      icon: <TrendingUp className="w-10 h-10" />,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/40',
      shadowColor: 'shadow-emerald-500/20',
      accentColor: 'bg-emerald-500'
    }
  }), []);

  const config = iconConfig[iconType];

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
      className="group cursor-target relative flex flex-col space-y-6 rounded-2xl border border-white/[0.15] bg-black/50 backdrop-blur-sm p-6 md:p-8 transition-all duration-300 hover:border-white/[0.25] hover:shadow-xl"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      
    >
      {/* Icon Section - Circular with colorful background */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: delay + 0.2, ease: "easeOut" }}
      >
        <div className={`relative w-20 h-20 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center ${config.shadowColor} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <div className={config.color}>
            {config.icon}
          </div>
          {/* Decorative ring */}
          <div className={`absolute inset-0 rounded-full border-2 ${config.borderColor} opacity-30 animate-ping`} style={{ animationDuration: '3s' }} />
        </div>
        {/* Corner accent */}
        <div className={`absolute -top-2 -right-2 w-6 h-6 ${config.accentColor} rounded-full opacity-60 blur-sm`} />
      </motion.div>
      
      {/* Content Section */}
      <div className="space-y-3 flex-1 flex flex-col justify-between">
        {/* Value */}
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <motion.span 
              className={`text-3xl md:text-4xl font-bold tracking-tight ${config.color} cursor-target`}
              id='cursor-big'
              initial={{ opacity: 0, y: 10 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.5, delay: delay + 0.3 }}
            >
              {count.toLocaleString()}
            </motion.span>
            <motion.div
              className="flex items-center mt-1 justify-center"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.5 }}
            >
              <Plus className={`${config.color}`} size={24} strokeWidth={3} />
            </motion.div>
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-2 pt-2 border-t border-white/[0.1]">
          <motion.p 
            className="font-bold text-lg md:text-xl text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: delay + 0.4 }}
          >
            {title}
          </motion.p>
          <motion.p 
            className="font-sans text-sm md:text-base text-white/60"
            initial={{ opacity: 0, y: 10 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, delay: delay + 0.5 }}
          >
            {description}
          </motion.p>
        </div>
      </div>

      
    </motion.div>
  );
});

StatsCard.displayName = 'StatsCard';

export default About;
