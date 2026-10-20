import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { sendRegistrationWebhook } from '@/lib/webhook/registrationWebhook';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; participantId: string }> }
) {
  try {
    const { id, participantId } = await params;

    // 1. Fetch Event details
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (eventError || !event) {
      return errorResponse('Event not found', 'NOT_FOUND', 404);
    }

    // 2. Fetch Participant details
    const { data: participant, error: partError } = await supabaseAdmin
      .from('event_registrations')
      .select('*')
      .eq('id', participantId)
      .single();

    if (partError || !participant) {
      return errorResponse('Participant not found', 'NOT_FOUND', 404);
    }

    // 3. Ensure participant is confirmed
    if (participant.registration_status !== 'confirmed') {
      return errorResponse('Cannot send WhatsApp ticket to unconfirmed participant', 'VALIDATION_ERROR', 400);
    }

    // 4. Construct form data and payment payload for the webhook
    const webhookFormData: Record<string, string | boolean> = {
      user_name: participant.user_name || '',
      user_email: participant.user_email || '',
      user_phone: participant.user_phone || '',
      user_college: participant.user_college || '',
      user_year: participant.user_year || '',
      is_csi_member: !!participant.is_csi_member,
    };

    // Flatten custom form builder additional_info
    if (participant.additional_info && typeof participant.additional_info === 'object') {
      for (const [key, value] of Object.entries(participant.additional_info)) {
        webhookFormData[key] = value as string | boolean;
      }
    }

    const webhookEvent = {
      id: event.id,
      title: event.title,
      event_date: event.event_date ?? null,
      event_end_date: event.event_end_date ?? null,
      venue: event.venue ?? null,
      category: event.category ?? null,
      whatsapp_group_url: event.whatsapp_group_url ?? null
    };

    const webhookPayment = {
      is_paid: !!event.is_paid,
      entry_fee: event.entry_fee ?? null,
      csi_entry_fee: event.csi_entry_fee ?? null,
      mode: participant.payment_mode ?? null,
      transaction_id: participant.transaction_id ?? null,
      screenshot_url: participant.payment_screenshot_url ?? null
    };

    // 5. Send to n8n webhook
    const result = await sendRegistrationWebhook(
      webhookEvent,
      participant.id,
      participant.registration_status,
      webhookFormData,
      webhookPayment
    );

    if (!result.ok) {
      return errorResponse(result.error || 'Failed to send WhatsApp message via webhook', 'WEBHOOK_ERROR', 500);
    }

    // 6. Mark whatsapp as sent in database
    await supabaseAdmin
      .from('event_registrations')
      .update({ whatsapp_sent: true })
      .eq('id', participantId);

    return successResponse({ success: true });
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return errorResponse(error.message || 'Failed to send WhatsApp message', 'INTERNAL_ERROR', 500);
  }
}
