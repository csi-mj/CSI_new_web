"use client";

import { Worker, Viewer,SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function PdfPreviewModal({
  file,
  onClose,
}: {
  file: { pdf: string; title: string };
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 ">
      <div className="relative bg-black rounded-xl shadow-xl p-4 overflow-hidden w-[50%] h-[90vh] relative">

        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-gray-900 border-b">
          <h2 className="font-semibold text-white text-lg">{file.title}</h2>

          <div className="flex gap-3 relative">

            {/* Download Button */}
            <a
              href={file.pdf}
              download
              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm shadow-lg"
            >
              Download PDF
            </a>
            

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-xl font-bold text-gray-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="h-full overflow-hidden p-3  rounded h-[90%] relative">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            
          {/* <Worker workerUrl="/pdf.worker.min.js"> */}
            <Viewer fileUrl={file.pdf} 
           defaultScale={SpecialZoomLevel.PageFit}
           theme= 'dark'
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}
