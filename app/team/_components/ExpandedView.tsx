'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedButton from '@/components/ui/animatedButton';

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  image: string;
  specialties: string[];
}

interface ExpandedViewProps {
  expandedMember: TeamMember | null;
  onClose: () => void;
}

const ExpandedView: React.FC<ExpandedViewProps> = ({ expandedMember, onClose }) => {
  if (!expandedMember) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      onClick={onClose}
    >
      <motion.div
        className="h-full flex flex-col md:flex-row max-w-5xl mx-auto w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 1, y: 20 }}
        transition={{ duration: 0.3, delay: 0 }}
      >
        {/* Image Section - Expands from center to left */}
        <motion.div
          className="w-full md:w-[50%] h-[60vh] md:h-full relative overflow-hidden px-2 md:px-8 py-4 md:py-4"
          initial={{ 
            x: '50%',
            scale: 0.8,
            opacity: 1
          }}
          animate={{ 
            x: 0,
            scale: 1,
            opacity: 1
          }}
          exit={{ 
            x: '-100%',
            scale: 1,
            opacity: 1
          }}
          transition={{ 
            duration: 0.4, 
            // ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src={expandedMember.image}
              alt={expandedMember.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-2xl"
              priority
              unoptimized={process.env.NODE_ENV !== 'production'}
              style={{
                objectPosition: 'center top'
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/30 via-transparent to-transparent" />
        </motion.div>

        {/* Description Section - Slides up from bottom */}
        <motion.div
          className="w-full md:w-1/2 h-1/2 md:h-full p-6 md:p-16 flex flex-col justify-center overflow-y-auto bg-gradient-to-br from-black/50 to-black/80 no-scrollbar"
          initial={{ 
            y: '100%',
            opacity: 0
          }}
          animate={{ 
            y: 0,
            opacity: 1
          }}
          exit={{ 
            y: '100%',
            opacity: 1,
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.3,
            // ease: [0.22, 1, 0.36, 1]
          }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-white mb-3 md:mb-4 tracking-tight no-scrollbar"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className='cursor-target'>{expandedMember.name}</span>
          </motion.h1>

          <motion.h2
            className="text-xl md:text-3xl text-gray-300 mb-6 md:mb-8 font-light no-scrollbar"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className='cursor-target'>{expandedMember.title}</span>
          </motion.h2>

          {/* Close Button */}
          <motion.button
            className="fixed md:scale-75 top-28 hover:rotate-90 cursor-pointer cursor-target right-4 rounded-full flex items-center justify-center transition-all duration-500 z-40 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x:120,rotate:90 }}
            animate={{ opacity: 1, x:0,rotate:0 }}
            exit={{ opacity: 0, scale: 0.5,rotate:90 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            aria-label="Close expanded view"
          >
            <AnimatedButton direction="x" onClick={onClose} />
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  ); 
};

export default ExpandedView;