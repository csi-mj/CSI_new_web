import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/utils/response';
import type { CompletedEvent } from '@/lib/types/events';

export async function GET(request: NextRequest) {
  try {
    const now = new Date().toISOString();

    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .or(`event_end_date.lt.${now},status.eq.completed`)
      .neq('status', 'cancelled')
      .eq('is_active', true)
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return errorResponse(
        'Failed to fetch completed events',
        'DATABASE_ERROR',
        500
      );
    }

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

    const completedEvents: CompletedEvent[] = (events || []).map((event: DbEvent) => {
      const completedDate = event.event_end_date
        ? new Date(event.event_end_date)
        : new Date(event.event_date);
      const currentDate = new Date();
      const daysSince = Math.floor(
        (currentDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        id: event.id,
        title: event.title,
        description: event.description,
        poster_url: event.poster_url,
        status: 'completed' as const,
        event_date: event.event_date,
        event_end_date: event.event_end_date,
        venue: event.venue,
        category: event.category,
        current_participants: event.current_participants,
        max_participants: event.max_participants,
        tags: event.tags || [],
        completed_at: event.event_end_date || event.event_date,
        days_since_completed: daysSince
      };
    });

    return successResponse(completedEvents);
  } catch (error) {
    console.error('Unexpected error in /api/events/completed:', error);
    return errorResponse(
      'An unexpected error occurred while fetching completed events',
      'INTERNAL_ERROR',
      500
    );
  }
}

