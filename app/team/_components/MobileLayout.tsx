'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TeamCard3D from './TeamCard3D';
import AnimatedButton from '@/components/ui/animatedButton';
import { TeamMember } from './TeamCard3D';

interface MobileLayoutProps {
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

const MobileLayout: React.FC<MobileLayoutProps> = ({
  teamMembers,
  currentIndex,
  maxVisibleCards,
  positions,
  onPrevMember,
  onNextMember,
  onImageClick
}) => {
  return (
    <div className="md:hidden h-[calc(100vh)] flex flex-col gap-12 px-4 pt-28">
      {/* Mobile Header */}
      <motion.div
        className="text-center space-y-0 mb-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.h1
          className="text-5xl font-serif leading-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div>
            <span className="text-white font-medium">MEET</span>
          </div>
          <div>
            <span className="text-gray-400 italic font-light">OUR</span>
          </div>
          <div>
            <span className="text-gray-400 italic font-light">TECH</span>
          </div>
          <div>
            <span className="text-white font-medium">HEADS</span>
          </div>
        </motion.h1>
      </motion.div>

      {/* Mobile Images */}
      <motion.div
        className="flex justify-center items-center py-0 h-[350px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="relative w-full max-w-[350px] h-[420px] mx-auto">
          {teamMembers.map((member, index) => {
            const offset = (index - currentIndex + teamMembers.length) % teamMembers.length;
            const isVisible = offset < maxVisibleCards;

            if (!isVisible) return null;

            const isActive = offset === 0;
            const zIndex = teamMembers.length - offset;
            const pos = positions[offset] || positions[positions.length - 1];
            
            // Adjust x position to center the cards
            const adjustedX = pos.x - 0;

            return (
              <motion.div
                key={member.id}
                className="absolute"
                style={{ zIndex }}
                animate={{
                  x: adjustedX,
                  y: pos.y,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  filter: `blur(${pos.blur}px)`,
                  rotate: pos.rotation,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.34, 1.56, 0.64, 1],
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
      <div className="flex items-center justify-center gap-6 mt-1 mb-2">
        <AnimatedButton
          direction="left"
          onClick={onPrevMember}
        />

        <AnimatedButton
          direction="right"
          onClick={onNextMember}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
