"use client"

import React, { forwardRef, useRef } from "react"

import { cn } from "@/lib/utils"
import { AnimatedBeam } from "../ui/animated-beam";
import { FaGithub } from "react-icons/fa";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      id="cursor"
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border border-white/20 p-0.5 cursor-target overflow-hidden bg-white/30",
        className
      )}
    >
      {children}
    </div>
  )
})

Circle.displayName = "Circle"

export function Developer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const div1Ref = useRef<HTMLDivElement>(null)
  const div2Ref = useRef<HTMLDivElement>(null)
  const div3Ref = useRef<HTMLDivElement>(null)
  const div4Ref = useRef<HTMLDivElement>(null)
  const div5Ref = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden px-16 pt-16"
      ref={containerRef}
    >
      <div className="flex w-full max-w-md flex-col items-stretch justify-center gap-1">
        <div className="flex flex-row items-center justify-between">
          <div className="tt-wrap relative inline-flex items-center justify-center">
            <span className="tt">Md Feroz Ahmed</span>
            <Circle ref={div1Ref} className="w-16 h-16">
              <a href="https://github.com/phero20" id="cursor-big" aria-label="Md Feroz Ahmed" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block h-full w-full rounded-full overflow-hidden">
                <img src="https://avatars.githubusercontent.com/phero20?s=96" alt="phero20" className="h-full w-full object-cover" />
              </a>
            </Circle>
          </div>
          <div className="tt-wrap relative inline-flex items-center justify-center">
            <span className="tt">Iqra Fatima</span>
            <Circle ref={div5Ref}>
              <a href="https://github.com/iqrfatima"  aria-label="Iqra Fatima" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block h-full w-full rounded-full overflow-hidden">
                <img src="https://avatars.githubusercontent.com/iqrfatima?s=96" alt="iqrfatima" className="h-full w-full object-cover" />
              </a>
            </Circle>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="tt-wrap relative inline-flex items-center justify-center">
            <span className="tt">GitHub</span>
            <Circle ref={div4Ref} className="size-12 overflow-hidden bg-white">
              <FaGithub size={32} color="#000000" aria-hidden="true" />
            </Circle>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="tt-wrap relative inline-flex items-center justify-center">
            <span className="tt">Mohammed Osman</span>
            <Circle ref={div3Ref}>
              <a href="https://github.com/thecodinganvil" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block h-full w-full rounded-full overflow-hidden">
                <img src="https://avatars.githubusercontent.com/thecodinganvil?s=96" alt="thecodinganvil" className="h-full w-full object-cover" />
              </a>
            </Circle>
          </div>
          <div className="tt-wrap relative inline-flex items-center justify-center">
            <span className="tt">Daaniyah Khan</span>
            <Circle ref={div7Ref}>
              <a href="https://github.com/daaniyahjkhan" target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="block h-full w-full rounded-full overflow-hidden">
                <img src="https://avatars.githubusercontent.com/daaniyahjkhan?s=96" alt="daaniyahjkhan" className="h-full w-full object-cover" />
              </a>
            </Circle>
          </div>
        </div>
       <style jsx>{`
  .tt-wrap { 
    position: relative; 
  }
  
  .tt {
    position: absolute;
    top: -36px;
    left: 50%;
    /* Start slightly lower */
    transform: translate(-50%, -4px); 
    
    /* New design */
    background: rgba(0, 0, 0, 0.7); /* Dark, glassy background */
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle white border */
    color: white;
    font-size: 13px; /* Slightly larger */
    font-weight: 600;
    padding: 6px 12px; /* More padding */
    border-radius: 8px; /* More rounded */
    box-shadow: 0 8px 32px rgba(0,0,0,0.3); /* Softer, deeper shadow */

    /* Animation */
    opacity: 0;
    pointer-events: none;
    transition: opacity .2s ease, transform .2s ease;
    white-space: nowrap;
    z-index: 20;
  }
  
  .tt::before {
    content: '';
    position: absolute;
    width: 10px; /* Made arrow slightly larger */
    height: 10px;
    
    /* Match the new design */
    background: rgba(0, 0, 0, 0.7); 
    backdrop-filter: blur(4px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Match border */
    border-right: 1px solid rgba(255, 255, 255, 0.1); /* Match border */

    /* Position */
    bottom: -6px; /* Adjust position for new size */
    left: 50%;
    transform: translateX(-50%) rotate(45deg);
    box-shadow: none; /* Removed shadow from arrow */
  }
  
  .tt-wrap:hover .tt {
    opacity: 1;
    /* Move up further on hover */
    transform: translate(-50%, -12px); 
  }
`}</style>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      {/* <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      /> */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse
      />
      {/* <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
        reverse
      /> */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        
        reverse
      />
    </div>
  )
}


