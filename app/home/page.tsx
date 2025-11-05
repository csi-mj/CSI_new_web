'use client';

import React, { Suspense, lazy, useEffect, useState, useRef } from 'react';
import Shuffle from '@/components/Shuffle';
import Cursor from '@/components/ui/cursor';

// Lazy load heavy animation components
const HackrevCta = lazy(() => import('./_components/Hot/HackrevCta'));
const BackgroundBeams = lazy(() => import('@/components/ui/background-beams').then(module => ({ default: module.BackgroundBeams })));
const About = lazy(() => import('./_components/about/About'));
const Bento = lazy(() => import('./_components/about/Bento').then(module => ({ default: module.Bento })));
const Dither = lazy(() => import('@/components/Dither'));
const Faculty = lazy(() => import('./_components/Mem/Faculty'));
const MarqueeScroll = lazy(() => import('./_components/Mem/MarqueeScroll').then(module => ({ default: module.MarqueeScroll })));
const Title = lazy(() => import('./_components/connect/Title'));
const Galaxy = lazy(() => import('@/components/Galaxy'));
const Orbit = lazy(() => import('./_components/connect/Orbit'));

// Loading fallback component
const LoadingFallback = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
    CSI
  </div>
);

export default function HomePage() {
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [showDither, setShowDither] = useState(false);
  const ditherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setShowBackgrounds(true), 250);
    const t2 = setTimeout(() => setShowGalaxy(true), 400);
    // Observe Dither section; mount only when entering viewport
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e && e.isIntersecting) {
          setShowDither(true);
          io.disconnect();
        }
      },
      {
        // Preload slightly before the section enters the viewport
        root: null,
        rootMargin: '1000px 0px',
        threshold: 0,
      }
    );
    if (ditherRef.current) io.observe(ditherRef.current);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      io.disconnect();
    };
  }, []);
  return (
    <div className="pt-24">
      <section className="">
        <Suspense fallback={<LoadingFallback className="min-h-[100px]" />}>
          <HackrevCta />
        </Suspense>
      </section>

      <section className="relative mb-24">
        <div className="absolute h-[600px] inset-0 z-0 pointer-events-none">
          {showBackgrounds && (
            <Suspense fallback={null}>
              <BackgroundBeams />
            </Suspense>
          )}
        </div>
        <div className="flex w-full flex-col items-center">
          <Suspense fallback={<LoadingFallback />}>
            <About />
          </Suspense>
          <Suspense fallback={<LoadingFallback />}>
            <Bento />
          </Suspense>
        </div>
      </section>

      <section className="relative mb-24">
        <div ref={ditherRef} className="absolute inset-0 z-0 min-h-screen">
          {showDither && (
            <Suspense fallback={null}>
              <Dither
                waveColor={[0.22, 0.22, 0.28]}
                disableAnimation={!showDither}
                waveAmplitude={0.22}
                waveFrequency={2.9}
                waveSpeed={0.18}
              />
            </Suspense>
          )}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.65),transparent_60%),linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.55))]" />
        </div>
        <div className="relative z-20 text-neutral-100">
          <div className="relative z-10 w-full flex flex-col items-center">
            <Suspense fallback={<LoadingFallback />}>
              <Faculty />
            </Suspense>
            <Shuffle 
              text="GOVERNING BODY" 
              tag="h1"
              className="!text-3xl mt-20 mb-8 md:!text-6xl !text-primary !normal-case !font-bold"
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
            <Suspense fallback={<LoadingFallback />}>
              <MarqueeScroll />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="relative z-20 pointer-events-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Title />
          </Suspense>
        </div>

        <div className="absolute inset-0 z-0 pointer-events-auto">
          {showGalaxy && (
            <Suspense fallback={null}>
              <Galaxy
                density={1.2}
                glowIntensity={0.09}
                hueShift={240}
                twinkleIntensity={0.3}
              />
            </Suspense>
          )}
        </div>

        <div className="relative z-10 pointer-events-none">
          <Suspense fallback={null}>
            <Orbit />
          </Suspense>
        </div>
      </section>

      <Cursor />
    </div>
  );
}
