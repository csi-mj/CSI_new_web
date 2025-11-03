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
import Shuffle from '@/components/Shuffle';
import Cursor from '@/components/ui/cursor';
import Hot from './_components/Hot/HackrevCta';
import HackrevCta from './_components/Hot/HackrevCta';

export default function HomePage() {
  return (
    <div className="pt-24">
     <section className="">
       <HackrevCta />
     </section>


      {/* <SmoothCursor /> */}
      <section className="relative mb-24">
         <div className="absolute h-[600px] inset-0 z-0 pointer-events-none">
          <BackgroundBeams />
        </div>
        <div className="flex w-full flex-col items-center">
        {/* <BackgroundBeams /> */}

          <About />
          <Bento />
        </div>
        
      </section>


      <section className="relative mb-24">
        <div className="absolute inset-0 z-0 ">
          {/* <Dither
            waveColor={[0.22, 0.22, 0.28]}
            disableAnimation={false}
            enableMouseInteraction={true}
            mouseRadius={0.35}
            colorNum={5}
            waveAmplitude={0.22}
            waveFrequency={2.9}
            waveSpeed={0.18}
          /> */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.65),transparent_60%),linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.55))]" />
        </div>
        <div className="relative z-20 text-neutral-100">
          <div className="relative z-10 w-full flex flex-col items-center">
            <Faculty />
             <Shuffle 
                text="GOVERNING BODY" 
                tag="h1"
                className="!text-3xl mt-20 mb-8 md:!text-6xl !text-primary !normal-case !font-bold"
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
            <MarqueeScroll />
          </div>
        </div>

      </section>
     <section className="relative mb-24">
  <div className="relative z-20 pointer-events-auto">
    <Title />
  </div>

  <div className="absolute inset-0 z-0 pointer-events-auto">
    <Galaxy
      density={0.9}
      glowIntensity={0.06}
      hueShift={240}
      twinkleIntensity={0.1}
    />
  </div>

  <div className="relative z-10 pointer-events-none">
    <Orbit />
  </div>
</section>
      <Cursor />
    </div>
  );
}
