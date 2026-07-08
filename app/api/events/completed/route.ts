import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { computeEventStatus } from '@/lib/eventStatus';
import type { CompletedEvent } from '@/lib/types/events';

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse('Failed to fetch completed events', 'DATABASE_ERROR', 500);
    }

    const now = Date.now();
    const completed: CompletedEvent[] = (events || [])
      .filter((e) => computeEventStatus(e, now) === 'completed')
      .map((event) => ({
        ...event,
        status: 'completed' as const,
        tags: event.tags || [],
        completed_at: event.event_end_date || event.event_date,
        days_since_completed: Math.floor(
          (now - new Date(event.event_end_date || event.event_date).getTime()) / (1000 * 60 * 60 * 24)
        )
      }));

    return successResponse(completed);
  } catch (error) {
    console.error('Unexpected error in /api/events/completed:', error);
    return errorResponse('An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}
