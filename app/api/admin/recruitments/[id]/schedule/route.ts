import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { sendEmail } from '@/lib/email/brevo';
import { getInterviewTemplate } from '@/lib/email/templates';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { interview_time, interview_venue } = body;

    if (!interview_time || !interview_venue) {
      return errorResponse('Missing time or venue', 'VALIDATION_ERROR', 400);
    }

    // 1. Fetch the applicant details first
    const { data: applicant, error: fetchError } = await supabaseAdmin
      .from('recruitments')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !applicant) {
      console.error('Error fetching applicant:', fetchError);
      return errorResponse('Applicant not found', 'NOT_FOUND', 404);
    }

    // 2. Format the time nicely
    const formattedTime = new Date(interview_time).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata' // assuming IST
    });

    // 3. Generate HTML email
    const htmlContent = getInterviewTemplate({
      name: applicant.name,
      team: applicant.team,
      portfolio1: applicant.portfolio_1,
      portfolio2: applicant.portfolio_2,
      time: formattedTime,
      venue: interview_venue
    });

    // 4. Send Email via Brevo
    try {
      await sendEmail({
        to: [{ email: applicant.email, name: applicant.name }],
        subject: `Interview Scheduled: CSI ${applicant.team} Team`,
        htmlContent,
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return errorResponse('Failed to send email via Brevo', 'EMAIL_ERROR', 500);
    }

    // 5. Update the DB
    const { error: updateError } = await supabaseAdmin
      .from('recruitments')
      .update({
        status: 'shortlisted',
        interview_time,
        interview_venue,
        is_email_sent: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating recruitment:', updateError);
      // We return success anyway because email was sent, but warn them
      return successResponse({ success: true, warning: 'Email sent but DB update failed.' });
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error('Unexpected error scheduling interview:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
