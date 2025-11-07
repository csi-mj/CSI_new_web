'use client';

import React, { Suspense, lazy, useEffect, useState, useRef } from 'react';
import Shuffle from '@/components/Shuffle';
import Cursor from '@/components/ui/cursor';
import Hero from './_components/hero/Hero';
import Landing from './_components/hero/Landing';

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
    <img src="\logos\csi_logo.png" alt="" />
  </div>
);

export default function HomePage() {
  // Visibility-gated mounts per section
  const hackRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const facultyRef = useRef<HTMLElement>(null);
  const connectRef = useRef<HTMLElement>(null);

  const [showHack, setShowHack] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showBackgrounds, setShowBackgrounds] = useState(false);
  const [showFaculty, setShowFaculty] = useState(false);
  const [showDither, setShowDither] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showGalaxy, setShowGalaxy] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target === hackRef.current) setShowHack(true);
          if (entry.target === aboutRef.current) {
            setShowAbout(true);
            setShowBackgrounds(true);
          }
          if (entry.target === facultyRef.current) {
            setShowFaculty(true);
            setShowDither(true);
          }
          if (entry.target === connectRef.current) {
            setShowConnect(true);
            setShowGalaxy(true);
          }
        });
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );
    if (hackRef.current) io.observe(hackRef.current);
    if (aboutRef.current) io.observe(aboutRef.current);
    if (facultyRef.current) io.observe(facultyRef.current);
    if (connectRef.current) io.observe(connectRef.current);
    return () => io.disconnect();
  }, []);
  return (
    <div className="pt-0">
      <section>
        <Hero />
        {/* <Landing /> */}
      </section>
      <section ref={hackRef} className="">
        {showHack && (
          <Suspense fallback={<LoadingFallback className="min-h-[100px]" />}>
            <HackrevCta />
          </Suspense>
        )}
      </section>

      <section ref={aboutRef} className="relative mb-24" id='about'>
        <div className="absolute h-[600px] inset-0 z-0 pointer-events-none">
          {showBackgrounds && (
            <Suspense fallback={null}>
              <BackgroundBeams />
            </Suspense>
          )}
        </div>
        <div className="flex w-full flex-col items-center">
          {showAbout && (
            <>
              <Suspense fallback={<LoadingFallback />}>
                <About />
              </Suspense>
              <Suspense fallback={<LoadingFallback />}>
                <Bento />
              </Suspense>
            </>
          )}
        </div>
      </section>

      <section ref={facultyRef} className="relative pb-24" id='faculty'>
        <div className="absolute inset-0 z-0 min-h-screen">
          {showFaculty && showDither && (
            <Suspense fallback={null}>
              <Dither
                waveColor={[0.22, 0.22, 0.28]}
                disableAnimation={!showFaculty}
                waveAmplitude={0.22}
                waveFrequency={2.9}
                waveSpeed={0.18}
              />
            </Suspense>
          )}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.65),transparent_60%),linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.55))]" />
        </div>
        <div className="relative z-20 text-neutral-100">
          <div className="relative z-10 w-full flex flex-col items-center pt-12">
            {showFaculty && (
              <Suspense fallback={<LoadingFallback />}>
                <Faculty />
              </Suspense>
            )}
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
            {showFaculty && (
              <Suspense fallback={<LoadingFallback />}>
                <MarqueeScroll />
              </Suspense>
            )}
          </div>
        </div>
      </section>

      <section ref={connectRef} className="relative pt-24" id='connect'>
        <div className="relative z-20 pointer-events-auto">
          
              <Title />
            
        </div>

        <div className="absolute inset-0 z-0 pointer-events-auto">
          {showConnect && showGalaxy && (
            <Suspense fallback={null}>
              <Galaxy
                density={1}
                glowIntensity={0.08}
                hueShift={240}
                twinkleIntensity={0.2}
              />
            </Suspense>
          )}
        </div>

        <div className="relative z-10 pointer-events-none">
          {showConnect && (
            <Suspense fallback={null}>
              <Orbit />
            </Suspense>
          )}
        </div>
      </section>
       <div className='max-md:hidden'>
      <Cursor />

       </div>
    </div>
  );
}
