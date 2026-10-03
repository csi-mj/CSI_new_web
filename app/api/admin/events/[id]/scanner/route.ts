import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: currentEventId } = await params;
    const body = await request.json();
    const { registration_id } = body;

    if (!registration_id) {
      return errorResponse('Invalid QR Code (Missing ID)', 'VALIDATION_ERROR', 400);
    }

    // 1. Fetch the participant to perform security checks
    const { data: participant, error: fetchError } = await supabaseAdmin
      .from('event_registrations')
      .select('id, event_id, user_name, registration_status, is_attended')
      .eq('id', registration_id)
      .single();

    // Check 1: Does the ticket even exist in the database?
    if (fetchError || !participant) {
      return errorResponse('Invalid Ticket - Not Found in Database', 'NOT_FOUND', 404);
    }

    // Check 2: Does this ticket belong to the current event being scanned?
    if (participant.event_id !== currentEventId) {
      return errorResponse('Invalid Ticket - Belongs to a different event!', 'VALIDATION_ERROR', 400);
    }

    // Check 3: Is their registration actually approved/confirmed?
    if (participant.registration_status !== 'confirmed') {
      return errorResponse(`Ticket Not Confirmed (Status: ${participant.registration_status})`, 'VALIDATION_ERROR', 400);
    }

    // Check 4: Have they already checked in?
    if (participant.is_attended) {
      return errorResponse(`Already Checked In! (${participant.user_name})`, 'VALIDATION_ERROR', 400);
    }

    // If all checks pass, mark them as attended!
    const { error: updateError } = await supabaseAdmin
      .from('event_registrations')
      .update({ is_attended: true, updated_at: new Date().toISOString() })
      .eq('id', registration_id);

    if (updateError) {
      console.error('Error updating attendance:', updateError);
      return errorResponse('Failed to mark attendance in database', 'UPDATE_ERROR', 500);
    }

    // Return success with the user's name so the UI can display it
    return successResponse({ participantName: participant.user_name });
  } catch (error) {
    console.error('Unexpected error during QR scan:', error);
    return errorResponse('Unexpected server error during scan', 'INTERNAL_ERROR', 500);
  }
}
