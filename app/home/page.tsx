import React from 'react';
import About from './_components/About';
import Cursor from '@/components/ui/cursor';
import { SmoothCursor } from '@/components/ui/smooth-cursor';
import { TracingBeam } from '@/components/ui/tracing-beam';
import { Bento } from './_components/Bento';
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function HomePage() {
  return (
    <div className="py-24">
      {/* <SmoothCursor /> */}
      <TracingBeam className="px-3 pl-0 md:pl-16">
        <div className="flex w-full flex-col items-center">
          <About />
          <Bento />
        </div>

        <BackgroundBeams className="absolute inset-0 opacity-100" />
      </TracingBeam>
    </div>
  );
}
