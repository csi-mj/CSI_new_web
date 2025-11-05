import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/utils/response';
import type { OngoingEvent } from '@/lib/types/events';

export async function GET(request: NextRequest) {
  try {
    const now = new Date().toISOString();

    // Query for ongoing events
    // Conditions:
    // - event_date <= NOW() AND (event_end_date >= NOW() OR event_end_date IS NULL)
    // - status != 'cancelled'
    // - is_active = true
    // Order by event_date DESC (most recently started first)
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .lte('event_date', now)
      .or(`event_end_date.gte.${now},event_end_date.is.null`)
      .neq('status', 'cancelled')
      .eq('is_active', true)
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse(
        'Failed to fetch ongoing events',
        'DATABASE_ERROR',
        500
      );
    }

    // Filter out completed events (events that have ended)
    const nowDate = new Date();
    type DbEvent = {
      id: string;
      title: string;
      description: string | null;
      poster_url: string | null;
      status: string;
      event_date: string;
      event_end_date: string | null;
      venue: string | null;
      category: string | null;
      current_participants: number | null;
      max_participants: number | null;
      tags?: string[] | null;
    };

    const ongoingEvents: OngoingEvent[] = (events || [])
      .filter((event: DbEvent) => {
        // If event has an end_date, check if it hasn't ended yet
        if (event.event_end_date) {
          return new Date(event.event_end_date) >= nowDate;
        }
        // If no end_date, event is ongoing if it has started
        return true;
      })
      .map((event: DbEvent) => {
        // Calculate hours remaining
        const endDate = event.event_end_date
          ? new Date(event.event_end_date)
          : null;
        const hoursRemaining = endDate
          ? Math.max(0, Math.ceil((endDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60)))
          : null;

        // Check if there are spots available for on-the-spot registration
        const hasAvailableSpots =
          event.max_participants === null ||
          event.current_participants === null ||
          event.current_participants < event.max_participants;

        return {
          id: event.id,
          title: event.title,
          description: event.description ?? '',
          poster_url: event.poster_url ?? '',
          status: 'ongoing' as const,
          event_date: event.event_date,
          event_end_date: event.event_end_date,
          venue: event.venue ?? '',
          category: event.category ?? '',
          current_participants: event.current_participants,
          max_participants: event.max_participants,
          tags: event.tags || [],
          started_at: event.event_date,
          ends_at: event.event_end_date,
          hours_remaining: hoursRemaining,
          registration_status: 'closed' as const,
          try_on_spot: hasAvailableSpots
        };
      });

    return successResponse(ongoingEvents);
  } catch (error) {
    console.error('Unexpected error in /api/events/ongoing:', error);
    return errorResponse(
      'An unexpected error occurred while fetching ongoing events',
      'INTERNAL_ERROR',
      500
    );
  }
}

