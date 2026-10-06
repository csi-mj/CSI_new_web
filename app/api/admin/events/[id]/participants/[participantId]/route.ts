import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id: eventId, participantId } = await params;

    if (!eventId || !participantId) {
      return errorResponse('Event ID and Participant ID are required', 'VALIDATION_ERROR', 400);
    }

    // Delete the participant registration
    const { error } = await supabaseAdmin
      .from('event_registrations')
      .delete()
      .eq('id', participantId)
      .eq('event_id', eventId);

    if (error) {
      console.error('Error deleting participant:', error);
      return errorResponse('Failed to delete participant', 'DB_ERROR', 500);
    }

    // Update the participant count in the events table
    const { count, error: countError } = await supabaseAdmin
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId);

    if (!countError && count !== null) {
      await supabaseAdmin
        .from('events')
        .update({ current_participants: count })
        .eq('id', eventId);
    }

    return successResponse({ success: true, message: 'Participant deleted successfully' });
  } catch (error) {
    console.error('Unexpected error deleting participant:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
