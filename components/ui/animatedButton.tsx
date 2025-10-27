import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface AnimatedButtonProps {
  direction?: 'left' | 'right' | 'x';
  onClick?: () => void;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  direction = 'left', 
  onClick,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isLeft = direction === 'left';
  const isX = direction === 'x';
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Magnetic spring effect for smoother movement
  const buttonX = useSpring(useTransform(mouseX, [-50, 50], [-8, 8]), {
    stiffness: 150,
    damping: 15,
    mass: 0.1
  });
  const buttonY = useSpring(useTransform(mouseY, [-50, 50], [-8, 8]), {
    stiffness: 150,
    damping: 15,
    mass: 0.1
  });
  
  // Rotation based on mouse position
  const rotateX = useSpring(useTransform(mouseY, [-50, 50], [5, -5]), {
    stiffness: 150,
    damping: 15
  });
  const rotateY = useSpring(useTransform(mouseX, [-50, 50], [-5, 5]), {
    stiffness: 150,
    damping: 15
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    
    // Enhanced magnetic effect
    mouseX.set(distX);
    mouseY.set(distY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={buttonRef}
      className={`relative w-16 h-16 cursor-pointer ${className}`}
      style={{ 
        x: buttonX, 
        y: buttonY,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Outer Expanding Ring with Pulse */}
      <motion.div
        className="absolute inset-0 rounded-full border border-red-400/30"
        animate={isHovered ? {
          scale: [1, 1.4, 1.6],
          opacity: [0.5, 0.2, 0],
          borderColor: ["rgba(248, 113, 113, 0.3)", "rgba(248, 113, 113, 0.1)", "rgba(248, 113, 113, 0)"]
        } : {
          scale: 1,
          opacity: 0.3,
          borderColor: "rgba(148, 163, 184, 0.3)"
        }}
        transition={{ 
          duration: isHovered ? 1.2 : 0.4,
          ease: "easeOut",
          repeat: isHovered ? Infinity : 0,
          repeatDelay: 0.3
        }}
      />

      {/* Secondary Ring with Glow */}
      <motion.div
        className="absolute inset-1 rounded-full border border-red-300/40"
        animate={isHovered ? {
          scale: 1.2,
          opacity: 0,
          borderColor: "rgba(252, 165, 165, 0)",
          boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)"
        } : {
          scale: 1,
          opacity: 0.4,
          borderColor: "rgba(203, 213, 225, 0.4)",
          boxShadow: "0 0 0px rgba(239, 68, 68, 0)"
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      />

      {/* Main Button Surface with Enhanced Glow */}
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-800/50 to-slate-900/60 backdrop-blur-md border border-slate-300/50"
        animate={isHovered ? {
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))",
          borderColor: "rgba(226, 232, 240, 0.7)",
          boxShadow: [
            "0 0 0 1px rgba(226, 232, 240, 0.1), 0 4px 12px rgba(239, 68, 68, 0.15)",
            "0 0 0 1px rgba(226, 232, 240, 0.2), 0 8px 24px rgba(239, 68, 68, 0.25)"
          ]
        } : {
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.6))",
          borderColor: "rgba(203, 213, 225, 0.5)",
          boxShadow: "0 0 0 0px rgba(226, 232, 240, 0), 0 2px 4px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Inner Glow Ring with Shimmer */}
      <motion.div
        className="absolute inset-3.5 rounded-full"
        animate={isHovered ? {
          boxShadow: [
            "inset 0 0 20px rgba(239, 68, 68, 0.2), inset 0 0 40px rgba(220, 38, 38, 0.1)",
            "inset 0 0 30px rgba(239, 68, 68, 0.3), inset 0 0 50px rgba(220, 38, 38, 0.15)"
          ],
          opacity: 1
        } : {
          boxShadow: "inset 0 0 0px rgba(226, 232, 240, 0)",
          opacity: 0
        }}
        transition={{ 
          duration: 0.6,
          ease: "easeInOut",
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse",
          repeatDelay: 0.2
        }}
      />

      {/* Icon Container */}
      <div className="absolute inset-0 flex items-center justify-center">
        
        {isX ? (
          // X Icon with rotation animation
          <>
            {/* Secondary X (Trail) */}
            <motion.div
              className="absolute flex items-center justify-center"
              initial={{ opacity: 0, rotate: 0 }}
              animate={isHovered ? {
                opacity: 0.25,
                rotate: 90
              } : {
                opacity: 0,
                rotate: 0
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
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Main X */}
            <motion.div
              className="absolute flex items-center justify-center"
              animate={isHovered ? {
                rotate: 90,
                scale: 1.05
              } : {
                rotate: 0,
                scale: 1
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                className="text-slate-50"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </>
        ) : (
          // Arrow Icons
          <>
            {/* Secondary Arrow (Trail) with Blur */}
            <motion.div
              className="absolute flex items-center justify-center"
              initial={{ x: 0, opacity: 0 }}
              animate={isHovered ? {
                x: isLeft ? -10 : 10,
                opacity: 0.3,
                filter: "blur(1px)"
              } : {
                x: 0,
                opacity: 0,
                filter: "blur(0px)"
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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

            {/* Main Arrow with Enhanced Movement */}
            <motion.div
              className="absolute flex items-center justify-center"
              animate={isHovered ? {
                x: isLeft ? -4 : 4,
                filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))"
              } : {
                x: 0,
                filter: "drop-shadow(0 0 0px rgba(239, 68, 68, 0))"
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none"
                className="text-slate-50"
                animate={isHovered ? {
                  scale: 1.1,
                  rotate: isLeft ? -5 : 5
                } : {
                  scale: 1,
                  rotate: 0
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

            {/* Leading Arrow (Appears on hover) with Fade */}
            <motion.div
              className="absolute flex items-center justify-center"
              initial={{ x: 0, opacity: 0 }}
              animate={isHovered ? {
                x: isLeft ? 10 : -10,
                opacity: 0.2,
                filter: "blur(2px)"
              } : {
                x: 0,
                opacity: 0,
                filter: "blur(0px)"
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
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
          </>
        )}
      </div>

      {/* Enhanced Directional Indicator Lines - Only for arrows */}
      {!isX && (
        <>
          <motion.div
            className="absolute top-1/2 left-0 w-4 h-0.5 bg-gradient-to-r from-red-400/0 to-red-400/60"
            style={{ 
              transformOrigin: isLeft ? 'right' : 'left',
              [isLeft ? 'left' : 'right']: '100%'
            }}
            animate={isHovered ? {
              scaleX: 1,
              opacity: 1
            } : {
              scaleX: 0,
              opacity: 0
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* Particle trail */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 w-1 h-1 rounded-full bg-red-400"
              style={{
                [isLeft ? 'left' : 'right']: `${100 + i * 8}%`,
                y: '-50%'
              }}
              animate={isHovered ? {
                opacity: [0, 0.6, 0],
                scale: [0, 1, 0.5],
                x: isLeft ? [-10, -20] : [10, 20]
              } : {
                opacity: 0,
                scale: 0
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </>
      )}

      {/* Enhanced Press Feedback Ring with Ripple */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-red-400/0"
        initial={{ scale: 1, opacity: 0 }}
        animate={isPressed ? {
          scale: [1, 1.2],
          borderColor: ["rgba(248, 113, 113, 0.5)", "rgba(248, 113, 113, 0)"],
          opacity: [0.8, 0]
        } : {
          scale: 1,
          opacity: 0
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={isHovered ? {
          boxShadow: [
            "0 0 20px rgba(239, 68, 68, 0.3)",
            "0 0 30px rgba(239, 68, 68, 0.4)",
            "0 0 20px rgba(239, 68, 68, 0.3)"
          ]
        } : {
          boxShadow: "0 0 0px rgba(239, 68, 68, 0)"
        }}
        transition={{
          duration: 1.5,
          repeat: isHovered ? Infinity : 0,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

export default AnimatedButton;