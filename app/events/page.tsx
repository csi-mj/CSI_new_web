"use client";

import { useState, useEffect } from "react";
import EventGrid from "./_components/EventGrid";
import EventsTabs from "./_components/EventsTabs";
import { BackgroundBeams } from "@/components/ui/background-beams";

type Tab = "upcoming" | "ongoing" | "past";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("past");

  const headings: Record<Tab, { title: string; subtitle: string }> = {
    upcoming: {
      title: "Upcoming Events",
      subtitle: "Discover cutting-edge experiences that push boundaries and inspire innovation."
    },
    ongoing: {
      title: "Ongoing Events",
      subtitle: "Explore the vibrant activities happening right now across our campus."
    },
    past: {
      title: "Past Events",
      subtitle: "Look back at the incredible moments and milestones from our journey."
    },
  };

  // Handle hash changes from URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (["upcoming", "ongoing", "past"].includes(hash)) {
        setActiveTab(hash as Tab);
      }
    };

    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
  };

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Static Background */}



      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold text-red-500 mb-3 sm:mb-4 tracking-tight px-4">
              {headings[activeTab].title}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4 leading-relaxed">
              {headings[activeTab].subtitle}
            </p>
          </div>

          {/* Custom Tabs */}
          <div className="flex justify-center mb-12 sm:mb-16 px-4">
            <EventsTabs activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Event Grid */}
          <EventGrid activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
}
