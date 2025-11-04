"use client";

import React from "react";
import { motion } from "framer-motion";

type NavTabsProps = {
  tabs: string[];
  activeIdx: number;
  onChange: (index: number) => void;
  className?: string;
};

const NavTabs: React.FC<NavTabsProps> = ({ tabs, activeIdx, onChange, className }) => {
  return (
    <>
      {tabs.map((label, idx) => {
        const active = activeIdx === idx;
        return (
          <motion.button
            key={label}
            type="button"
            onClick={() => onChange(idx)}
            className={`relative cursor-target font-silkscreen cursor-pointer select-none rounded-xl px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm md:text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent overflow-hidden ${
              active
                ? "bg-white/50 text-black shadow-2xl shadow-white/20"
                : "bg-white/5 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 backdrop-blur-sm"
            } ${className ?? ""}`}
            initial={false}
            animate={{
              scale: active ? 1 : 1,
              y: active ? -2 : 0,
            }}
            whileHover={!active ? { 
              scale: 1.03,
              y: -1,
              borderColor: "rgba(255, 255, 255, 0.2)"
            } : {}}
            whileTap={{ scale: 0.97 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              mass: 0.5
            }}
          >
            <span className="relative z-10 block">{label}</span>
            
            {active && (
              <>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 25
                  }}
                />
                
                <motion.div
                  className="absolute -inset-1 bg-white/10 rounded-xl blur-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeOut"
                  }}
                >
                  <div className="absolute inset-0 bg-white/10 rounded-xl" 
                       style={{ transform: "scale(1.5)", opacity: 0 }} />
                </motion.div>
              </>
            )}
          </motion.button>
        );
      })}
    </>
  );
};

export default NavTabs;