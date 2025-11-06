"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
  const [style, setStyle] = useState({});
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setStyle({
      transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
      transition: "transform 0.1s",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "rotateX(0deg) rotateY(0deg) scale(1)",
      transition: "transform 0.3s ease-out",
    });
    setHovered(false);
  };

  return (
    <motion.div
      className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000 group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={() => onClick(pdfUrl)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
        style={{
          boxShadow: hovered
            ? "0 0 80px 40px rgba(255, 255, 255, 0.3)"
            : "0 0 0px 0px rgba(0,0,0,0)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-black"
        style={style}
      >
        {/* Background */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{ backgroundImage: `url(${imageUrl})` }}
          animate={{
            scale: hovered ? 1.1 : 1,
            y: hovered ? -8 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/60 z-10 transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Hover description with Silkscreen font */}
        {description && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-end p-4 z-20 font-silkscreen"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hovered ? 1 : 0,
              y: hovered ? 0 : 20,
            }}
            transition={{ duration: 0.4 }}
          >
            <p className="mt-2 text-sm text-gray-200 line-clamp-3">
              {description}
            </p>
            <span className="mt-2 inline-block text-xs font-medium text-white underline">
              Click to view resources →
            </span>
          </motion.div>
        )}

        {/* Main Heading (always visible, Silkscreen, subtle scale on hover) */}
        <motion.div className="absolute top-4 left-4 z-30 font-silkscreen">
          <motion.h2
            className="text-lg sm:text-xl font-bold text-white drop-shadow-md"
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {title}
          </motion.h2>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResourceCard;







// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
//   const [style, setStyle] = useState({});
//   const [hovered, setHovered] = useState(false);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
//     const rotateX = ((y - centerY) / centerY) * 10;
//     const rotateY = ((x - centerX) / centerX) * 10;
//     setStyle({
//       transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
//       transition: "transform 0.1s",
//     });
//   };

//   const handleMouseLeave = () => {
//     setStyle({
//       transform: "rotateX(0deg) rotateY(0deg) scale(1)",
//       transition: "transform 0.3s ease-out",
//     });
//     setHovered(false);
//   };

//   return (
//     <motion.div
//       className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000 group"
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       onMouseEnter={() => setHovered(true)}
//       onClick={() => onClick(pdfUrl)}
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.2 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//     >
//       {/* glow */}
//       <div
//         className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
//         style={{
//           boxShadow: hovered
//             ? "0 0 80px 40px rgba(255, 255, 255, 0.3)"
//             : "0 0 0px 0px rgba(0,0,0,0)",
//         }}
//       />
//       {/* card body */}
//       <div
//         className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-black"
//         style={style}
//       >
//         <motion.div
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
//           style={{ backgroundImage: `url(${imageUrl})` }}
//           animate={{
//             scale: hovered ? 1.1 : 1,
//             y: hovered ? -8 : 0,
//           }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         />
//         <div
//           className={`absolute inset-0 bg-black/60 z-10 transition-opacity duration-500 ${
//             hovered ? "opacity-100" : "opacity-0"
//           }`}
//         />
//         <motion.div
//           className="absolute inset-0 flex flex-col justify-end p-4 z-20"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{
//             opacity: hovered ? 1 : 0,
//             y: hovered ? 0 : 20,
//           }}
//           transition={{ duration: 0.4 }}
//         >
//           <h2 className="text-xl font-bold text-white drop-shadow-lg">
//             {title}
//           </h2>
//           <p className="mt-2 text-sm text-gray-200 line-clamp-3">
//             {description}
//           </p>
//           <span className="mt-2 inline-block text-xs font-medium text-white underline">
//             Click to view resources →
//           </span>
//         </motion.div>
//         <div className="absolute top-4 left-4 z-30">
//           <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
//             {title}
//           </h2>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ResourceCard;






// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
//   const [style, setStyle] = useState({});
//   const [hovered, setHovered] = useState(false);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = ((y - centerY) / centerY) * 10;
//     const rotateY = ((x - centerX) / centerX) * 10;

//     setStyle({
//       transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
//       transition: "transform 0.1s",
//     });
//   };

//   const handleMouseLeave = () => {
//     setStyle({
//       transform: "rotateX(0deg) rotateY(0deg) scale(1)",
//       transition: "transform 0.3s ease-out",
//     });
//     setHovered(false);
//   };

//   return (
//     <motion.div
//       className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000 group"
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       onMouseEnter={() => setHovered(true)}
//       onClick={() => onClick(pdfUrl)}
//       initial={{ opacity: 0, y: 40 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, amount: 0.2 }}
//       transition={{ duration: 0.5, ease: "easeOut" }}
//     >
//       {/* Glow */}
//       <div
//         className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
//         style={{
//           boxShadow: hovered
//             ? "0 0 80px 40px rgba(255, 255, 255, 0.3)"
//             : "0 0 0px 0px rgba(0,0,0,0)",
//         }}
//       />

//       {/* Card */}
//       <div
//         className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg bg-black"
//         style={style}
//       >
//         {/* Background */}
//         <motion.div
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
//           style={{ backgroundImage: `url(${imageUrl})` }}
//           animate={{
//             scale: hovered ? 1.1 : 1,
//             y: hovered ? -8 : 0,
//           }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         />

//         {/* Overlay */}
//         <div
//           className={`absolute inset-0 bg-black/60 z-10 transition-opacity duration-500 ${
//             hovered ? "opacity-100" : "opacity-0"
//           }`}
//         />

//         {/* Hover description */}
//         <motion.div
//           className="absolute inset-0 flex flex-col justify-end p-4 z-20"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{
//             opacity: hovered ? 1 : 0,
//             y: hovered ? 0 : 20,
//           }}
//           transition={{ duration: 0.4 }}
//         >
//           <h2 className="text-xl font-bold text-white drop-shadow-lg">
//             {title}
//           </h2>
//           <p className="mt-2 text-sm text-gray-200 line-clamp-3">
//             {description}
//           </p>
//           <span className="mt-2 inline-block text-xs font-medium text-white underline">
//             Click to view resources →
//           </span>
//         </motion.div>

//         {/* Title (always visible) */}
//         <div className="absolute top-4 left-4 z-30">
//           <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
//             {title}
//           </h2>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ResourceCard;





// "use client";
// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
//   const [style, setStyle] = useState({});
//   const [hovered, setHovered] = useState(false);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = ((y - centerY) / centerY) * 10;
//     const rotateY = ((x - centerX) / centerX) * 10;

//     setStyle({
//       transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
//       transition: "transform 0.1s",
//     });
//   };

//   const handleMouseLeave = () => {
//     setStyle({
//       transform: "rotateX(0deg) rotateY(0deg) scale(1)",
//       transition: "transform 0.3s ease-out",
//     });
//     setHovered(false);
//   };

//   return (
//     <motion.div
//       className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000 group"
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       onMouseEnter={() => setHovered(true)}
//       onClick={() => onClick(pdfUrl)}
//       initial={{ opacity: 0, y: 40, scale: 0.95 }}
//       whileInView={{ opacity: 1, y: 0, scale: 1 }}
//       viewport={{ once: true, amount: 0.2 }}
//       transition={{ duration: 0.6, ease: "easeOut" }}
//     >
//       {/* Glow behind the card */}
//       <motion.div
//         className="absolute inset-0 rounded-2xl pointer-events-none"
//         animate={{
//           boxShadow: hovered
//             ? [
//                 "0 0 30px rgba(255,255,255,0.2)",
//                 "0 0 60px rgba(255,255,255,0.4)",
//                 "0 0 90px rgba(255,255,255,0.2)",
//               ]
//             : "0 0 0 rgba(0,0,0,0)",
//         }}
//         transition={{ duration: 1.5, repeat: hovered ? Infinity : 0 }}
//       />

//       {/* Card */}
//       <motion.div
//         className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg"
//         style={style}
//         whileHover={{ scale: 1.03 }}
//         transition={{ type: "spring", stiffness: 300, damping: 15 }}
//       >
//         {/* Background with parallax motion */}
//         <motion.div
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
//           style={{ backgroundImage: `url(${imageUrl})` }}
//           animate={{
//             scale: hovered ? 1.1 : 1,
//             y: hovered ? -10 : 0,
//           }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//         />

//         {/* Overlay */}
//         <div
//           className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-10 transition-opacity duration-500 ${
//             hovered ? "opacity-100" : "opacity-0"
//           }`}
//         />

//         {/* Description on hover */}
//         {description && (
//           <motion.div
//             className="absolute inset-0 flex flex-col justify-end p-4 z-20"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{
//               opacity: hovered ? 1 : 0,
//               y: hovered ? 0 : 30,
//             }}
//             transition={{ duration: 0.4 }}
//           >
//             <h2 className="text-xl font-bold text-white drop-shadow-lg">
//               {title}
//             </h2>
//             <p className="mt-2 text-sm text-gray-200 line-clamp-3">
//               {description}
//             </p>
//             <span className="mt-2 inline-block text-xs font-medium text-white underline">
//               Click to view resources →
//             </span>
//           </motion.div>
//         )}

//         {/* Static title */}
//         <div className="absolute top-4 left-4 z-30">
//           <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-md">
//             {title}
//           </h2>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ResourceCard;




//VERSION 1 WITHOUT FRAMER ANIMATIONS 
// import React, { useState } from "react";

// const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
//   const [style, setStyle] = useState({});
//   const [hovered, setHovered] = useState(false);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = ((y - centerY) / centerY) * 10;
//     const rotateY = ((x - centerX) / centerX) * 10;

//     setStyle({
//       transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
//       transition: "transform 0.1s",
//     });
//   };

//   const handleMouseLeave = () => {
//     setStyle({
//       transform: "rotateX(0deg) rotateY(0deg) scale(1)",
//       transition: "transform 0.3s ease-out",
//     });
//     setHovered(false);
//   };

//   return (
//     <div
//       className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000 group"
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       onMouseEnter={() => setHovered(true)}
//       onClick={() => onClick(pdfUrl)}
//     >
//       {/* Glow behind the card */}
//       <div
//         className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
//         style={{
//          boxShadow: hovered
//           ? "0 0 80px 40px rgba(255, 255, 255, 0.6)"
//           : "0 0 0px 0px rgba(0,0,0,0)",

//         }}
//       />

//       {/* Card itself */}
//       <div
//         className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg"
//         style={style}
//       >
//         {/* Background image */}
//         <div
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
//           style={{ backgroundImage: `url(${imageUrl})` }}
//         />

//         {/* Dim overlay — only shows on hover */}
//         <div
//           className={`absolute inset-0 bg-black/50 z-10 transition-opacity duration-500 ${
//             hovered ? "opacity-100" : "opacity-0"
//           }`}
//         />

//         {/* Hover description */}
//         {description && (
//           <div
//             className={`absolute inset-0 flex flex-col justify-end p-4 z-20 transition-opacity duration-500 ${
//               hovered ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             <h2 className="text-xl font-bold text-white drop-shadow-lg">
//               {title}
//             </h2>
//             <p className="mt-2 text-sm text-gray-200 line-clamp-3">
//               {description}
//             </p>
//             <span className="mt-2 inline-block text-xs font-medium text-white underline">
//               Click to view resources →
//             </span>
//           </div>
//         )}

//         {/* Static title */}
//         <div className="absolute top-4 left-4 z-30">
//           <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-md transition-colors duration-300">
//             {title}
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResourceCard;








// import React, { useState } from "react";

// const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
//   const [style, setStyle] = useState({});
//   const [hovered, setHovered] = useState(false);

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;

//     const rotateX = ((y - centerY) / centerY) * 10;
//     const rotateY = ((x - centerX) / centerX) * 10;

//     setStyle({
//       transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
//       transition: "transform 0.1s",
//     });
//   };

//   const handleMouseLeave = () => {
//     setStyle({
//       transform: "rotateX(0deg) rotateY(0deg) scale(1)",
//       transition: "transform 0.3s ease-out",
//     });
//     setHovered(false);
//   };

//   return (
//     <div
//       className="relative w-full h-80 sm:h-96 cursor-pointer perspective-1000 group"
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       onMouseEnter={() => setHovered(true)}
//       onClick={() => onClick(pdfUrl)}
//     >
//       {/* Glow behind the card */}
//       <div
//         className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
//         style={{
//           boxShadow: hovered
//             ? "0 0 60px 30px rgba(255, 200, 50, 0.5)"
//             : "0 0 0px 0px rgba(0,0,0,0)",
//         }}
//       />

//       {/* Card itself */}
//       <div
//         className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg"
//         style={style}
//       >
//         {/* Background image */}
//         <div
//           className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
//           style={{ backgroundImage: `url(${imageUrl})` }}
//         />

//         {/* Dim overlay */}
//         <div className="absolute inset-0 bg-black/50 z-10" />

//         {/* Hover description */}
//         {description && (
//           <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4">
//             <h2 className="text-xl font-bold text-white drop-shadow-lg">{title}</h2>
//             <p className="mt-2 text-sm text-gray-200 line-clamp-3">{description}</p>
//             <span className="mt-2 inline-block text-xs font-medium text-white underline">
//               Click to view resources →
//             </span>
//           </div>
//         )}

//         {/* Static title */}
//         <div className="absolute top-4 left-4 z-30">
//           <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-md transition-colors duration-300">
//             {title}
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResourceCard;









// import React, { useState } from "react";

// const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
//   const [style, setStyle] = useState({});

//   const handleMouseMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = e.clientX - rect.left; // x position within the card
//     const y = e.clientY - rect.top;  // y position within the card
//     const centerX = rect.width / 2;
//     const centerY = rect.height / 2;
//     const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
//     const rotateY = ((x - centerX) / centerX) * 10; // max 10deg

//     setStyle({
//       transform: `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`,
//       transition: "transform 0.1s",
//     });
//   };

//   const handleMouseLeave = () => {
//     setStyle({
//       transform: "rotateX(0deg) rotateY(0deg) scale(1)",
//       transition: "transform 0.3s ease-out",
//     });
//   };

//   return (
//     <div
//       onClick={() => onClick(pdfUrl)}
//       onMouseMove={handleMouseMove}
//       onMouseLeave={handleMouseLeave}
//       style={style}
//       className="group relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
//     >
//       {/* Background image */}
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
//         style={{ backgroundImage: `url(${imageUrl})` }}
//       />

//       {/* Gradient overlay */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

//       {/* Hover overlay */}
//       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 flex flex-col justify-end p-4">
//         {description && (
//           <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
//             <h2 className="text-xl font-bold text-white drop-shadow-lg">{title}</h2>
//             <p className="mt-2 text-sm text-gray-200 line-clamp-3">{description}</p>
//             <span className="mt-2 inline-block text-xs font-medium text-white underline">
//               Click to view resources →
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Static title */}
//       <div className="absolute top-4 left-4 z-30">
//         <h2 className="text-lg sm:text-xl font-bold text-white drop-shadow-md group-hover:text-red-400 transition-colors duration-300">
//           {title}
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default ResourceCard;



// import React from "react";

// const ResourceCard = ({ title, pdfUrl, imageUrl, description, onClick }) => {
//   return (
//     <div
//       onClick={() => onClick(pdfUrl)}
//       className="group relative block w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-md hover:shadow-[0_0_20px_5px_rgba(255,255,255,0.3)] transition-shadow duration-300 ease-out hover:scale-105 transition-transform duration-300 ease-out cursor-pointer"
//     >
//       <div
//         className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
//         style={{ backgroundImage: `url(${imageUrl})` }}
//       />

//       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-[1]" />

//       {/* Hover overlay */}
//       <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[2]" />

//       {/* Title */}
//       <div className="absolute top-4 left-4 z-[3]">
//         <h2 className="text-xl font-bold text-white drop-shadow-lg">
//           {title}
//         </h2>
//       </div>

//       {/* Description */}
//       {description && (
//         <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[3]">
//           <p className="text-sm text-gray-200 font-normal line-clamp-3">
//             {description}
//           </p>
//           <span className="mt-2 inline-block text-xs font-medium text-white underline">
//             Click to view resources →
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResourceCard;