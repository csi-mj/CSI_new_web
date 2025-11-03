import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/utils/response';
import type { EventMetadata } from '@/lib/types/events';

export async function GET(request: NextRequest) {
  try {
    const now = new Date().toISOString();

    // Get total events count (only active events)
    const { count: totalEvents, error: totalError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (totalError) {
      console.error('Error fetching total events:', totalError);
      return errorResponse(
        'Failed to fetch event metadata',
        'DATABASE_ERROR',
        500
      );
    }

    // Get counts by status (only active events)
    const { data: statusCounts, error: statusError } = await supabase
      .from('events')
      .select('status')
      .eq('is_active', true);

    if (statusError) {
      console.error('Error fetching status counts:', statusError);
      return errorResponse(
        'Failed to fetch event metadata',
        'DATABASE_ERROR',
        500
      );
    }

    // Count events by status
    const statusGroups = statusCounts?.reduce(
      (acc, event) => {
        acc[event.status] = (acc[event.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ) || {};

    // Calculate ongoing events (events that are currently happening)
    const { count: ongoingCount, error: ongoingError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .lte('event_date', now)
      .gte('event_end_date', now);

    if (ongoingError) {
      console.error('Error fetching ongoing events:', ongoingError);
    }

    // Count upcoming events with registration open
    const { count: upcomingWithRegOpen, error: regOpenError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('status', 'upcoming')
      .eq('is_registration_open', true)
      .gte('event_date', now);

    if (regOpenError) {
      console.error('Error fetching upcoming with registration open:', regOpenError);
    }

    // Calculate total registrations (sum of current_participants from all active events)
    const { data: allEvents, error: participantsError } = await supabase
      .from('events')
      .select('current_participants')
      .eq('is_active', true);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
    }

    const totalRegistrations =
      allEvents?.reduce(
        (sum, event) => sum + (event.current_participants || 0),
        0
      ) || 0;

    // Build metadata object
    const metadata: EventMetadata = {
      total_events: totalEvents || 0,
      upcoming_count: statusGroups['upcoming'] || 0,
      completed_count: statusGroups['completed'] || 0,
      ongoing_count: ongoingCount || 0,
      cancelled_count: statusGroups['cancelled'] || 0,
      total_registrations: totalRegistrations,
      upcoming_with_registration_open: upcomingWithRegOpen || 0,
      last_updated: new Date().toISOString()
    };

    return successResponse(metadata);
  } catch (error) {
    console.error('Unexpected error in /api/events:', error);
    return errorResponse(
      'An unexpected error occurred while fetching event metadata',
      'INTERNAL_ERROR',
      500
    );
  }
}

