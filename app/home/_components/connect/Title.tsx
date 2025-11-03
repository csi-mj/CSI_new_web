'use client'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Title = () => {
  const [isInView, setIsInView] = useState(false)

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ amount: 0.6 }}
    >
         {isInView && (
           <TextGenerateEffect 
             words='Connect With Us' 
             duration={1} 
             delay={.1}
             
             className='text-primary font-orbitron text-3xl md:text-5xl lg:text-6xl font-medium cursor-target' 
           />
         )}
    </motion.div>
  )
}

export default Title