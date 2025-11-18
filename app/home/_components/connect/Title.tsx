'use client';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Title = () => {
  const [isInView, setIsInView] = useState(false);

  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <div>
        {isInView && (
          <TextGenerateEffect
            words="Connect With  Us"
            duration={1.2}
            delay={0.2}
            className="text-primary font-orbitron z-50 text-3xl font-medium md:text-5xl lg:text-6xl"
          />
        )}
      </div>
    </motion.div>
  );
};

export default Title;
