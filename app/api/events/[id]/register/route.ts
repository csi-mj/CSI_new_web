import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const formData = await request.formData();

    // 1. Verify Event exists and is active
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, is_registration_open, registration_start_date, registration_end_date, max_participants, current_participants, status')
      .eq('id', eventId)
      .eq('is_active', true)
      .single();

    if (eventError || !event) {
      return errorResponse('Event not found', 'EVENT_NOT_FOUND', 404);
    }

    // Check if registration is open
    if (!event.is_registration_open) {
      return errorResponse('Registration is not open for this event', 'REGISTRATION_CLOSED', 400);
    }

    // Check registration date window
    const now = new Date();
    if (event.registration_start_date) {
      const regStart = new Date(event.registration_start_date);
      if (now < regStart) {
        return errorResponse('Registration has not started yet', 'REGISTRATION_NOT_STARTED', 400);
      }
    }

    if (event.registration_end_date) {
      const regEnd = new Date(event.registration_end_date);
      if (now > regEnd) {
        return errorResponse('Registration has ended', 'REGISTRATION_ENDED', 400);
      }
    }

    // Check capacity
    if (event.max_participants && event.max_participants > 0) {
      if (event.current_participants >= event.max_participants) {
        return errorResponse('Event has reached maximum capacity', 'EVENT_FULL', 400);
      }
    }

    // 2. Validate CSI Membership if claimed
    const userEmail = formData.get('user_email')?.toString();
    const isCsiMemberStr = formData.get('is_csi_member')?.toString();
    const isCsiMember = isCsiMemberStr === 'true' || isCsiMemberStr === 'Yes' || isCsiMemberStr === 'yes';

    if (isCsiMember && userEmail) {
      const { data: membership, error: membershipError } = await supabaseAdmin
        .from('csi_memberships')
        .select('status')
        .eq('email', userEmail)
        .single();

      if (membershipError || !membership) {
        return errorResponse(
          "We couldn't find a CSI membership for this email. Please use the email you bought the membership with, or proceed without claiming membership.",
          'MEMBERSHIP_NOT_FOUND',
          400
        );
      }

      if (membership.status === 'pending') {
        return errorResponse(
          'Your CSI membership is still pending verification by our team. Please wait for it to be verified before claiming member benefits.',
          'MEMBERSHIP_PENDING',
          400
        );
      }

      if (membership.status === 'rejected') {
        return errorResponse(
          'Your CSI membership application was rejected. Please contact support or purchase a new membership.',
          'MEMBERSHIP_REJECTED',
          400
        );
      }
    }

    // 3. Handle File Upload (if any)
    let payment_screenshot_url = null;
    const file = formData.get('payment_screenshot') as File | null;

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return errorResponse('Screenshot is too large (Max 10MB)', 'FILE_TOO_LARGE', 400);
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 30);
      const path = `registrations/${eventId}/${Date.now()}-${safeName}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('media')
        .upload(path, buffer, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error('File upload failed:', uploadError);
        return errorResponse('Failed to upload payment screenshot', 'UPLOAD_FAILED', 500);
      }

      const { data: urlData } = supabaseAdmin.storage.from('media').getPublicUrl(path);
      payment_screenshot_url = urlData.publicUrl;
    }

    // 3. Extract and parse fields
    const baseFields = ['user_name', 'user_email', 'user_phone', 'user_college', 'user_year', 'is_csi_member', 'transaction_id', 'payment_mode'];
    
    const dbPayload: any = {
      event_id: eventId,
      payment_screenshot_url,
    };
    
    const additional_info: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (key === 'payment_screenshot') continue; 

      if (baseFields.includes(key)) {
        if (key === 'is_csi_member') {
          dbPayload[key] = value === 'true' || value === 'Yes' || value === 'yes';
        } else {
          dbPayload[key] = value.toString();
        }
      } else {
        additional_info[key] = value.toString();
      }
    }

    dbPayload.additional_info = additional_info;

    // Validate required fields
    if (!dbPayload.user_name || !dbPayload.user_email) {
      return errorResponse('Name and Email are required', 'MISSING_FIELDS', 400);
    }

    // 4. Insert into database using admin client since public might not have insert perms
    const { data: registration, error: dbError } = await supabaseAdmin
      .from('event_registrations')
      .insert(dbPayload)
      .select('id, registration_status')
      .single();

    if (dbError) {
      console.error('Database insertion error:', dbError);
      if (dbError.code === '23505') { 
        return errorResponse('You have already registered for this event with this email.', 'ALREADY_REGISTERED', 400);
      }
      return errorResponse('Failed to save registration', 'DB_ERROR', 500);
    }

    // 5. Increment current_participants
    const { data: currentEvent } = await supabaseAdmin
      .from('events')
      .select('current_participants')
      .eq('id', eventId)
      .single();
      
    if (currentEvent) {
      await supabaseAdmin
        .from('events')
        .update({ current_participants: (currentEvent.current_participants || 0) + 1 })
        .eq('id', eventId);
    }

    return successResponse({ 
      registration_id: registration.id, 
      status: registration.registration_status,
      message: 'Registration successful' 
    });
    
  } catch (error: any) {
    console.error('Unexpected error during registration:', error);
    return errorResponse(error.message || 'An unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}
