"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiEye } from "react-icons/fi";

export interface Card {
  id: number;
  bulletin_img: string;
  pdf: string;
  title: string;
  description: string;
  pages: number;
}

interface GridCardsProps {
  cards: Card[];
  onSelect: (file: Card) => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const GridCards: React.FC<GridCardsProps> = ({ cards, onSelect }) => {
  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 py-12">
      <div
        className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4 sm:gap-5 md:gap-6
          auto-rows-[250px] lg:auto-rows-[300px]
        "
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.2 }}
            whileHover={{ scale: 1.03 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(card)}
            className={`
              group cursor-target bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-2
              hover:bg-white/10 transition-all duration-300 cursor-pointer
              hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]
              overflow-hidden relative 
              ${index === 0 ? "lg:row-span-2" : ""}
            `}
          >
            <div className="relative h-full w-full rounded-xl overflow-hidden">
              <img
                src={card.bulletin_img}
                alt={card.title}
                className={`
                  w-full h-full transition-all duration-300 rounded-xl 
                  ${index === 0 ? "object-cover" : "object-contain"} 
                  group-hover:scale-[1.05]
                `}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Centered hover indicator */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-500/10 px-4 py-2 text-sm font-medium text-white cursor-target ring-1 ring-white/20 backdrop-blur-sm">
                  <FiEye className="h-4 w-4" />
                  View
                </span>
              </div>

             <div className="absolute bottom-0 w-full p-4 text-white space-y-1">
               <h3 className="font-semibold text-3xl mb-6">{card.title}</h3>
               {
                index==0 &&
                <p className="text-lg mb-2 text-white/80">{card.description}</p>
               }
              
               <a
                 onClick={(e) => e.stopPropagation()}
                 href={card.pdf}
                 download
                 className="mt-2 bg-primary/80 hover:bg-primary text-xs px-3 py-2 rounded-lg shadow transition cursor-pointer cursor-target"
               >
                 Download PDF
               </a>
             </div>

            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GridCards;
