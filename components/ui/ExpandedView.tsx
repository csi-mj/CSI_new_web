'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/ui/animatedButton';
import { createPortal } from 'react-dom';

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

interface ExpandedViewProps {
  expandedMember: TeamMember | null;
  onClose: () => void;
}

const ExpandedView: React.FC<ExpandedViewProps> = ({ expandedMember, onClose }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!expandedMember || !mounted) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-40 bg-white/5 backdrop-blur-md flex items-center md:items-end justify-center p-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      onClick={onClose}
    >
      <motion.div
        className="relative h-[65vh] md:h-[80vh]  max-h-[80vh] mx-auto w-full max-w-4xl px-4"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="expanded-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative h-full w-full rounded-2xl overflow-hidden  flex flex-col md:flex-row bg-white/10 backdrop-blur-xl border border-white/10">
          {/* Image Section */}
          <motion.div
            className="w-full md:w-1/2 h-[40vh] sm:h-[50vh] md:h-full relative overflow-hidden p-3 md:p-6"
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
                className="object-cover rounded-xl md:rounded-2xl"
                priority
                unoptimized={process.env.NODE_ENV !== 'production'}
                style={{
                  objectPosition: 'center top'
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/30 via-transparent to-transparent" />
          </motion.div>

          {/* Description Section */}
          <motion.div
            className="w-full md:w-1/2 flex-1 h-full p-6 md:p-12 flex flex-col justify-center overflow-y-auto bg-gradient-to-br from-black/90 to-black/60 no-scrollbar"
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
              id="expanded-title"
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 tracking-tight no-scrollbar"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className='cursor-target' id='cursor-mid'>{expandedMember.name}</span>
            </motion.h1>

            <motion.h2
              className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-4 md:mb-6 font-light no-scrollbar"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className='cursor-target' id='cursor'>{expandedMember.title}</span>
            </motion.h2>

            <motion.ul 
              className="social-wrapper flex flex-row items-center gap-4 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <li id='cursor-mid' className="icon github cursor-target inline-flex items-center justify-center !w-12 !h-12 !min-w-12 !min-h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors select-none shrink-0">
                <span className="tooltip">Github</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </li>

              <li id='cursor-mid' className="icon linkedin cursor-target inline-flex items-center justify-center !w-12 !h-12 !min-w-12 !min-h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors select-none shrink-0">
                <span className="tooltip">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </li>

            </motion.ul>

            <motion.button
            id='cursor'
              className="fixed md:scale-75 top-6 md:top-8 right-6 hover:rotate-90 cursor-pointer cursor-target rounded-full flex items-center justify-center transition-all duration-500 z-40 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
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
              <AnimatedButton direction="x"  onClick={onClose} />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  ); 
};

export default ExpandedView;