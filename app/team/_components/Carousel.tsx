'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember } from './TeamCard3D';
import MobileLayout from './MobileLayout';
import DesktopLayout from './DesktopLayout';
import ExpandedView from './ExpandedView';

interface CarouselProps {
  teamMembers: TeamMember[];
  className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({
  teamMembers,
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
    { x: 45, y: -6, scale: 0.88, opacity: 0.7, blur: 1, rotation: 3 },
  ];

  // Desktop positioning (4 cards visible)
  const desktopPositions = [
    { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, rotation: 0 },
    { x: 100, y: -10, scale: 0.92, opacity: 0.85, blur: 1, rotation: 3 },
    { x: 180, y: -15, scale: 0.85, opacity: 0.65, blur: 2, rotation: 5 },
    { x: 240, y: -20, scale: 0.78, opacity: 0.45, blur: 3, rotation: 7 },
  ];

  const positions = isMobile ? mobilePositions : desktopPositions;
  const maxVisibleCards = isMobile ? 2 : 4;

  return (
    <>
      <motion.div
        className={`min-h-screen bg-black text-white overflow-hidden ${className || ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Mobile Layout */}
        <MobileLayout
          teamMembers={teamMembers}
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
          currentIndex={currentIndex}
          maxVisibleCards={maxVisibleCards}
          positions={positions}
          onPrevMember={prevMember}
          onNextMember={nextMember}
          onImageClick={handleImageClick}
        />
      </motion.div>
      
      {/* Expanded View */}
      <AnimatePresence>
        <ExpandedView 
          expandedMember={expandedMember}
          onClose={closeExpanded}
        />
      </AnimatePresence>
    </>
  );
};

export default Carousel;