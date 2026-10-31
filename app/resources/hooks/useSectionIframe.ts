"use client";

import { useState, useEffect } from "react";

export const SLAVECODE_BASE_URL =
  process.env.NEXT_PUBLIC_SLAVECODE_URL || "https://slavecode.codes";

interface UseSectionIframeOptions {
  defaultHeight?: number;
  minHeight?: number;
  buffer?: number;
}

/**
 * Reusable hook to handle dynamic height sync, isolated embed rendering, and loading state for SlaveCode section iframes.
 *
 * @param sectionId The target section identifier on the SlaveCode homepage (e.g. "academy", "roadmap", "resources", "systemdesign", "projects")
 * @param options Optional configuration for default height, minimum threshold, and safety buffer
 */
export function useSectionIframe(
  sectionId: string,
  options: UseSectionIframeOptions = {}
) {
  const { defaultHeight = 900, minHeight = 100, buffer = 20 } = options;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [iframeHeight, setIframeHeight] = useState<number>(defaultHeight);

  // Listen for dynamic section height from SlaveCode via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "SECTION_HEIGHT" &&
        event.data?.section === sectionId &&
        typeof event.data?.height === "number" &&
        event.data.height > minHeight
      ) {
        const targetHeight = event.data.height + buffer;
        setIframeHeight((prev) => {
          if (Math.abs(targetHeight - prev) > 12) {
            return targetHeight;
          }
          return prev;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sectionId, minHeight, buffer]);

  // Uses isolated embed mode: loads strictly that section starting at top: 0px
  const iframeSrc = `${SLAVECODE_BASE_URL}/?embed=${sectionId}`;

  return {
    isLoading,
    setIsLoading,
    iframeHeight,
    iframeSrc,
  };
}
