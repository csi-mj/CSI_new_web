'use client'
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const HackrevCta = () => {
    return (
        <div className="relative w-full pb-20">
             {/* Background Glow */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px]" />
             
            <Link 
                href="https://www.adsophos.com/" 
                target="_blank" 
                className="relative z-10 block cursor-pointer group"
            >
                <motion.div 
                    className="w-full h-[800px] md:h-[550px]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.005 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >

                   

                    {/* The Visual Mirror (Iframe) */}
                    <div className="w-full h-full pointer-events-none select-none">
                        <iframe 
                            src="https://www.adsophos.com/" 
                            className="w-full h-[150%] border-0 -mt-[2%] md:-mt-[1%] scale-[1.02] grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000"
                            title="AdSophos Preview"
                            loading="lazy"
                            scrolling="no"
                        />
                    </div>
                </motion.div>
            </Link>
        </div>
    );
};

export default HackrevCta;
