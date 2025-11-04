import React from "react";

const ResourceCard = ({ title, pdfUrl, imageUrl, description }) => {
  return (
    <a
    href={pdfUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.3)] transition-shadow duration-300 ease-out hover:scale-105 transition-transform duration-300 ease-out"
    >
    <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl})` }}
     />

      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-[1]" />

      {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]" />

      {/* Title*/}
      <div className="absolute top-4 left-4 z-[3]">
        <h2 className="text-xl font-bold text-white drop-shadow-lg">
          {title}
        </h2>
      </div>

      {/* Description*/}
      {description && (
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[3]">
          <p className="text-sm text-gray-200 font-normal line-clamp-3">
            {description}
          </p>
          <span className="mt-2 inline-block text-xs font-medium text-white underline">
            Click to view resources →
          </span>
        </div>
      )}
    </a>
  );
};

export default ResourceCard;