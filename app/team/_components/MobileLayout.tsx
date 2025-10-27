'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TeamCard3D from './TeamCard3D';
import AnimatedButton from '@/components/ui/animatedButton';
import { TeamMember } from './TeamCard3D';
import Shuffle from '@/components/Shuffle';

interface MobileLayoutProps {
  teamMembers: TeamMember[];
  teamName: string;
  currentIndex: number;
  maxVisibleCards: number;
  positions: Array<{
    x: number;
    y: number;
    scale: number;
    opacity: number;
    blur: number;
    rotation: number;
  }>;
  onPrevMember: () => void;
  onNextMember: () => void;
  onImageClick: (member: TeamMember) => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  teamMembers,
  teamName,
  currentIndex,
  maxVisibleCards,
  positions,
  onPrevMember,
  onNextMember,
  onImageClick
}) => {
  return (
    <div className="md:hidden min-h-screen w-full max-w-[100vw] flex flex-col gap-8 px-4 pt-24 pb-8 overflow-hidden">
      {/* Mobile Header */}
      <motion.div
        className="text-center space-y-0 mb-1"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 1.2, 
          delay: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl font-silkscreen leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40, rotateX: -90 }}
            animate={{ opacity: 1, x: 0, rotateX: 0 }}
            transition={{ 
              duration: 1.0, 
              delay: 0.6,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <span className="text-white font-medium inline-block">MEET</span>
            <span className="text-gray-400 italic font-light inline-block">OUR</span>

          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, x: -40, rotateX: -90 }}
            animate={{ opacity: 1, x: 0, rotateX: 0 }}
            transition={{ 
              duration: 1.0, 
              delay: 0.75,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
          </motion.div> */}
          {/* <motion.div
            initial={{ opacity: 0, x: -40, rotateX: -90 }}
            animate={{ opacity: 1, x: 0, rotateX: 0 }}
            transition={{ 
              duration: 1.0, 
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <span className="text-gray-400 italic font-light inline-block"></span>
          </motion.div> */}
          <motion.div
            initial={{ opacity: 0, x: -40, rotateX: -90 }}
            animate={{ opacity: 1, x: 0, rotateX: 0 }}
            transition={{ 
              duration: 1.0, 
              delay: 1.05,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <span className="text-red-500 font-medium inline-block">{teamName} </span>
            <span className="text-white pl-2 font-medium inline-block"> HEADS</span>
            
              {/* <Shuffle
                  text="TECH HEADS"
                  shuffleDirection="right"
                  duration={0.5}
                  animationMode="evenodd"
                  shuffleTimes={1}
                  ease="power3.out"
                  stagger={0.1}
                  threshold={0.1}
                  triggerOnce={true}
                  triggerOnHover={true}
                  respectReducedMotion={true}
                  loop={true}
                  loopDelay={1}
                  colorTo="#5227fe"
                  colorFrom=""
                  className="font-silkscreen cursor-target text-2xl sm:text-3xl lg:text-6xl text-red-500 tracking-tight"
                /> */}
          </motion.div>
        </motion.h1>
      </motion.div>

      {/* Mobile Images */}
      <motion.div
        className="flex justify-center items-center w-full max-w-full overflow-visible"
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          duration: 1.4, 
          delay: 0.8,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[320px] sm:h-[420px] mx-auto">
          {teamMembers.map((member, index) => {
            const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;
            const isVisible = offset < maxVisibleCards;

            if (!isVisible) return null;

            const isActive = offset === 0;
            const zIndex = teamMembers.length - offset;
            const pos = positions[offset] || positions[positions.length - 1];
            
            // Adjust x position to keep cards within viewport
            const adjustedX = pos.x * 0.8; // Scale down horizontal offset

            return (
              <motion.div
                key={member.id}
                className="absolute w-full"
                style={{ zIndex }}
                initial={offset === 0 ? { 
                  opacity: 0, 
                  scale: 0.5, 
                  y: 80,
                  rotate: 15
                } : undefined}
                animate={{
                  x: adjustedX,
                  y: pos.y,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  filter: `blur(${pos.blur}px)`,
                  rotate: pos.rotation,
                }}
                transition={{
                  duration: 1.0,
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.7 },
                  scale: { duration: 1.0 },
                  y: { duration: 1.0 },
                  rotate: { duration: 1.2 }
                }}
              >
                <TeamCard3D
                  member={member}
                  isActive={isActive}
                  isMobile={true}
                  className="w-full h-full"
                  onImageClick={onImageClick}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Navigation Controls - Mobile */}
      <motion.div 
        className="flex items-center justify-center gap-6 mt-1 mb-2"
        initial={{ opacity: 0, y: 30, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 1.0, 
          delay: 1.3,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatedButton
            direction="left"
            onClick={onPrevMember}
          />
        </motion.div>

        <motion.div
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatedButton
            direction="right"
            onClick={onNextMember}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MobileLayout;