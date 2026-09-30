'use client';

import React from 'react';

// Enough repeats per copy to be wider than any screen, so the -50% loop never shows a gap
const REPEATS = 4;

const Star = () => (
  <svg aria-hidden viewBox="0 0 24 24" className="mx-5 size-5 shrink-0 fill-black md:mx-8 md:size-8">
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
  </svg>
);

const Phrase = () => (
  <span className="flex shrink-0 items-center whitespace-nowrap text-black">
    <span className="font-inter font-black uppercase tracking-[-0.04em]">Computer</span>
    <span className="ml-[0.3em] font-inter font-black uppercase tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_black] md:[-webkit-text-stroke:2px_black]">
      Society
    </span>
    <span className="mx-[0.25em] font-instrument-serif font-normal lowercase italic">of</span>
    <span className="font-inter font-black uppercase tracking-[-0.04em]">India</span>
    <Star />
  </span>
);

const CsiMarquee = () => (
  <section className="relative overflow-hidden py-10 md:py-14" aria-label="Computer Society of India">
    <div className="-mx-[5vw] -rotate-2 border-y-2 border-black bg-primary py-3 md:py-5">
      <div
        aria-hidden
        className="flex w-max animate-[polaroid-roll_45s_linear_infinite] text-[clamp(2rem,6vw,5.5rem)] leading-none motion-reduce:animate-none"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {Array.from({ length: REPEATS }, (_, i) => (
              <Phrase key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default React.memo(CsiMarquee);
