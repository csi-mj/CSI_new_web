import React from 'react';
import About from './_components/about/About';
import { Bento } from './_components/about/Bento';
import { BackgroundBeams } from '@/components/ui/background-beams';
import Orbit from './_components/connect/Orbit';
import Galaxy from '@/components/Galaxy';
import Title from './_components/connect/Title';

export default function HomePage() {
  return (
    <div className="py-24">
      {/* <SmoothCursor /> */}
      <section>
        <div className="flex w-full flex-col items-center">
          <About />
          <Bento />
        </div>

        <BackgroundBeams className="absolute inset-0 opacity-100" />
      </section>
      
      <section className="relative min-h-screen">
        <Title />
        
        <div className="absolute inset-0 z-0">
          <Galaxy 
            density={.7}
            glowIntensity={.09}
            hueShift={240}
            twinkleIntensity={.1}
          />
        </div>
        <div className="relative z-10 pointer-events-none">
          <Orbit />
        </div>
      </section>
    </div>
  );
}
