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
import logo from '@/public/logos/csi_logo.png'

import { OrbitingCircles } from '@/components/ui/orbiting-circles';
import Image from 'next/image';
import { LinkPreview } from '@/components/ui/link-preview';

const Orbit = () => {
  const [isPaused, setIsPaused] = useState(false);

  const innerItems = [
    {
      url: 'https://www.linkedin.com',
      hoverBorder: 'hover:border-[#0077B5]/50',
      icon: <FaLinkedin className="h-5 w-5 text-[#0077B5]" />,
    },
    {
      url: 'https://www.instagram.com',
      hoverBorder: 'hover:border-[#E4405F]/50',
      icon: <FaInstagram className="h-5 w-5 text-[#E4405F]" />,
    },
    {
      url: 'https://x.com',
      hoverBorder: 'hover:border-[#1DA1F2]/50',
      icon: <FaTwitter className="h-5 w-5 text-[#1DA1F2]" />,
    },
    {
      url: 'https://www.gmail.com',
      hoverBorder: 'hover:border-[#EA4335]/50',
      icon: <FaEnvelope className="h-5 w-5 text-[#EA4335]" />,
    },
  ];

  const outerItems = [
    {
      url: 'https://github.com/CSI-UST',
      hoverBorder: 'hover:border-white/50',
      icon: <FaGithub className="h-7 w-7 text-white" />,
    },
    {
      url: 'https://www.youtube.com',
      hoverBorder: 'hover:border-[#FF0000]/50',
      icon: <FaYoutube className="h-7 w-7 text-[#FF0000]" />,
    },
    {
      url: 'https://discord.com',
      hoverBorder: 'hover:border-[#5865F2]/50',
      icon: <FaDiscord className="h-7 w-7 text-[#5865F2]" />,
    },
    {
      url: 'https://www.whatsapp.com',
      hoverBorder: 'hover:border-[#1877F2]/50',
      icon: <FaWhatsapp className="h-7 w-7 text-[#25D366]" />,
    },
  ];

  return (
    <motion.div 
      className="pointer-events-none relative flex h-[500px] w-full items-center justify-center overflow-hidden"
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ margin: "-100px" }}
    >
      <div className="relative flex h-[500px] w-[600px] items-center justify-center">
        {/* Center Icon - Empty for now */}
        <motion.div 
          className="z-[2147483647] flex aspect-square h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-black"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Image src={logo} alt="CSI" id='cursor-big' className='' />
        </motion.div>

        {/* Inner Orbit - 4 Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <OrbitingCircles radius={100} reverse={false} duration={10} iconSize={48} className={isPaused ? 'orbit-paused' : ''}>
            {innerItems.map((item, idx) => (
              <LinkPreview
                key={idx}
                url={item.url}
                className={`pointer-events-auto size-full cursor-target flex items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 ${item.hoverBorder}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {item.icon}
              </LinkPreview>
            ))}
          </OrbitingCircles>
        </motion.div>

        {/* Outer Orbit - 4 Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <OrbitingCircles radius={180} duration={20} iconSize={56} reverse className={isPaused ? 'orbit-paused' : ''}>
            {outerItems.map((item, idx) => (
              <LinkPreview
                key={idx}
                url={item.url}
                className={`pointer-events-auto size-full cursor-target flex items-center justify-center rounded-full border border-white/20 bg-black transition-all hover:scale-110 ${item.hoverBorder}`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {item.icon}
              </LinkPreview>
            ))}
          </OrbitingCircles>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Orbit;