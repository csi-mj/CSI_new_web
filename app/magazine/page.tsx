"use client";
import React, { useState } from "react";
import GridCards, { Card } from "./_components/gridCards";
import PdfPreviewModal from "./_components/PdfPreviewModal";

const cards: Card[] = [
  { id: 1, bulletin_img:"/pdfs/edition10.png", pdf:"/pdfs/edition-10.pdf", title:"Edition 10", description:"Tech Insights Student Voices Future Vision,Where Innovation Meets Imagination", pages:1 },
  { id: 2, bulletin_img:"/pdfs/edition9.png", pdf:"/pdfs/edition-9.pdf", title:"Edition 9", description:"file", pages:2 },
  { id: 3, bulletin_img:"/pdfs/edition8.png", pdf:"/pdfs/edition-8.pdf", title:"Edition 8", description:"file", pages:5 },
  { id: 4, bulletin_img:"/pdfs/edition7.png", pdf:"/pdfs/edition-7.pdf", title:"Edition 7", description:"file", pages:3 },
  { id: 5, bulletin_img:"/pdfs/edition6.png", pdf:"/pdfs/edition-6.pdf", title:"Edition 6", description:" file", pages:1 },
  { id: 6, bulletin_img:"/pdfs/edition5.png", pdf:"/pdfs/edition-5.pdf", title:"Edition 5", description:" file", pages:1 },
  { id: 7, bulletin_img:"/pdfs/edition4.png", pdf:"/pdfs/edition-4.pdf", title:"Edition 4", description:"file", pages:1 },
  { id: 8, bulletin_img:"/pdfs/edition3.png", pdf:"/pdfs/edition-3.pdf", title:"Edition 3", description:" file", pages:1 },
  { id: 9, bulletin_img:"/pdfs/edition2.png", pdf:"/pdfs/edition-2.pdf", title:"Edition 2", description:"file", pages:1 },
  { id: 10, bulletin_img:"/pdfs/edition1.png", pdf:"/pdfs/edition-1.pdf", title:"Edition 1", description:" file", pages:1 },
  
];

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<Card | null>(null);

  return (
    // <div className="p-6">
    <div className="w-full mb-6 flex flex-col items-center">
    <div className="w-full h-[80vh] rounded-lg shadow-xl">

      <GridCards cards={cards} onSelect={(file) => setSelectedFile(file)} />

      {/* Modal */}
      {selectedFile && (
        <PdfPreviewModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
      </div>
    </div>
  );
}
