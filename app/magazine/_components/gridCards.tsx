"use client";
import React from "react";

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

const GridCards: React.FC<GridCardsProps> = ({ cards, onSelect }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Main grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6  ">

        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => onSelect(card)}
            className={`
              cursor-pointer rounded-xl border border-white-200 shadow p-2 
              hover:shadow-xl hover:scale-[1.02] transition overflow-hidden 
              ${index === 0 ? "lg:row-span-2 lg:col-span-1" : ""} 
            `}
          >
            {/* Image */}
            <div className={`${index === 0 ? "h-[400px]" : "h-[180px]"} relative`}>
              <img
                src={card.bulletin_img}
                alt={card.title}
                className={`${index === 0 ? "object-contain" : "object-cover object-top"} w-full h-full  overflow-hidden rounded-t-lg`}
              />
            </div>

            {/* Content */}
            <div className="p-4 relative">
              <h3 className="font-bold text-lg">{card.title}</h3>
              <p className="text-sm text-white text-semibold">{card.description} pages</p>

            
              <a
                href={card.pdf}
                download
                className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-lg shadow hover:bg-blue-700"
                onClick={(e) => e.stopPropagation()}
              >
                Download
              </a>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default GridCards;
