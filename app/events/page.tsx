"use client";

import { useState, useEffect } from "react";
import EventGrid from "./_components/EventGrid";
import PillNav from "@/components/PillNav";

type Tab = "upcoming" | "ongoing" | "past";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ongoing");

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

  const tabItems = [
    { label: "Upcoming", href: "#upcoming" },
    { label: "Ongoing", href: "#ongoing" },
    { label: "Past", href: "#past" },
  ];

  // Handle tab clicks
  useEffect(() => {
    const handleHashClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const hash = target.href.split('#')[1];
        if (['upcoming', 'ongoing', 'past'].includes(hash)) {
          setActiveTab(hash as Tab);
        }
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => document.removeEventListener('click', handleHashClick);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Static Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight px-4">
              {headings[activeTab].title}
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4 leading-relaxed">
              {headings[activeTab].subtitle}
            </p>
          </div>

          {/* Pill Nav Tabs */}
          <div className="flex justify-center mb-12 sm:mb-16 px-4">
            <PillNav
              logo=""
              items={tabItems}
              activeHref={`#${activeTab}`}
              baseColor="#EF4444"
              pillColor="rgba(30, 30, 30, 0.6)"
              hoveredPillTextColor="#FFFFFF"
              pillTextColor="#6B7280"
              activePillColor="#EF4444"
              activePillTextColor="#FFFFFF"
              initialLoadAnimation={false}
            />
          </div>

          {/* Event Grid */}
          <EventGrid activeTab={activeTab} />
        </div>
      </div>
    </section>
  );
}
