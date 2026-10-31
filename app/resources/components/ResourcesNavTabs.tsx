"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ResourceTabItem {
  id: string;
  label: string;
}

export const RESOURCE_TABS: ResourceTabItem[] = [
  { id: "languages", label: "Learn Languages" },
  { id: "dsa", label: "DSA & Problems" },
  { id: "roadmaps", label: "Developer Roadmaps" },
  { id: "systemdesign", label: "System Design" },
  { id: "projects", label: "Real-World Projects" },
  { id: "compilers", label: "Online Compilers" },
  { id: "more", label: "More" },
];

interface ResourcesNavTabsProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
  className?: string;
}

export const ResourcesNavTabs: React.FC<ResourcesNavTabsProps> = ({
  activeSection,
  onSelectSection,
  className,
}) => {
  const [showParentNav, setShowParentNav] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(72);
  const lastScrollYRef = useRef(0);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Sync with main navbar visibility and height
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navEl = document.querySelector("nav");
      if (navEl) {
        setNavbarHeight(navEl.offsetHeight);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    const handleScroll = () => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const lastScrollY = lastScrollYRef.current;

      // When near top of page, main nav is always visible
      if (currentScrollY < 80) {
        setShowParentNav(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> main nav translates up, subheader moves to top-0
        setShowParentNav(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> main nav returns, subheader sits below it
        setShowParentNav(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Auto-scroll active tab into view horizontally on smaller viewports
  useEffect(() => {
    const activeBtn = document.getElementById(`res-tab-${activeSection}`);
    if (activeBtn && tabsContainerRef.current) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeSection]);

  const activeTab = RESOURCE_TABS.find((t) => t.id === activeSection);

  return (
    <header
      id="resources-subheader"
      aria-label="Resources Subheader Navigation"
      className={cn(
        "fixed left-0 right-0 z-40 w-full transition-[top] duration-300 ease-out border-b border-border bg-background/90 backdrop-blur-2xl shadow-xs",
        className
      )}
      style={{
        top: showParentNav ? `${navbarHeight}px` : "0px",
      }}
    >
      {/* Signature CSI Accent Line across bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-2">
        {/* Left Indicator Breadcrumb using shadcn Badge */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 select-none">
          <Badge
            variant="outline"
            className="gap-1.5 py-1 px-2.5 font-medium border-white/15 bg-white/[0.05] text-muted-foreground cursor-target"
          >
            
            <span>Resources</span>
          </Badge>
        </div>

        {/* Center / Scrollable Tab Navigation matching CSI Navbar pill aesthetic */}
        <nav
          ref={tabsContainerRef}
          aria-label="Resources Sections"
          className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none no-scrollbar py-0.5 w-full lg:w-auto justify-start lg:justify-center -mx-1 px-1"
        >
          {RESOURCE_TABS.map((tab) => {
            const isActive = activeSection === tab.id;

            return (
              <Button
                key={tab.id}
                id={`res-tab-${tab.id}`}
                variant="ghost"
                size="sm"
                onClick={() => onSelectSection(tab.id)}
                className={cn(
                  "relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs sm:text-[13px] font-medium transition-all duration-200 cursor-target cursor-pointer shrink-0 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white h-8",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubheaderPill"
                    className="absolute inset-0 rounded-full bg-white/[0.1] border border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Right: Signature CSI highlighted CTA button */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Button
            id="resources-slavecode-cta"
            asChild
            className="group relative h-9 shrink-0 items-center gap-2 overflow-hidden rounded-full bg-primary px-4 text-xs sm:text-[13px] font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-white/20 cursor-target focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <a
              href="https://slavecode.codes"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>SlaveCode</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </span>
              <div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                aria-hidden="true"
              />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
