'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TeamMember } from './TeamCard3D';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';
import ExpandedView from '@/components/ui/ExpandedView';



export type { TeamMember };

export interface CarouselProps {
  teamMembers: TeamMember[];
  teamName: string;
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  teamMembers,
  teamName,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMember, setExpandedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const handleImageClick = (member: TeamMember) => {
    setExpandedMember(member);
  };

  const closeExpanded = () => {
    setExpandedMember(null);
  };

  const currentMember = teamMembers[currentIndex];

  // Mobile positioning (only 2 cards visible)
  const mobilePositions = [
    { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, rotation: 0 },
    { x: 36, y: -4, scale: 0.9, opacity: 0.75, blur: 0.5, rotation: 1 },
  ];

  // Desktop positioning (4 cards visible)
  const desktopPositions = [
    { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, rotation: 0 },
    { x: 120, y: -8, scale: 0.93, opacity: 0.88, blur: 0.5, rotation: 2 },
    { x: 200, y: -12, scale: 0.88, opacity: 0.72, blur: 1, rotation: 3 },
    { x: 260, y: -16, scale: 0.82, opacity: 0.55, blur: 1.5, rotation: 4 },
  ];

  const positions = isMobile ? mobilePositions : desktopPositions;
  const maxVisibleCards = isMobile ? 2 : 4;

  return (
    <div className="relative w-full max-w-[100vw] overflow-hidden">
      <motion.div
        className={` w-full max-w-[100vw] text-white overflow-hidden ${className || ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {/* Mobile Layout */}
        <MobileLayout
          teamMembers={teamMembers}
          teamName={teamName}
          currentIndex={currentIndex}
          maxVisibleCards={maxVisibleCards}
          positions={positions}
          onPrevMember={prevMember}
          onNextMember={nextMember}
          onImageClick={handleImageClick}
        />

        {/* Desktop Layout */}
        <DesktopLayout
          teamMembers={teamMembers}
          teamName={teamName}
          currentIndex={currentIndex}
          maxVisibleCards={maxVisibleCards}
          positions={positions}
          onPrevMember={prevMember}
          onNextMember={nextMember}
          onImageClick={handleImageClick}
        />
      </motion.div>
      
      <AnimatePresence mode="wait">
        {expandedMember && (
          <ExpandedView 
            key="expanded-view"
            expandedMember={expandedMember} 
            onClose={closeExpanded} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Carousel;