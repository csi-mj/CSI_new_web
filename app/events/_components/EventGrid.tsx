"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import type { Event } from "@/lib/types/events";

import { staticEvents } from "../_data/staticEvents";

type Tab = "upcoming" | "ongoing" | "past";

export default function EventGrid({ activeTab }: { activeTab: Tab }) {
  const [events, setEvents] = useState<Event[]>([]);

  // Load static events
  useEffect(() => {
    const tabKey = activeTab === "past" ? "past" : activeTab;
    const data = staticEvents[tabKey];
    setEvents(data);
  }, [activeTab]);

  // Empty State
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
        <div className="w-24 h-24 sm:w-32 sm:h-32 mb-6 rounded-full bg-zinc-900 border border-gray-800 flex items-center justify-center">
          <span className="text-gray-600 text-4xl font-bold">0</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
          No {activeTab} events
        </h3>
        <p className="text-gray-500 text-center max-w-md text-sm sm:text-base px-4">
          Check back later for new {activeTab} events or explore other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 px-4 md:px-12 ">
      {events.map((ev, i) => (
        <EventCard key={ev.id} event={ev} reverse={i % 2 !== 0} />
      ))}
    </div>
  );
}
