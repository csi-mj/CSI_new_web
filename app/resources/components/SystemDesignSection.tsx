"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSectionIframe } from "../hooks/useSectionIframe";
import { SectionHeader } from "./SectionHeader";

interface SystemDesignSectionProps {
  className?: string;
}

export const SystemDesignSection: React.FC<SystemDesignSectionProps> = ({ className }) => {
  const { isLoading, setIsLoading, iframeHeight, iframeSrc } =
    useSectionIframe("systemdesign");

  return (
    <section
      id="systemdesign"
      className={cn("w-full space-y-6 relative overflow-hidden bg-transparent scroll-mt-36", className)}
    >
      <SectionHeader
        title="System Design"
        description="Architect scalable distributed systems, databases, and microservices with visual diagram workspaces and real-world case studies."
        ctaText="Design Systems"
        ctaHref="https://slavecode.codes/systemdesign"
        colorKey="orange"
      />

      {isLoading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-background/80 backdrop-blur-xs min-h-[500px]">
          <Loader2 className="size-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading System Design...
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
          id="systemdesign-iframe-overlay"
          href="https://slavecode.codes/systemdesign"
          target="_blank"
          rel="noopener noreferrer"
          title="Open in SlaveCode"
          className="absolute inset-0 z-10 bg-transparent cursor-pointer cursor-target"
          aria-label="Open SlaveCode System Design in a new tab"
        />

        {/* Direct borderless iframe */}
        <iframe
          id="systemdesign-iframe"
          src={iframeSrc}
          title="SlaveCode System Design"
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
