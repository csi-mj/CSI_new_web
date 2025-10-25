'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TeamCard3D from './TeamCard3D';
import AnimatedButton from '@/components/ui/animatedButton';
import { TeamMember } from './TeamCard3D';

interface DesktopLayoutProps {
  teamMembers: TeamMember[];
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
  currentIndex,
  maxVisibleCards,
  positions,
  onPrevMember,
  onNextMember,
  onImageClick
}) => {
  return (
    <div className="hidden md:flex w-screen justify-center items-center">
      <div className="container px-16 h-screen flex items-center pt-24">
        <div className="grid grid-cols-12 gap-8 lg:gap-28 items-center w-full">
          {/* Left Section - Text Content */}
          <motion.div
            className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8 px-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <motion.h1
              className="text-4xl lg:text-6xl font-serif leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="text-white font-normal cursor-target">MEET</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="text-gray-400 italic font-light cursor-target">OUR</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="text-gray-400 italic font-light cursor-target">TECH</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className=" text-white font-normal cursor-target">Heads</span>
              </motion.div>
            </motion.h1>

            {/* Navigation Controls */}
            <motion.div
              className="flex items-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className='cursor-target'>
                <AnimatedButton
                  direction="left"
                  onClick={onPrevMember}
                />
              </div>

              <div className='cursor-target'>
                <AnimatedButton
                  direction="right"
                  onClick={onNextMember}
                />
              </div>

            </motion.div>
          </motion.div>

          {/* Center Section - Stacked Images */}
          <motion.div
            className="col-span-8 lg:col-span-8 flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
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
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      scale: pos.scale,
                      opacity: pos.opacity,
                      filter: `blur(${pos.blur}px)`,
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    whileHover={offset === 0 ? {
                      scale: 1.03,
                      y: -5,
                      transition: { duration: 0.3 }
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
