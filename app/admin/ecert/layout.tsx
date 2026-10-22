import type { ReactNode } from 'react';
import HowToGuide from './_components/HowToGuide';

/**
 * Shared shell for every /admin/ecert page (grid, wizard, designer, send).
 * Mounts the glowing "How to Use" guide button exactly once, top-left beside
 * the sidebar — available on all subpages without duplicating it per page.
 */
export default function EcertLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HowToGuide />
      {children}
    </>
  );
}