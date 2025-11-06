"use client";
import React, { useState } from "react";
import GridCards, { Card } from "./_components/gridCards";
import PdfPreviewModal from "./_components/PdfPreviewModal";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { motion, AnimatePresence } from "framer-motion"; 

const cards: Card[] = [
  { id: 1, bulletin_img: "/pdfs/edition10.png", pdf: "/pdfs/edition-10.pdf", title: "Edition 10", description: "Tech Insights Student Voices Future Vision,Where Innovation Meets Imagination", pages: 1 },
  { id: 2, bulletin_img: "/pdfs/edition9.png", pdf: "/pdfs/edition-9.pdf", title: "Edition 9", description: "file", pages: 2 },
  { id: 3, bulletin_img: "/pdfs/edition8.png", pdf: "/pdfs/edition-8.pdf", title: "Edition 8", description: "file", pages: 5 },
  { id: 4, bulletin_img: "/pdfs/edition7.png", pdf: "/pdfs/edition-7.pdf", title: "Edition 7", description: "file", pages: 3 },
  { id: 5, bulletin_img: "/pdfs/edition6.png", pdf: "/pdfs/edition-6.pdf", title: "Edition 6", description: " file", pages: 1 },
  { id: 6, bulletin_img: "/pdfs/edition5.png", pdf: "/pdfs/edition-5.pdf", title: "Edition 5", description: " file", pages: 1 },
  { id: 7, bulletin_img: "/pdfs/edition4.png", pdf: "/pdfs/edition-4.pdf", title: "Edition 4", description: "file", pages: 1 },
  { id: 8, bulletin_img: "/pdfs/edition3.png", pdf: "/pdfs/edition-3.pdf", title: "Edition 3", description: " file", pages: 1 },
  { id: 9, bulletin_img: "/pdfs/edition2.png", pdf: "/pdfs/edition-2.pdf", title: "Edition 2", description: "file", pages: 1 },
  { id: 10, bulletin_img: "/pdfs/edition1.png", pdf: "/pdfs/edition-1.pdf", title: "Edition 1", description: " file", pages: 1 },
];

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<Card | null>(null);

  return (
    <div className="w-full mb-6 flex flex-col items-center">
      <div className="w-full px-6">

        <div className="w-full flex justify-center">
          <TextGenerateEffect
            words="CSI Bulletins"
            duration={1}
            delay={0.4}
            className="text-primary font-silkscreen pb-0 text-4xl md:text-6xl font-semibold tracking-tight my-6 mb-9"
          />
        </div>

        <motion.div
          initial={{ opacity: 1, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, ease: "easeOut" }}
          viewport={{ once: true, amount: 0 }}
        >
          <GridCards cards={cards} onSelect={(file) => setSelectedFile(file)} />
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedFile && (
            <PdfPreviewModal
              file={selectedFile}
              onClose={() => setSelectedFile(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
