import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface AnimatedButtonProps {
  direction?: 'left' | 'right';
  onClick?: () => void;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  direction = 'left', 
  onClick,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLeft = direction === 'left';
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const buttonX = useTransform(mouseX, [-50, 50], [-4, 4]);
  const buttonY = useTransform(mouseY, [-50, 50], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className={`relative w-16 h-16 cursor-pointer ${className}`}
      style={{ x: buttonX, y: buttonY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Outer Expanding Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-slate-400/20"
        animate={isHovered ? {
          scale: 1.25,
          opacity: 0,
          borderColor: "rgba(148, 163, 184, 0)"
        } : {
          scale: 1,
          opacity: 1,
          borderColor: "rgba(148, 163, 184, 0.2)"
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Secondary Ring */}
      <motion.div
        className="absolute inset-1 rounded-full border border-slate-300/30"
        animate={isHovered ? {
          scale: 1.15,
          opacity: 0,
          borderColor: "rgba(203, 213, 225, 0)"
        } : {
          scale: 1,
          opacity: 1,
          borderColor: "rgba(203, 213, 225, 0.3)"
        }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
      />

      {/* Main Button Surface */}
      <motion.div
        className="absolute inset-2 rounded-full bg-slate-800/40 backdrop-blur-sm border border-slate-300/40"
        animate={isHovered ? {
          backgroundColor: "rgba(30, 41, 59, 0.6)",
          borderColor: "rgba(226, 232, 240, 0.6)",
          boxShadow: "0 0 0 1px rgba(226, 232, 240, 0.1)"
        } : {
          backgroundColor: "rgba(30, 41, 59, 0.4)",
          borderColor: "rgba(203, 213, 225, 0.4)",
          boxShadow: "0 0 0 0px rgba(226, 232, 240, 0)"
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Inner Glow Ring */}
      <motion.div
        className="absolute inset-3.5 rounded-full"
        animate={isHovered ? {
          boxShadow: "inset 0 0 20px rgba(226, 232, 240, 0.15)",
          opacity: 1
        } : {
          boxShadow: "inset 0 0 0px rgba(226, 232, 240, 0)",
          opacity: 0
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Arrow Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        
        {/* Secondary Arrow (Trail) */}
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ x: 0, opacity: 0 }}
          animate={isHovered ? {
            x: isLeft ? -8 : 8,
            opacity: 0.25,
          } : {
            x: 0,
            opacity: 0
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none"
            className="text-slate-100"
          >
            <path
              d={isLeft 
                ? "M19 12H5M12 19l-7-7 7-7" 
                : "M5 12h14M12 5l7 7-7 7"
              }
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Main Arrow */}
        <motion.div
          className="absolute flex items-center justify-center"
          animate={isHovered ? {
            x: isLeft ? -3 : 3,
          } : {
            x: 0
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none"
            className="text-slate-50"
            animate={isHovered ? {
              scale: 1.05
            } : {
              scale: 1
            }}
            transition={{ duration: 0.3 }}
          >
            <path
              d={isLeft 
                ? "M19 12H5M12 19l-7-7 7-7" 
                : "M5 12h14M12 5l7 7-7 7"
              }
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        {/* Leading Arrow (Appears on hover) */}
        <motion.div
          className="absolute flex items-center justify-center"
          initial={{ x: 0, opacity: 0 }}
          animate={isHovered ? {
            x: isLeft ? 8 : -8,
            opacity: 0.15,
          } : {
            x: 0,
            opacity: 0
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none"
            className="text-slate-100"
          >
            <path
              d={isLeft 
                ? "M19 12H5M12 19l-7-7 7-7" 
                : "M5 12h14M12 5l7 7-7 7"
              }
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      {/* Directional Indicator Lines */}
      <motion.div
        className="absolute top-1/2 left-0 w-3 h-px bg-slate-300/0"
        style={{ 
          transformOrigin: isLeft ? 'right' : 'left',
          [isLeft ? 'left' : 'right']: '100%'
        }}
        animate={isHovered ? {
          scaleX: 1,
          backgroundColor: "rgba(203, 213, 225, 0.4)",
        } : {
          scaleX: 0,
          backgroundColor: "rgba(203, 213, 225, 0)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      {/* Press Feedback Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-slate-300/0"
        initial={{ scale: 1, opacity: 0 }}
        whileTap={{ 
          scale: 1.3, 
          borderColor: "rgba(203, 213, 225, 0.3)",
          opacity: [0.6, 0],
          transition: { duration: 0.5, ease: "easeOut" }
        }}
      />
    </motion.div>
  );
};

export default AnimatedButton;