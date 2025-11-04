'use client'
import React, { useMemo } from "react";
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
];

function MarqueeScrollComponent() {
  const firstRow = useMemo(() => reviews.slice(0, reviews.length / 2), []);
  const secondRow = useMemo(() => reviews.slice(reviews.length / 2), []);

  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-12 overflow-hidden">
            <motion.div
        initial={{ opacity: 1, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Marquee className="[--duration:10s]">
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
        initial={{ opacity: 1, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
      >
        <Marquee reverse className="[--duration:10s]">
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
    </div>
  );
}

const MarqueeScroll = React.memo(MarqueeScrollComponent);

MarqueeScroll.displayName = 'MarqueeScroll';

export { MarqueeScroll };
