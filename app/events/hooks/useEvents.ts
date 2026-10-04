import { useQuery } from '@tanstack/react-query';
import type { Event } from "@/lib/types/events";

type Tab = "upcoming" | "ongoing" | "past";

const endpointFor: Record<Tab, string> = {
  upcoming: "/api/events/upcoming",
  ongoing: "/api/events/ongoing",
  past: "/api/events/completed",
};

export function useEvents(activeTab: Tab) {
  return useQuery<Event[]>({
    queryKey: ['events', activeTab],
    queryFn: async () => {
      const res = await fetch(endpointFor[activeTab]);
      if (!res.ok) {
        throw new Error(`Failed to fetch ${activeTab} events`);
      }
      const json = await res.json();
      return (Array.isArray(json) ? json : json.data || []) as Event[];
    },
  });
}
