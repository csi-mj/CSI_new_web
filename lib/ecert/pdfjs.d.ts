/**
 * pdfjs-dist ships its bundler-friendly worker as a plain JS module without
 * type declarations for this exact subpath — declare it so the dynamic import
 * (rasterizing certificate PDFs) typechecks.
 */
declare module 'pdfjs-dist/build/pdf.worker.entry' {
  const entry: unknown;
  export default entry;
}