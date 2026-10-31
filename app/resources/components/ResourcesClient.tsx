"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ResourcesNavTabs } from "./ResourcesNavTabs";
import { AcademySection } from "./AcademySection";
import { DsaSection } from "./DsaSection";
import { RoadmapsSection } from "./RoadmapsSection";
import { SystemDesignSection } from "./SystemDesignSection";
import { ProjectsSection } from "./ProjectsSection";
import { CompilersSection } from "./CompilersSection";
import { MoreSection } from "./MoreSection";

export const ResourcesClient: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("languages");

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -135; // Space for the top navbar + fixed subheader
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  // Scroll-spy observer to highlight the current section in view
  useEffect(() => {
    const sectionIds = [
      "languages",
      "dsa",
      "roadmaps",
      "systemdesign",
      "projects",
      "compilers",
      "more",
    ];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0.1,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 w-full relative">
      {/* Fixed Full-Width Subheader (Pinned directly under main header) */}
      <ResourcesNavTabs
        activeSection={activeSection}
        onSelectSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 sm:pt-40 lg:pt-44 space-y-24">
        {/* Section 1: Academy (Learn Languages) */}
        <AcademySection />

        {/* Section 2: DSA Roadmap & Problems */}
        <DsaSection />

        {/* Section 3: Developer Roadmaps & Resources */}
        <RoadmapsSection />

        {/* Section 4: System Design */}
        <SystemDesignSection />

        {/* Section 5: Real-World Projects */}
        <ProjectsSection />

        {/* Section 6: Online Compilers */}
        <CompilersSection />

        {/* Section 7: More (Main Hero Section) */}
        <MoreSection />
      </div>
    </div>
  );
};
