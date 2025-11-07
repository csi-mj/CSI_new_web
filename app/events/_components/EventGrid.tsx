"use client";

import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import type { Event } from "@/lib/types/events";

type Tab = "upcoming" | "ongoing" | "past";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

function isApiResponse<T>(obj: unknown): obj is ApiResponse<T> {
  return typeof obj === "object" && obj !== null && "success" in obj && "data" in obj;
}

// simple module-level cache shared across mounts
const eventsCache: Partial<Record<Tab, Event[]>> = {};

export default function EventGrid({ activeTab, onDataLoaded }: { activeTab: Tab; onDataLoaded?: (tab: Tab, events: Event[]) => void }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch events
  useEffect(() => {
    const controller = new AbortController();
    const fetchEvents = async () => {
      setError(null);

      // serve from cache if present
      const cached = eventsCache[activeTab];
      if (cached) {
        setEvents(cached);
        return;
      }

      setLoading(true);

      try {
        const endpoint =
          activeTab === "past" ? "/api/events/completed" : `/api/events/${activeTab}`;

        const res = await fetch(endpoint, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }

        const json = (await res.json()) as unknown;
        const data = isApiResponse<Event[]>(json)
          ? json.data
          : Array.isArray(json)
          ? (json as Event[])
          : (() => {
              throw new Error("Unexpected response format");
            })();
        eventsCache[activeTab] = data;
        setEvents(data);
        onDataLoaded?.(activeTab, data);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    return () => controller.abort();
  }, [activeTab, onDataLoaded]);

  // Skeleton Loading
  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-10">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="flex flex-col md:flex-row gap-4 sm:gap-6 border border-gray-800 bg-zinc-950 rounded-xl sm:rounded-2xl p-4 sm:p-6"
          >
            <div className="w-full md:w-2/5 h-48 sm:h-72 bg-gray-800 rounded-lg sm:rounded-xl animate-pulse" />
            <div className="w-full md:w-3/5 space-y-3 sm:space-y-4">
              <div className="h-6 sm:h-8 bg-gray-800 rounded w-3/4 animate-pulse" />
              <div className="h-3 sm:h-4 bg-gray-800 rounded w-full animate-pulse" />
              <div className="h-3 sm:h-4 bg-gray-800 rounded w-5/6 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="border border-red-600/30 bg-zinc-950 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center max-w-md w-full">
          <h3 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">Error</h3>
          <p className="text-gray-400 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    );
  }

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
    <div className="space-y-6 sm:space-y-10">
      {events.map((ev, i) => (
        <EventCard key={ev.id} event={ev} reverse={i % 2 !== 0} />
      ))}
    </div>
  );
}
