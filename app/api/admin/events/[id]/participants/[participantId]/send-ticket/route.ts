import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { sendEmail } from '@/lib/email/brevo';
import { getTicketTemplate } from '@/lib/email/templates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id, participantId } = await params;

    // 1. Fetch Event details using admin client
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('title, event_date, venue, email_template')
      .eq('id', id)
      .single();

    if (eventError || !event) {
      return errorResponse('Event not found', 'NOT_FOUND', 404);
    }

    // 2. Fetch Participant details
    const { data: participant, error: partError } = await supabaseAdmin
      .from('event_registrations')
      .select('id, user_name, user_email, registration_status')
      .eq('id', participantId)
      .single();

    if (partError || !participant) {
      return errorResponse('Participant not found', 'NOT_FOUND', 404);
    }

    // 3. Ensure participant is confirmed
    if (participant.registration_status !== 'confirmed') {
      return errorResponse('Cannot send ticket to unconfirmed participant', 'VALIDATION_ERROR', 400);
    }

    // 4. Generate HTML and send email
    const htmlContent = getTicketTemplate({
      participantName: participant.user_name,
      eventName: event.title,
      participantId: participant.id,
      eventDate: event.event_date ? new Date(event.event_date).toLocaleDateString('en-GB') : undefined,
      venue: event.venue || undefined,
      emailTemplate: event.email_template || undefined,
    });

    await sendEmail({
      to: [{ email: participant.user_email, name: participant.user_name }],
      subject: `Your Ticket for ${event.title}`,
      htmlContent,
    });

    // 5. Mark ticket as sent in the database
    await supabaseAdmin
      .from('event_registrations')
      .update({ ticket_sent: true })
      .eq('id', participantId);

    return successResponse({ success: true });
  } catch (error) {
    console.error('Error sending ticket email:', error);
    return errorResponse('Failed to send ticket email', 'INTERNAL_ERROR', 500);
  }
}
