/** Single source of truth: an event's status is computed from its dates.
 *  Only "cancelled" is a manual override stored in the DB. */
export type ComputedStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface EventDates {
  status?: string | null;
  event_date: string;
  event_end_date?: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function computeEventStatus(e: EventDates, now: number = Date.now()): ComputedStatus {
  if (e.status === 'cancelled') return 'cancelled';
  const start = new Date(e.event_date).getTime();
  // Events without an end date are considered ongoing for 24h after start
  const end = e.event_end_date ? new Date(e.event_end_date).getTime() : start + DAY_MS;
  if (now < start) return 'upcoming';
  if (now <= end) return 'ongoing';
  return 'completed';
}
