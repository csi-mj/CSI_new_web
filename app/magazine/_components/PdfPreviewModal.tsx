"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { FiExternalLink, FiDownload, FiX } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PdfPreviewModal({
  file,
  onClose,
}: {
  file: { pdf: string; title: string };
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <>
      <motion.div
        className="fixed inset-0 z-[9999] bg-white/5 backdrop-blur-sm flex items-center md:items-end justify-center p-0 md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-[92%] md:w-[70%] lg:w-[55%] h-[75vh] md:h-[95vh] bg-[#0B0B0D]/60 rounded-2xl border border-white/40 overflow-hidden "
          initial={{ opacity: 0, y: 34, scale: 0.7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.7 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label={file.title}
        >

          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-[#111214]/10 border-b border-white/10 max-sm:flex-wrap">
            <h2 className="font-semibold mb-3 max-sm:text-center max-sm:w-full text-white text-xl tracking-wide">
              {file.title}
            </h2>

            <div className="max-sm:w-full flex gap-3 items-center max-sm:justify-between">

  {/* View Full Page */}
  <a
    href={file.pdf}
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-all duration-200 inline-flex items-center gap-2"
  >
    <FiExternalLink className="h-4 w-4 cursor-target cursor-pointer" />
    View Full
  </a>

  {/* Download */}
  <a
    href={file.pdf}
    download
    className="px-4 py-2 rounded-lg bg-primary/80 hover:bg-primary text-white text-sm font-medium transition-all duration-200 inline-flex items-center gap-2 cursor-target cursor-pointer"
  >
    <FiDownload className="h-4 w-4" />
    Download
  </a>

  {/* Close */}
  <button
    onClick={onClose}
    className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer duration-150"
  >
    <FiX className="h-5 w-5" />
  </button>
</div>

          </div>

          {/* PDF Viewer */}
          <div className="h-full p-3 bg-black/30">
            <div className="w-full h-full rounded-xl border border-white/10 overflow-hidden bg-[#0D0E11]">
              <div className="pdf-scroll-area h-full overflow-y-auto">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={file.pdf}
                    defaultScale={SpecialZoomLevel.PageFit}
                    theme="dark"
                  />
                </Worker>
              </div>
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* Hide internal scrollbars */}
     <style jsx global>{`
 /* PDF viewer scrollbars */
.rpv-core__viewer,
.rpv-core__inner-pages,
.rpv-core__canvas-layer,
.pdf-scroll-area {
  scrollbar-width: thin;               
  scrollbar-color: #ff3b3b #1a0000;     /* red thumb & dark track (Firefox) */
}

/* Chrome / Edge / Safari */
.rpv-core__viewer::-webkit-scrollbar,
.rpv-core__inner-pages::-webkit-scrollbar,
.rpv-core__canvas-layer::-webkit-scrollbar,
.pdf-scroll-area::-webkit-scrollbar {
  width: 8px;
}

/* Track */
.rpv-core__viewer::-webkit-scrollbar-track,
.rpv-core__inner-pages::-webkit-scrollbar-track,
.rpv-core__canvas-layer::-webkit-scrollbar-track,
.pdf-scroll-area::-webkit-scrollbar-track {
  background: rgba(255, 0, 0, 0.08); /* faint red */
  border-radius: 10px;
}

/* Thumb */
.rpv-core__viewer::-webkit-scrollbar-thumb,
.rpv-core__inner-pages::-webkit-scrollbar-thumb,
.rpv-core__canvas-layer::-webkit-scrollbar-thumb,
.pdf-scroll-area::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ff4a4a, #d90404);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

/* Hover effect */
.rpv-core__viewer::-webkit-scrollbar-thumb:hover,
.rpv-core__inner-pages::-webkit-scrollbar-thumb:hover,
.rpv-core__canvas-layer::-webkit-scrollbar-thumb:hover,
.pdf-scroll-area::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #ff7777, #ff1a1a);
}

`}</style>

    </>,
    document.body
  );
}
