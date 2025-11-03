'use client'
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import CardsDemo from "@/components/cards-demo-1"
import Shuffle from "@/components/Shuffle";

const reviews = [
    {
        name: "MD FEROZ AHMED",
        profession: 'TECH HEAD',
        hoverGif: "https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    },
    {
        name: "MD FEROZ AHMED",
        profession: "TECH HEAD",
        hoverGif: "https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    },
    {
        name: "MD FEROZ AHMED",
        profession: "TECH HEAD",
        hoverGif: "https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    },
    {
        name: "MD FEROZ AHMED",
        profession: "TECH HEAD",
        hoverGif: "https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    },
    {
        name: "MD FEROZ AHMED",
        profession: "TECH HEAD",
        hoverGif: "https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    },
    {
        name: "MD FEROZ AHMED",
        profession: "TECH HEAD",
        hoverGif: "https://media1.tenor.com/m/7HYOnFr3-aIAAAAd/sad-sad-monkey.gif",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop&crop=face",
    },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string
    name: string
    username: string
    body: string
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    )
}

export function MarqueeScroll() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center gap-12 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.01 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Shuffle text="MEMBERS" />
                <Marquee className="[--duration:20s]">
                    {firstRow.map((member, i) => (
                        <CardsDemo
                            key={`row1-${member.name}-${i}`}
                            name={member.name}
                            profession={member.profession}
                            hoverGif={member.hoverGif}
                            image={member.image}
                        />
                    ))}
                </Marquee>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 45 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.01 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <Marquee reverse className="[--duration:20s]">
                    {secondRow.map((member, i) => (
                        <CardsDemo
                            key={`row2-${member.name}-${i}`}
                            name={member.name}
                            profession={member.profession}
                            hoverGif={member.hoverGif}
                            image={member.image}
                        />
                    ))}
                </Marquee>
            </motion.div>
            {/* <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div> */}
        </div>
    )
}
