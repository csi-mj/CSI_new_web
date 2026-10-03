import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { computeEventStatus } from '@/lib/eventStatus';
import type { UpcomingEvent } from '@/lib/types/events';

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch upcoming events', 'DATABASE_ERROR', 500);
    }

    const now = Date.now();
    const upcoming: UpcomingEvent[] = (events || [])
      .filter((e) => computeEventStatus(e, now) === 'upcoming')
      .map((event) => ({
        ...event,
        status: 'upcoming' as const,
        tags: event.tags || [],
        spots_remaining:
          event.max_participants !== null && event.current_participants !== null
            ? Math.max(0, event.max_participants - event.current_participants)
            : null,
        days_until_event: Math.ceil((new Date(event.event_date).getTime() - now) / (1000 * 60 * 60 * 24))
      }));

    return successResponse(upcoming);
  } catch (error) {
    console.error('Unexpected error in /api/events/upcoming:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}
