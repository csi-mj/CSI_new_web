'use client'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Title = () => {
  const [isInView, setIsInView] = useState(false)

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setIsInView(true)}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ margin: "-100px" }}
    >
        {isInView ? (
          <TextGenerateEffect 
            words='Connect With Us' 
            duration={3} 
            className='text-primary text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight' 
          />
        ) : (
          <div className='text-primary text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight opacity-0'>
            Connect With Us
          </div>
        )}
    </motion.div>
  )
}

export default Title