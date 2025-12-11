import type { Event } from "@/lib/types/events";
import upcomingEvents from "./upcoming.json";
import ongoingEvents from "./ongoing.json";
import pastEvents from "./past.json";

// Static events data loaded from JSON files
export const staticEvents: Record<"upcoming" | "ongoing" | "past", Event[]> = {
  upcoming: upcomingEvents as Event[],
  ongoing: ongoingEvents as Event[],
  past: pastEvents as Event[],
};

