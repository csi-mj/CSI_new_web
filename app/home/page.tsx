import React from 'react';
import About from './_components/about/About';
import { Bento } from './_components/about/Bento';
import { BackgroundBeams } from '@/components/ui/background-beams';
import Orbit from './_components/connect/Orbit';
import Galaxy from '@/components/Galaxy';
import Title from './_components/connect/Title';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { BackgroundLines } from '@/components/ui/background-lines';
import { Meteors } from '@/components/ui/meteors';
import { MarqueeScroll } from './_components/Mem/MarqueeScroll';
import Faculty from './_components/Mem/Faculty';
import Dither from '@/components/Dither';

export default function HomePage() {
  return (
    <div className="pt-24">
      {/* Global background meteors */}


      {/* <SmoothCursor /> */}
      <section className="mb-24">

        <div className="flex w-full flex-col items-center">

          <About />
          <Bento />
        </div>
        <BackgroundBeams />
      </section>


      <section className="relative mb-24">
        <div className="absolute inset-0 z-0 ">
          <Dither
            waveColor={[0.22, 0.22, 0.28]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.35}
            colorNum={5}
            waveAmplitude={0.22}
            waveFrequency={2.9}
            waveSpeed={0.18}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.65),transparent_60%),linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.55))]" />
        </div>
        <div className="relative z-20 text-neutral-100">
          <div className="relative z-10">
            <Faculty />
            <MarqueeScroll />
          </div>
        </div>

      </section>
      <section className="relative mb-24">
        <Title />

        <div className="absolute inset-0 z-0">
          <Galaxy
            density={.9}
            glowIntensity={.06}
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
