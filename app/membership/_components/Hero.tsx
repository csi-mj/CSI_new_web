'use client';
import { BackgroundLines } from '@/components/ui/background-lines';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import logo from '../../../public/assets/logos/csi_logo.png';
import { MorphingText } from '@/components/ui/morphing-text';
import { TypingAnimation } from '@/components/ui/typing-animation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';

const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(['.hero-logo', '.hero-title', '.hero-greeting', '.hero-btn'], {
        opacity: 0,
        y: 20
      });

      gsap.to('.hero-logo', {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
      });

      gsap.to('.hero-title', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 1,
        ease: 'power2.out'
      });

      gsap.to('.hero-greeting', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 1.5,
        ease: 'power2.out'
      });

      gsap.to('.hero-btn', {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 3.2,
        stagger: 0.1,
        ease: 'back.out(1.7)'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-8"
      aria-label="Hero section"
    >
      <BackgroundLines className="flex w-full flex-col items-center justify-center gap-3 px-2">
        <ShootingStars />
        <StarsBackground />
        <div className="hero-logo mb-5">
          <Image
            src={logo}
            alt="Computer Society of India MJCET Logo"
            width={224}
            height={224}
            priority
            className="w-32 object-contain drop-shadow-2xl transition-all duration-700 hover:scale-105 sm:w-40 md:w-48 lg:w-56"
          />
        </div>

        <div className="mx-auto w-full px-1">
          <div className="hero-title flex w-full items-center justify-center">
            <MorphingText
              texts={['CSI MJCET', 'COMPUTER SOCIETY OF INDIA']}
              className="font-silkscreen w-full text-center text-3xl leading-tight sm:text-3xl md:text-4xl lg:text-5xl"
            />
          </div>

          <div className="hero-greeting mt-2 flex min-h-[2.5rem] w-full items-center justify-center sm:mt-3">
            <TypingAnimation
              delay={1500}
              className="font-silkscreen w-full bg-gradient-to-r from-red-500 via-red-500 to-red-600 bg-clip-text px-2 text-center text-lg font-extrabold text-transparent sm:text-xl md:text-2xl"
            >
              eidjof . fhdads . hkjijf
            </TypingAnimation>
          </div>
        </div>

        <div className="hero-btn flex w-full max-w-2xl flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
          <Link
            href="https://forms.gle/ePeDHzKgrb9MUGTx6"
            target="_blank"
            rel="noopener noreferrer"
            className="group font-silkscreen relative flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-500 hover:scale-105 hover:from-blue-700 hover:to-blue-800 sm:w-48"
            aria-label="Join CSI MJCET"
          >
            <span className="relative z-10 flex items-center gap-2">
              Join Us Now
            </span>
          </Link>

          <button
            onClick={scrollToAbout}
            className="group font-silkscreen relative flex h-11 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-red-500 bg-transparent px-6 py-3 text-sm font-bold text-red-500 backdrop-blur-[1px] transition-all duration-500 hover:scale-105 hover:bg-red-500 hover:text-black sm:w-48"
            aria-label="Learn more about CSI MJCET"
          >
            <span className="relative z-10 flex items-center gap-2">
              Know More
            </span>
          </button>
        </div>
      </BackgroundLines>
    </section>
  );
};

export default Hero;
