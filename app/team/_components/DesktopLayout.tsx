'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamCard3D from './TeamCard3D';
import AnimatedButton from '@/components/ui/animatedButton';
import { TeamMember } from './TeamCard3D';
import Shuffle from '@/components/Shuffle';

interface DesktopLayoutProps {
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

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  teamMembers,
  teamName,
  currentIndex,
  maxVisibleCards,
  positions,
  onPrevMember,
  onNextMember,
  onImageClick
}) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

  return (
    <div className="hidden md:flex w-screen justify-center items-center">
      <div className="container px-16 h-screen flex items-center pt-24">
        <div className="grid grid-cols-12 gap-8 lg:gap-28 items-center w-full">
          {/* Left Section - Text Content */}
          <motion.div
            className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8 px-6"
            initial={!hasAnimated ? { opacity: 0, x: -100 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 1.3,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.3
            }}
          >
            <motion.h1
              className="text-4xl lg:text-[3.3rem] font-silkscreen leading-tight"
              initial={!hasAnimated ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              <motion.div
                initial={!hasAnimated ? { opacity: 0, x: -60, rotateX: -90 } : false}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <span className="text-white font-normal cursor-target  inline-block">MEET</span>
              </motion.div>
              <motion.div
                initial={!hasAnimated ? { opacity: 0, x: -60, rotateX: -90 } : false}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <span className="text-gray-400 italic font-light cursor-target inline-block">OUR</span>
              </motion.div>
              <motion.div
                initial={!hasAnimated ? { opacity: 0, x: -60, rotateX: -90 } : false}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 1.0,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <span className="text-red-500 italic font-light cursor-target inline-block">{teamName}</span>
                {/* <Shuffle
                  text={teamName}
                  
                  className="font-silkscreen cursor-target text-2xl sm:text-3xl lg:text-6xl text-red-500 tracking-tight"
                /> */}
              </motion.div>
              <motion.div
                initial={!hasAnimated ? { opacity: 0, x: -60, rotateX: -90 } : false}
                animate={{ opacity: 1, x: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 1.2,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <span className="text-white font-normal cursor-target inline-block">Heads</span>
              </motion.div>
            </motion.h1>

            {/* Navigation Controls */}
            <motion.div
              className="flex items-center gap-4 pt-4"
              initial={!hasAnimated ? { opacity: 0, y: 40, scale: 0.8 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.0,
                delay: 1,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <motion.div
                className='cursor-target'
                whileHover={{ x: -5 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <AnimatedButton
                  direction="left"
                  onClick={onPrevMember}
                />
              </motion.div>

              <motion.div
                className='cursor-target'
                whileHover={{ x: 5 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <AnimatedButton
                  direction="right"
                  onClick={onNextMember}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Center Section - Stacked Images */}
          <motion.div
            className="col-span-8 lg:col-span-8 flex justify-center items-center"
            initial={!hasAnimated ? { opacity: 0, scale: 0.85, rotateY: -25 } : false}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.9,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div className="relative w-full max-w-4xl mx-auto h-[500px] lg:h-[500px] mt-4">
              {teamMembers.map((member, index) => {
                const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;
                const isVisible = offset < maxVisibleCards;

                if (!isVisible) return null;

                const isActive = offset === 0;
                const zIndex = teamMembers.length - offset;
                const pos = positions[offset] || positions[positions.length - 1];

                return (
                  <motion.div
                    key={member.id}
                    className="absolute"
                    style={{ zIndex }}
                    initial={(offset === 0 && !hasAnimated) ? {
                      opacity: 0,
                      scale: 0.6,
                      y: 100,
                      rotateY: 45
                    } : false}
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      scale: pos.scale,
                      opacity: pos.opacity,
                      filter: `blur(${pos.blur}px)`,
                      rotateY: 0
                    }}
                    transition={{
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      opacity: { duration: 0.8 },
                      scale: { duration: 1.2 },
                      y: { duration: 1.2 },
                      rotateY: { duration: 1.4 }
                    }}
                    whileHover={offset === 0 ? {
                      scale: 1.04,
                      y: -10,
                      rotateY: 2,
                      transition: {
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1]
                      }
                    } : {}}
                  >
                    <TeamCard3D
                      member={member}
                      isActive={isActive}
                      isMobile={false}
                      className="w-full h-full"
                      onImageClick={onImageClick}
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DesktopLayout;