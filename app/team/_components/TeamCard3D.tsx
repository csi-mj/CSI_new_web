'use client';

import React, { useCallback, useState } from 'react';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import AnimatedButton from '@/components/ui/animatedButton';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  specialties: string[];
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface TeamCard3DProps {
  member: TeamMember;
  isActive: boolean;
  className?: string;
  isMobile?: boolean;
  onImageClick?: (member: TeamMember) => void;
}

// 3D Team Card Component
const TeamCard3D: React.FC<TeamCard3DProps> = React.memo(({ 
  member, 
  isActive, 
  className, 
  isMobile, 
  onImageClick 
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [imageOk, setImageOk] = React.useState<boolean>(Boolean(member?.image));

  // Handle image load state with animation trigger - memoized 

  const handleCardClick = useCallback(() => {
    onImageClick?.(member);
  }, [onImageClick, member]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onImageClick?.(member);
  }, [onImageClick, member]);
  
  return (
    <motion.div 
      className="w-full h-full max-w-full" 
      onClick={handleCardClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <CardContainer className="w-full h-full max-w-full" containerClassName="py-0">
        <CardBody className="w-full h-full max-w-full">
          <CardItem className="w-full h-full max-w-full cursor-target">
            <div className="relative group w-full h-full max-w-full cursor-pointer">
              <div className="relative rounded-xl md:rounded-2xl h-full max-w-full">
                <motion.div 
                  className="relative w-[85%] h-[85%] max-w-full mx-auto mt-2 overflow-hidden rounded-xl md:rounded-2xl border border-white/10 shadow-2xl"
                  whileHover={{ 
                    scale: 1.02,
                    rotateX: 5,
                    rotateY: 5,
                    transition: { duration: 0.4 }
                  }}
                  initial={false}
                  animate={{
                    rotateX: isAnimating ? [0, -5, 5, 0] : 0,
                    rotateY: isAnimating ? [0, 5, -5, 0] : 0,
                    scale: isAnimating ? [0.95, 1.05, 0.98, 1] : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    scale: { duration: 1.2 },
                    rotateX: isAnimating ? { duration: 0.8 } : { duration: 0.4 },
                    rotateY: isAnimating ? { duration: 0.8 } : { duration: 0.4 },
                  }}
                >
                  <div className="relative w-full h-full overflow-hidden">
                    <motion.div 
                      className="relative w-full h-full"
                      initial={false}
                      animate={{
                        scale: isAnimating ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0 z-10"
                        initial={false}
                        animate={{
                          opacity: isAnimating ? [0, 0.8, 0] : 0,
                          background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                        }}
                        transition={{
                          duration: 1.5,
                          ease: 'easeOut'
                        }}
                      />
                      <motion.div
                        className="relative w-full h-full"
                        key={member.image}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                          scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                        }}
                      >
                        {imageOk && member.image ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            width={450}
                            height={470}
                            className="object-cover object-top w-[260px] h-[320px] sm:w-[320px] sm:h-[420px] md:w-[450px] md:h-[470px] mx-auto block"
                            onError={() => setImageOk(false)}
                          />
                        ) : (
                          <div className="relative object-cover w-[260px] h-[320px] sm:w-[320px] sm:h-[420px] md:w-[450px] md:h-[470px] mx-auto">
                            <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-black via-neutral-800 to-black backdrop-blur-md border border-white/10" />
                            <div className="absolute pr-8 md:pr-14 lg:pr-16 inset-0 flex items-center justify-center">
                              <div className="flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white/10 border border-white/20 text-white text-2xl sm:text-3xl md:text-4xl font-semibold ">
                                {(member.name || '')
                                  .trim()
                                  .split(/\s+/)
                                  .filter(Boolean)
                                  .slice(0,3)
                                  .map((s) => s[0]?.toUpperCase())
                                  .join('') || 'NA'}
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>

                      {isAnimating && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%', opacity: 0 }}
                          animate={{ x: '100%', opacity: 0.4 }}
                          transition={{
                            duration: 1.2,
                            ease: 'easeInOut',
                            repeat: 1,
                            repeatType: 'reverse'
                          }}
                        />
                      )}
                    </motion.div>
                  </div>
                  {/* Enhanced overlay with better pattern */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/90"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 0.4 }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                    initial={{ opacity: 1 }}
                    whileHover={{ opacity: 0.7 }}
                    transition={{ duration: 0.6 }}
                  />
                  {/* Subtle border highlight */}
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-white/10" />
                </motion.div>
                
                {isActive && (
                  <motion.div 
                    className="absolute px-8 md:px-12 inset-0 p-6 flex flex-col justify-end pointer-events-none"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="text-white text-xl break-words w-[70%] font-medium">{member.name}</h3>
                      <p className="text-white/80 text-md break-words w-[70%] font-medium">{member.title}</p>
                    </motion.div>
                    
                    <motion.button
                      className="absolute scale-75 right-8 bottom-2 rounded-full flex items-center justify-center transition-all duration-500 pointer-events-auto"
                      onClick={handleButtonClick}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                        rotate: { duration: 0.6 }
                      }}
                      whileHover={{ 
                        scale: 1,
                        rotate: 90,
                        backgroundColor: 'rgba(255, 255, 255, 0.25)'
                      }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatedButton
                  direction="right"
                  // onClick={onNextMember}
                />
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </div>
          </CardItem>
        </CardBody>
      </CardContainer>
    </motion.div>
  );
});

TeamCard3D.displayName = 'TeamCard3D';

export default TeamCard3D;