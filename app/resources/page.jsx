"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResourceCard from "./components/resourcecard";
import PdfPreviewModal from "../../components/ui/PdfPreviewModal";
import { StripedPattern } from "@/components/magicui/striped-pattern";

const ResourcesPage = () => {
  const [selectedPdf, setSelectedPdf] = useState(null); // { pdf, title }

 

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 px-8 pb-40 relative overflow-hidden">

      <StripedPattern className="text-gray-600/30" />
      {/* 🧠 Header Section */}
      <section className="text-center mb-5 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-orbitron text-3xl sm:text-4xl md:text-4xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg mt-3 text-center"
        >
          <span className="inline-flex items-baseline justify-center">
            <span className="animate-typewriter overflow-hidden whitespace-nowrap inline-block">
              Resources
            </span>
            <span className="animate-cursor ml-1">|</span>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-3 text-md max-w-2xl mx-auto text-[#d40924]"
        >
          Explore curated resources from all our tech domains. Click a card to dive in!
        </motion.p>

        {/* <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
          className="mt-10 sm:mt-12 w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full origin-left"
        /> */}
      </section>

      {/* 📚 Resource Cards */}
      <section className="relative z-10">
        
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.2 }}
          >
            <ResourceCard
              title="Tech Foundations"
              pdfUrl="/pdfs/basic-tech.pdf"
              imageUrl="/images/basic-img.jpg"
              description="Get started with essential tools and workflows — learn VS Code, Git, GitHub, and how to kickstart your own projects from scratch."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="Web Development"
              pdfUrl="/pdfs/web-dev.pdf"
              imageUrl="/images/web-dev-img.jpeg"
              description="Build stunning websites and apps with HTML, CSS, JS, and modern frameworks."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="App Development"
              pdfUrl="/pdfs/app-dev.pdf"
              imageUrl="/images/app-dev-img.jpeg"
              description="Create mobile experiences for Android, iOS, and cross-platform apps."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="AI/ML"
              pdfUrl="/pdfs/aiml.pdf"
              imageUrl="/images/aiml-img.jpeg"
              description="Explore machine learning, neural networks, and smart data solutions."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="IoT"
              pdfUrl="/pdfs/iot.pdf"
              imageUrl="/images/iot-img.jpeg"
              description="Connect devices, sensors, and the world around you with IoT technologies."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="Blockchain"
              pdfUrl="/pdfs/blockchain.pdf"
              imageUrl="/images/block-chain-img.jpeg"
              description="Dive into decentralized tech, cryptocurrencies, and smart contracts."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="Cloud Computing"
              pdfUrl="/pdfs/cloud.pdf"
              imageUrl="/images/cloud-img.jpeg"
              description="Dive into decentralized tech, cryptocurrencies, and smart contracts."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="Robotics"
              pdfUrl="/pdfs/robotics.pdf"
              imageUrl="/images/robotics-img.jpeg"
              description="Dive into decentralized tech, cryptocurrencies, and smart contracts."
              onClick={setSelectedPdf}
            />
            <ResourceCard
              title="Cybersecurity"
              pdfUrl="/pdfs/cybersec.pdf"
              imageUrl="/images/cyber-sec-img.jpeg"
              description="Dive into decentralized tech, cryptocurrencies, and smart contracts."
              onClick={setSelectedPdf}
            />
          </motion.div>
      </section>

      {/* 🪟 PDF Modal (shared with Magazine) */}
      <AnimatePresence>
        {selectedPdf && (
          <PdfPreviewModal file={selectedPdf} onClose={() => setSelectedPdf(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourcesPage;













// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import ResourceCard from "./components/resourcecard"; // ✅ import your card here

// const ResourcesPage = () => {
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Fake loading shimmer (simulates data fetch)
//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 px-8 pb-40 sm:pb-48 relative overflow-hidden">
//       {/* Animated gradient background */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,0,150,0.1),transparent_70%),radial-gradient(circle_at_80%_70%,rgba(0,200,255,0.1),transparent_70%)] animate-pulse" />

//       {/* Header Section */}
//       <section className="text-center mb-16 pt-12 pb-10 relative z-10">
//         <motion.h1
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-lg mt-8 text-center"
//         >
//           <span className="inline-flex items-baseline justify-center">
//             <span className="animate-typewriter overflow-hidden whitespace-nowrap inline-block">
//               Resources
//             </span>
//             <span className="animate-cursor ml-1">|</span>
//           </span>
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.8 }}
//           className="font-orbitron mt-6 text-lg max-w-2xl mx-auto text-[#d40924]"
//         >
//           Explore curated resources from all our tech domains. Click a card to
//           dive in!
//         </motion.p>

//         <motion.div
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
//           className="mt-10 sm:mt-12 w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full origin-left"
//         />
//       </section>

//       {/* Resource Grid */}
//       <section className="relative z-10">
//         {isLoading ? (
//           // 🌈 Shimmer loader while content "loads"
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="animate-pulse bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 h-80 rounded-2xl"
//               />
//             ))}
//           </div>
//         ) : (
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ staggerChildren: 0.2 }}
//           >
//             {/* Cards */}
//             <ResourceCard
//               title="Tech Foundations"
//               pdfUrl="/pdfs/basic-tech.pdf"
//               imageUrl="/images/basic-img.jpg"
//               description="Get started with essential tools and workflows — learn VS Code, Git, GitHub, and how to kickstart your own projects from scratch."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="Web Development"
//               pdfUrl="/pdfs/web-dev.pdf"
//               imageUrl="/images/web-dev-img.jpeg"
//               description="Build stunning websites and apps with HTML, CSS, JS, and modern frameworks."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="App Development"
//               pdfUrl="/pdfs/app-dev.pdf"
//               imageUrl="/images/app-dev-img.jpeg"
//               description="Create mobile experiences for Android, iOS, and cross-platform apps."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="AI/ML"
//               pdfUrl="/pdfs/aiml.pdf"
//               imageUrl="/images/aiml-img.jpeg"
//               description="Explore machine learning, neural networks, and smart data solutions."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="IoT"
//               pdfUrl="/pdfs/iot.pdf"
//               imageUrl="/images/iot-img.jpeg"
//               description="Connect devices, sensors, and the world around you with IoT technologies."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="Blockchain"
//               pdfUrl="/pdfs/blockchain.pdf"
//               imageUrl="/images/block-chain-img.jpeg"
//               description="Dive into decentralized tech, cryptocurrencies, and smart contracts."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="Cloud Computing"
//               pdfUrl="/pdfs/cloud.pdf"
//               imageUrl="/images/cloud-img.jpeg"
//               description="Learn cloud platforms, deployment, and scalable infrastructure."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="Cyber Security"
//               pdfUrl="/pdfs/cybersec.pdf"
//               imageUrl="/images/cyber-sec-img.jpeg"
//               description="Protect networks, systems, and data with ethical hacking skills."
//               onClick={setSelectedPdf}
//             />
//             <ResourceCard
//               title="Robotics"
//               pdfUrl="/pdfs/robotics.pdf"
//               imageUrl="/images/robotics-img.jpeg"
//               description="Build and program intelligent machines for automation and innovation."
//               onClick={setSelectedPdf}
//             />
//           </motion.div>
//         )}
//       </section>

//       {/* PDF Modal */}
//       {selectedPdf && (
//         <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="relative bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-4 shadow-2xl">
//             {/* Close */}
//             <button
//               onClick={() => setSelectedPdf(null)}
//               className="absolute top-2 right-2 text-black text-2xl font-bold hover:scale-110 transition-transform"
//             >
//               ✕
//             </button>

//             {/* Download */}
//             <a
//               href={selectedPdf}
//               download
//               className="absolute top-2 left-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm shadow-lg transition-all"
//             >
//               Download PDF
//             </a>

//             {/* PDF Viewer */}
//             <iframe
//               src={selectedPdf}
//               className="w-full h-[80vh] mt-8 rounded-md border border-gray-300"
//               title="PDF Viewer"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResourcesPage;














// "use client";
// import { useState } from "react";
// import React from "react";
// import ResourceCard from "./components/resourcecard";

// const ResourcesPage = () => {
//   const [selectedPdf, setSelectedPdf] = useState(null);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white pt-24 px-8 pb-40 sm:pb-48">
//       {/* Header Section */}
//       <section className="text-center mb-16 pt-12 pb-10">
        

// <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-lg mt-8 text-center">
//   <span className="inline-flex items-baseline justify-center">
//     <span className="animate-typewriter overflow-hidden whitespace-nowrap inline-block">Resources</span>
//     <span className="animate-cursor ml-1">|</span>
//   </span>
// </h1>

        
//         {/* <h1 className="font-orbitron animate-typewriter  text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-lg mt-8 text-center">
//             Resources
//         </h1> */}
//         <p
//           className="font-orbitron mt-6 text-lg max-w-2xl mx-auto animate-slideUpFade"
//           style={{ color: "#d40924" }}
//         >
//           Explore curated resources from all our tech domains. Click a card to dive in!
//         </p>
//         <div className="mt-10 sm:mt-12 w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full" />
//       </section>

//       {/* Grid of Resource Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
//         <ResourceCard
//           title="Tech Foundations"
//           pdfUrl="/pdfs/basic-tech.pdf"
//           imageUrl="/images/basic-img.jpg"
//           description="Get started with essential tools and workflows — learn VS Code, Git, GitHub, and how to kickstart your own projects from scratch."
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="Web Development"
//           pdfUrl="/pdfs/web-dev.pdf"
//           imageUrl="/images/web-dev-img.jpeg"
//           description="Build stunning websites and apps with HTML, CSS, JS, and modern frameworks"
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="App Development"
//           pdfUrl="/pdfs/app-dev.pdf"
//           imageUrl="/images/app-dev-img.jpeg"
//           description="Create mobile experiences for Android, iOS, and cross-platform apps."
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="AI/ML"
//           pdfUrl="/pdfs/aiml.pdf"
//           imageUrl="/images/aiml-img.jpeg"
//           description="Explore machine learning, neural networks, and smart data solutions."
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="IoT"
//           pdfUrl="/pdfs/iot.pdf"
//           imageUrl="/images/iot-img.jpeg"
//           description="Connect devices, sensors, and the world around you with IoT technologies."
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="Blockchain"
//           pdfUrl="/pdfs/blockchain.pdf"
//           imageUrl="/images/block-chain-img.jpeg"
//           description="Dive into decentralized tech, cryptocurrencies, and smart contracts."
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="Cloud Computing"
//           pdfUrl="/pdfs/cloud.pdf"
//           imageUrl="/images/cloud-img.jpeg"
//           description="Learn cloud platforms, deployment, and scalable infrastructure."
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="Cyber Security"
//           pdfUrl="/pdfs/cybersec.pdf"
//           imageUrl="/images/cyber-sec-img.jpeg"
//           description="Protect networks, systems, and data with ethical hacking skills."
//           onClick={setSelectedPdf}
//         />
//         <ResourceCard
//           title="Robotics"
//           pdfUrl="/pdfs/robotics.pdf"
//           imageUrl="/images/robotics-img.jpeg"
//           description="Build and program intelligent machines for automation and innovation."
//           onClick={setSelectedPdf}
//         />
//       </div>

//       {/* PDF Modal (no style changes, just overlay) */}
//       {selectedPdf && (
//   <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//     <div className="relative bg-white rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-4">
//       {/* Close Button */}
//       <button
//         onClick={() => setSelectedPdf(null)}
//         className="absolute top-2 right-2 text-black text-2xl font-bold"
//       >
//         ✕
//       </button>

//       {/* Download Button */}
//       <a
//         href={selectedPdf}
//         download
//         className="absolute top-2 left-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm shadow-lg"
//       >
//         Download PDF
//       </a>

//       {/* PDF Viewer */}
//       <iframe
//         src={selectedPdf}
//         className="w-full h-[80vh] mt-8"
//         title="PDF Viewer"
//       ></iframe>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default ResourcesPage;

