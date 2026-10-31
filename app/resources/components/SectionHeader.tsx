"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  iconColors,
  borderColors,
  translucentBgColors,
  type IconColor,
} from "@/config/colors";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaHref: string;
  colorKey?: IconColor;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  ctaText = "Open on SlaveCode",
  ctaHref,
  colorKey = "blue",
  className,
}) => {
  const buttonId = `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}-cta-btn`;

  const activeIconColor = iconColors[colorKey] || iconColors.blue;
  const activeBorderColor = borderColors[colorKey] || borderColors.blue;
  const activeBgTranslucent =
    translucentBgColors[colorKey] || translucentBgColors.blue;

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3.5 border-b border-border/40",
        className
      )}
    >
      {/* Left: Compact Title in Tones Color + 2-line Description with clean vertical centering */}
      <div className="space-y-1 max-w-2xl">
        <h2 className={cn("text-xl sm:text-2xl font-bold tracking-tight", activeIconColor)}>
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Right: More prominent CTA button with fatter border-2, translucent bg, and tone icon */}
      <div className="shrink-0 self-start sm:self-center">
        <Button
          id={buttonId}
          variant="outline"
          className={cn(
            "h-11 sm:h-12 px-6 sm:px-7 rounded-2xl gap-2.5 text-sm sm:text-base font-semibold border-2 transition-all hover:scale-[1.02] cursor-pointer shadow-sm backdrop-blur-md text-foreground hover:brightness-115 cursor-target",
            activeBorderColor,
            activeBgTranslucent
          )}
          asChild
        >
          <a href={ctaHref} target="_blank" rel="noopener noreferrer">
            <span>{ctaText}</span>
            <ExternalLink className={cn("size-4 sm:size-4.5 shrink-0 transition-transform", activeIconColor)} />
          </a>
        </Button>
      </div>
    </div>
  );
};
