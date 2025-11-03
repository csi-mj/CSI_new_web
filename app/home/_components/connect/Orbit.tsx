'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLinkedin, 
  FaInstagram, 
  FaTwitter, 
  FaGithub, 
  FaYoutube, 
  FaDiscord, 
  FaFacebook,
  FaEnvelope,
  FaWhatsapp
} from 'react-icons/fa';

import { OrbitingCircles } from '@/components/ui/orbiting-circles';

const Orbit = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <motion.div 
      className="pointer-events-none relative flex h-[500px] w-full items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ margin: "-100px" }}
    >
      <div className="relative flex h-[500px] w-[600px] items-center justify-center">
        {/* Center Icon - Empty for now */}
        <motion.div 
          className="z-10 flex aspect-square h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-black"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          {/* Center content will be added later */}
        </motion.div>

        {/* Inner Orbit - 4 Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <OrbitingCircles radius={100} duration={10} iconSize={48} className={isPaused ? '[animation-play-state:paused]' : ''}>
          <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-[#0077B5]/50">
            <FaLinkedin className="h-5 w-5 text-[#0077B5]" />
          </div>
          <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-[#E4405F]/50">
            <FaInstagram className="h-5 w-5 text-[#E4405F]" />
          </div>
          <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-[#1DA1F2]/50">
            <FaTwitter className="h-5 w-5 text-[#1DA1F2]" />
          </div>
          <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-[#EA4335]/50">
            <FaEnvelope className="h-5 w-5 text-[#EA4335]" />
          </div>
        </OrbitingCircles>
        </motion.div>

        {/* Outer Orbit - 4 Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <OrbitingCircles radius={180} duration={20} iconSize={56} reverse className={isPaused ? '[animation-play-state:paused]' : ''}>
            <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-white/50">
              <FaGithub className="h-7 w-7 text-white" />
            </div>
            <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-[#FF0000]/50">
              <FaYoutube className="h-7 w-7 text-[#FF0000]" />
            </div>
            <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-[#5865F2]/50">
              <FaDiscord className="h-7 w-7 text-[#5865F2]" />
            </div>
            <div onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} className="pointer-events-auto flex h-full w-full items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 hover:border-[#1877F2]/50">
              <FaWhatsapp className="h-7 w-7 text-[#25D366]" />
            </div>
          </OrbitingCircles>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Orbit;