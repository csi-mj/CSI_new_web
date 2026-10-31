"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionIframe } from "../hooks/useSectionIframe";
import { SectionHeader } from "./SectionHeader";

interface MoreSectionProps {
  className?: string;
}

export const MoreSection: React.FC<MoreSectionProps> = ({ className }) => {
  const { isLoading, setIsLoading, iframeHeight, iframeSrc } =
    useSectionIframe("hero");

  return (
    <section
      id="more"
      className={cn("w-full space-y-6 relative overflow-hidden bg-transparent scroll-mt-36", className)}
    >
      <SectionHeader
        title="SlaveCode Ecosystem"
        description="Explore the full competitive programming platform, community arenas, contests, and live engineering tools."
        ctaText="Visit SlaveCode"
        ctaHref="https://slavecode.codes"
        colorKey="indigo"
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-xs min-h-[500px]">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading SlaveCode Hero...
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
          id="more-iframe-overlay"
          href="https://slavecode.codes"
          target="_blank"
          rel="noopener noreferrer"
          title="Open in SlaveCode"
          className="absolute inset-0 z-10 bg-transparent cursor-pointer cursor-target"
          aria-label="Open SlaveCode in a new tab"
        />

        {/* Direct borderless iframe */}
        <iframe
          id="more-iframe"
          src={iframeSrc}
          title="SlaveCode Hero Showcase"
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

