import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { computeEventStatus } from '@/lib/eventStatus';
import type { OngoingEvent } from '@/lib/types/events';

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch ongoing events', 'DATABASE_ERROR', 500);
    }

    const now = Date.now();
    const ongoing: OngoingEvent[] = (events || [])
      .filter((e) => computeEventStatus(e, now) === 'ongoing')
      .map((event) => ({
        ...event,
        status: 'ongoing' as const,
        tags: event.tags || [],
        started_at: event.event_date,
        ends_at: event.event_end_date,
        hours_remaining: event.event_end_date
          ? Math.max(0, Math.round((new Date(event.event_end_date).getTime() - now) / (1000 * 60 * 60)))
          : null,
        registration_status: event.is_registration_open ? ('open' as const) : ('closed' as const),
        try_on_spot: false
      }));

    return successResponse(ongoing);
  } catch (error) {
    console.error('Unexpected error in /api/events/ongoing:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}
