import { BackgroundLines } from '@/components/ui/background-lines'
import Image from 'next/image'
import React from 'react'
import logo from '../../../public/assets/logos/csi_logo.png'

type Props = {}

const Hero = (props: Props) => {
    return (
        <section className="relative flex min-h-screen w-full flex-col items-center max-sm:justify-center overflow-hidden py-0 px-3">

            <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                <div className="hero-logo">
                    <Image
                        src={logo}
                        alt="E-Cell MJCET Logo"
                        width={200}
                        height={200}
                        priority
                        className="w-24 h-24 sm:w-32 sm:h-32 animate-pulse duration-700 lg:w-40 lg:h-40 object-contain drop-shadow-2xl"
                    />

                </div>
                <h1 className='font-silkscreen text-3xl text-red-600'>CSI MJCET</h1>

            </BackgroundLines>

        </section>
    )
}

export default Hero