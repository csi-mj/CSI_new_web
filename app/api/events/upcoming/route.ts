import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import type { UpcomingEvent } from '@/lib/types/events';

export async function GET(request: NextRequest) {
  try {
    const now = new Date().toISOString();

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .gt('event_date', now)
      .neq('status', 'cancelled')
      .eq('is_active', true)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse(
        'Failed to fetch upcoming events',
        'DATABASE_ERROR',
        500
      );
    }

    const upcomingEvents: UpcomingEvent[] = (events || []).map((event) => {
      const eventDate = new Date(event.event_date);
      const currentDate = new Date();
      const daysUntil = Math.ceil(
        (eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const spotsRemaining =
        event.max_participants !== null && event.current_participants !== null
          ? Math.max(0, event.max_participants - event.current_participants)
          : null;

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        poster_url: event.poster_url,
        status: 'upcoming' as const,
        event_date: event.event_date,
        event_end_date: event.event_end_date,
        venue: event.venue,
        category: event.category,
        is_registration_open: event.is_registration_open,
        registration_start_date: event.registration_start_date,
        registration_end_date: event.registration_end_date,
        max_participants: event.max_participants,
        current_participants: event.current_participants,
        tags: event.tags || [],
        spots_remaining: spotsRemaining,
        days_until_event: daysUntil
      };
    });

    return successResponse(upcomingEvents);
  } catch (error) {
    console.error('Unexpected error in /api/events/upcoming:', error);
    return errorResponse(
      'An unexpected error occurred while fetching upcoming events',
      'INTERNAL_ERROR',
      500
    );
  }
}

