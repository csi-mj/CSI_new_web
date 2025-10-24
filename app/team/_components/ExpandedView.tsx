'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
      className="fixed bottom-0 left-0 right-0 h-[calc(100vh-6rem)] z-50 bg-black/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="h-full flex flex-col md:flex-row"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section - Full width on mobile, half on desktop */}
        <motion.div
          className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="relative w-full h-full">
            <Image
              src={expandedMember.image}
              alt={expandedMember.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized={process.env.NODE_ENV !== 'production'}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/20 to-transparent" />
        </motion.div>

        {/* Description Section - Full width on mobile, half on desktop */}
        <motion.div
          className="w-full md:w-1/2 h-1/2 md:h-full p-4 md:p-12 flex flex-col justify-center overflow-y-auto"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {expandedMember.name}
          </motion.h1>
          
          <motion.h2
            className="text-lg md:text-2xl text-gray-300 mb-4 md:mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {expandedMember.title}
          </motion.h2>

          <motion.div
            className="space-y-3 md:space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Specialties</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {expandedMember.specialties.map((specialty, index) => (
                <motion.span
                  key={index}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-sm text-white/90 rounded-full text-xs md:text-sm"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                >
                  {specialty}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Close Button */}
          <motion.button
            className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ExpandedView;
