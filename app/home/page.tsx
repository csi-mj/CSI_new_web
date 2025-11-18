'use client';

import React from 'react';
import Shuffle from '@/components/Shuffle';
import Cursor from '@/components/ui/cursor';

// Component Imports
import Hero from './_components/hero/Hero';
import HackrevCta from './_components/Hot/HackrevCta';
import About from './_components/about/About';
import { Bento } from './_components/about/Bento';
import Faculty from './_components/Mem/Faculty';
import { MarqueeScroll } from './_components/Mem/MarqueeScroll';
import Title from './_components/connect/Title';
import Orbit from './_components/connect/Orbit';
import { motion } from "framer-motion";
import { BackgroundBeams } from '@/components/ui/background-beams';

// import Landing from './_components/hero/Landing'; // Kept commented as in original

export default function HomePage() {
  return (
    <div className="pt-0">
      <section>
        <Hero />
        {/* <Landing /> */}
      </section>

      <section className="">
        <HackrevCta />
      </section>

      <section className="relative mb-24" id="about">
         <div className="absolute h-[600px] inset-0 z-0 pointer-events-none">
              <BackgroundBeams />
        </div>
        <div className="flex w-full flex-col items-center">
                <About />
                <Bento />
        </div>
      </section>

      <section className="relative pb-24" id="faculty">


        <div className="relative z-20 text-neutral-100">
          <div className="relative z-10 w-full flex flex-col items-center pt-12">
            <Faculty />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
            <Shuffle
              text="GOVERNING BODY"
              tag="h1"
              className="!text-3xl mt-24 mb-12 md:!text-6xl !text-primary !normal-case !font-bold"
              style={{ fontFamily: 'var(--font-orbitron)' }}
              loop={false}
              loopDelay={2}
              duration={0.4}
              stagger={0.04}
              shuffleTimes={2}
              animationMode="evenodd"
              triggerOnce={true}
              triggerOnHover={true}
            />
            </motion.div>

            <MarqueeScroll />
          </div>
        </div>
      </section>

      <section className="relative pt-24" id="connect">
        <div className="relative z-20 pointer-events-auto">
          <Title />
        </div>

        <div className="relative z-10 pointer-events-none">
          <Orbit />
        </div>
      </section>

      <div className="max-md:hidden">
        <Cursor />
      </div>
    </div>
  );
}