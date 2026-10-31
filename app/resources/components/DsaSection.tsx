"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionIframe } from "../hooks/useSectionIframe";
import { SectionHeader } from "./SectionHeader";

interface DsaSectionProps {
  className?: string;
}

export const DsaSection: React.FC<DsaSectionProps> = ({ className }) => {
  const { isLoading, setIsLoading, iframeHeight, iframeSrc } =
    useSectionIframe("roadmap");

  return (
    <section
      id="dsa"
      className={cn("w-full space-y-6 relative overflow-hidden bg-transparent scroll-mt-36", className)}
    >
      <SectionHeader
        title="DSA & Problems"
        description="Follow progressive data structure trees from arrays to dynamic programming, backed by our Judge0 online code runner."
        ctaText="Practice DSA"
        ctaHref="https://slavecode.codes/roadmap"
        colorKey="purple"
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-xs min-h-[500px]">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading DSA Roadmap...
          </p>
        </div>
      )}

      {/* Frame Container dynamically matching the exact section height */}
      <div
        className="relative w-full transition-[height] duration-200 ease-out"
        style={{ height: `${iframeHeight}px` }}
      >
        {/* Clickable overlay opening SlaveCode */}
        <a
          id="dsa-iframe-overlay"
          href="https://slavecode.codes/roadmap"
          target="_blank"
          rel="noopener noreferrer"
          title="Open in SlaveCode"
          className="absolute inset-0 z-10 bg-transparent cursor-pointer cursor-target"
          aria-label="Open SlaveCode DSA in a new tab"
        />

        {/* Direct borderless iframe */}
        <iframe
          id="dsa-iframe"
          src={iframeSrc}
          title="SlaveCode DSA Roadmap"
          scrolling="no"
          className="w-full h-full border-0 bg-transparent block overflow-hidden"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </section>
  );
};
