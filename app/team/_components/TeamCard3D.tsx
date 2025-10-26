'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import AnimatedButton from '@/components/ui/animatedButton';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  specialties: string[];
}

interface TeamCard3DProps {
  member: TeamMember;
  isActive: boolean;
  className?: string;
  isMobile?: boolean;
  onImageClick?: (member: TeamMember) => void;
}

// 3D Team Card Component
const TeamCard3D: React.FC<TeamCard3DProps> = ({ 
  member, 
  isActive, 
  className, 
  isMobile, 
  onImageClick 
}) => {
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const prevImageRef = React.useRef<string>(member.image);
  
  // Handle image load state with animation trigger
  const handleImageLoad = () => {
    setIsImageLoaded(true);
    console.log('Image loaded successfully:', member.image);
    
    // Trigger animation when image changes
    if (prevImageRef.current !== member.image) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    prevImageRef.current = member.image;
  };

  // Log image URL for debugging
  console.log('Loading image:', member.image);
  
  return (
    <motion.div 
      className="w-full h-full max-w-full" 
      onClick={() => onImageClick?.(member)}
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
                      className="relative w-full h-full bg-gray-800"
                      initial={false}
                      animate={{
                        scale: isAnimating ? [1, 1.05, 1] : 1,
                        filter: isAnimating ? [
                          'brightness(1) contrast(1)',
                          'brightness(1.3) contrast(1.1)',
                          'brightness(1) contrast(1)'
                        ] : 'brightness(1) contrast(1)'
                      }}
                      transition={{
                        duration: 1.2,
                        ease: [0.22, 1, 0.36, 1],
                        filter: { duration: 1.5 }
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
                        className="w-full h-full"
                        key={member.image}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          filter: isAnimating ? [
                            'brightness(1) contrast(1)',
                            'brightness(1.1) contrast(1.1)'
                          ] : 'brightness(1) contrast(1)'
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{
                          opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                          scale: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                          filter: { duration: 1.2 }
                        }}
                      >
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={400}
                          height={500}
                          className="object-cover w-full h-full"
                          priority={isActive}
                          unoptimized={true}
                          onLoad={handleImageLoad}
                          onError={(e) => console.error('Image failed to load:', e)}
                        />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 bg-black/20"
                        initial={{ opacity: 0.4 }}
                        whileHover={{ opacity: 0.1 }}
                        transition={{ duration: 0.6 }}
                      />
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
                  <div className="absolute inset-0 rounded-xl md:rounded-2xl border border-white/5" />
                </motion.div>
                
                {isActive && (
                  <motion.div 
                    className="absolute px-12 inset-0 p-6 flex flex-col justify-end pointer-events-none"
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
                      <h3 className="text-white text-xl font-silkscreen break-words w-[70%] font-medium">{member.name}</h3>
                    </motion.div>
                    
                    <motion.button
                      className="absolute scale-75 right-10 bottom-2 rounded-full flex items-center justify-center transition-all duration-500 pointer-events-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        onImageClick?.(member);
                      }}
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
};

export default TeamCard3D;