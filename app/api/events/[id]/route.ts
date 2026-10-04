import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import type { BaseEvent } from '@/lib/types/events';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = id;

    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('is_active', true)
      .single();

    if (eventError || !event) {
      return errorResponse('Event not found', 'EVENT_NOT_FOUND', 404);
    }

    if (event.is_paid && !event.payment_qr_url) {
      const { data: settings } = await supabase
        .from('platform_settings')
        .select('default_payment_qr_url')
        .eq('id', 1)
        .single();

      if (settings?.default_payment_qr_url) {
        event.payment_qr_url = settings.default_payment_qr_url;
      }
    }

    return successResponse(event as BaseEvent);
  } catch (error) {
    console.error('Unexpected error in /api/events/[id]:', error);
    return errorResponse(
      'An unexpected error occurred while fetching event details',
      'INTERNAL_ERROR',
      500
    );
  }
}
