'use client'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Title = () => {
  const [isInView, setIsInView] = useState(false)

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setIsInView(true)}
      onViewportLeave={() => setIsInView(false)}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
    >
         {isInView && (
          <div>
            <TextGenerateEffect 
             words='Connect With  Us' 
             duration={1} 
             delay={.1}
             className='text-primary z-50 font-orbitron text-3xl md:text-5xl lg:text-6xl font-medium'
           />
          </div>
           
         )}
    </motion.div>
  )
}

export default Title