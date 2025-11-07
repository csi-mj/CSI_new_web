'use client'
import Squares from '@/components/Squares';
import { LinkPreview } from '@/components/ui/link-preview';
import { PixelImage } from '@/components/ui/pixel-image';
import React from 'react';
import { motion } from 'framer-motion';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';



const HackrevCta = () => {
    return (
        <div className="relative w-full overflow-hidden py-24">
            <div className="absolute inset-0 z-0 bg-black">
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction="diagonal"
                    borderColor="#333"
                    hoverFillColor="#1a1a1a"
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.15),transparent_100%),linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(0,0,0,0.2))]" />
            </div>

            <motion.div
                className="relative z-10 w-full flex flex-col justify-center gap-12 items-center"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div>
                    <h1
                        className='text-sky-200 z-50 font-silkscreen text-xl md:text-3xl lg:text-4xl font-medium'
                    >Happening Now</h1>
                </div>
                <LinkPreview url="https://hackrevolution.in" id='hot'>
                    <div className="hidden sm:block">
                        <PixelImage
                            src="/logos/hackrevLogo.png"
                            customGrid={{ rows: 4, cols: 6 }}
                        />
                    </div>
                </LinkPreview>

                <div className="sm:hidden">
                    <PixelImage
                        src="/logos/hackrevmLogo.png"
                        customGrid={{ rows: 4, cols: 6 }}
                    />
                </div>
            </motion.div>

            <motion.div
                className="relative z-10 mt-6 flex w-full justify-center"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
            >
                <LinkPreview url="https://hackrevolution.in" id="cursor-big">

                    <button className="relative cursor-target hover:border-sky-600 duration-500 group cursor-pointer text-sky-50  overflow-hidden h-12 w-36 rounded-2xl bg-sky-800 p-2 flex justify-center items-center font-extrabold">
                        <div className="absolute z-10 w-44 h-44 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
                        <div className="absolute z-10 w-36 h-36 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
                        <div className="absolute z-10 w-28 h-28 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
                        <div className="absolute z-10 w-20 h-20 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
                        <div className="absolute z-10 w-12 h-12 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
                        <p className="z-10 text-blue-100">Know More</p>
                    </button>



                </LinkPreview>
            </motion.div>
        </div>
    );
};

export default HackrevCta;
