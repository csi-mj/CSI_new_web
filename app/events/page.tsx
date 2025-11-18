"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import EventGrid from "./_components/EventGrid";
import PillNav from "@/components/PillNav";
import type { Event } from "@/lib/types/events";
import { BackgroundBeams } from "@/components/ui/background-beams";

type Tab = "upcoming" | "ongoing" | "past";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("ongoing");
  const [prefetchedData, setPrefetchedData] = useState<Record<Tab, Event[] | null>>({
    upcoming: null,
    ongoing: null,
    past: null,
  });
  const [prefetchTabs, setPrefetchTabs] = useState<Tab[]>([]);
  const prefetchTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  
  // Store fetched data for instant switching
  const handleDataLoaded = useCallback((tab: Tab, events: Event[]) => {
    setPrefetchedData(prev => ({ ...prev, [tab]: events }));
  }, []);

  // Prefetch adjacent tabs after a short delay by mounting hidden EventGrid
  const prefetchAdjacentTabs = useCallback((currentTab: Tab) => {
    if (prefetchTimerRef.current) {
      clearTimeout(prefetchTimerRef.current);
    }
    prefetchTimerRef.current = setTimeout(() => {
      const tabs: Tab[] = ["upcoming", "ongoing", "past"];
      const candidates = tabs.filter(t => t !== currentTab && prefetchedData[t] == null);
      setPrefetchTabs(candidates);
    }, 150);
  }, [prefetchedData]);

  // Handle tab navigation
  const handleTabChange = useCallback((newTab: Tab) => {
    setActiveTab(newTab);
    prefetchAdjacentTabs(newTab);
  }, [prefetchAdjacentTabs]);

  // Handle hash clicks
  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target && target.href && target.href.includes('#')) {
        e.preventDefault();
        const hash = target.href.split('#')[1];
        if (["upcoming", "ongoing", "past"].includes(hash)) {
          handleTabChange(hash as Tab);
        }
      }
    };

    document.addEventListener('click', handleHashClick);
    return () => {
      document.removeEventListener('click', handleHashClick);
      if (prefetchTimerRef.current) {
        clearTimeout(prefetchTimerRef.current);
      }
    };
  }, [handleTabChange]);

  // Initial prefetch for first render
  useEffect(() => {
    prefetchAdjacentTabs(activeTab);
  }, [activeTab, prefetchAdjacentTabs]);

  return (
    <section className="min-h-screen relative overflow-hidden bg-black">
      {/* Static Background */}
             <BackgroundBeams className="opacity-25" />


      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h1 className="font-orbitron text-4xl sm:text-5xl lg:text-6xl font-bold text-red-500 mb-3 sm:mb-4 tracking-tight px-4">
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

          {/* Event Grid - visible */}
          <EventGrid activeTab={activeTab} onDataLoaded={handleDataLoaded} />

          {/* Hidden prefetchers - mounted to warm EventGrid cache without UI */}
          <div style={{ display: 'none' }} aria-hidden="true">
            {prefetchTabs.map(tab => (
              <EventGrid key={`prefetch-${tab}`} activeTab={tab} onDataLoaded={handleDataLoaded} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
