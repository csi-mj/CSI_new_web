import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/utils/response';
import { registrationRequestSchema } from '@/lib/api/utils/validation';
import type { RegistrationResponse } from '@/lib/types/events';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = id;

    // Parse and validate request body
    const body = await request.json();
    const validationResult = registrationRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse(
        'Invalid registration data',
        'VALIDATION_ERROR',
        400,
        {
          errors: validationResult.error.issues
        }
      );
    }

    const registrationData = validationResult.data;

    // Separate standard fields from extra fields
    const standardFieldNames = ['user_name', 'user_email', 'user_phone', 'user_college', 'user_year'];
    const standardFields: Record<string, any> = {};
    const extraFields: Record<string, any> = {};

    // Extract standard fields and extra fields
    Object.keys(registrationData).forEach((key) => {
      if (standardFieldNames.includes(key)) {
        standardFields[key] = registrationData[key];
      } else {
        // Extra fields go into additional_info
        extraFields[key] = registrationData[key];
      }
    });

    // Check if event exists and is active
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
      return errorResponse(
        'Registration is not open for this event',
        'REGISTRATION_CLOSED',
        400
      );
    }

    // Check registration date window
    const now = new Date();
    if (event.registration_start_date) {
      const regStart = new Date(event.registration_start_date);
      if (now < regStart) {
        return errorResponse(
          'Registration has not started yet',
          'REGISTRATION_NOT_STARTED',
          400
        );
      }
    }

    if (event.registration_end_date) {
      const regEnd = new Date(event.registration_end_date);
      if (now > regEnd) {
        return errorResponse(
          'Registration has ended',
          'REGISTRATION_ENDED',
          400
        );
      }
    }

    // Check if event is upcoming (can't register for completed events)
    if (event.status === 'completed') {
      return errorResponse(
        'Cannot register for a completed event',
        'EVENT_COMPLETED',
        400
      );
    }

    // Check if event is full
    if (
      event.max_participants !== null &&
      event.current_participants !== null &&
      event.current_participants >= event.max_participants
    ) {
      return errorResponse(
        'Event is full. No spots available',
        'EVENT_FULL',
        400
      );
    }

    // Check if user is already registered (prevent duplicates)
    const { data: existingRegistration, error: checkError } = await supabase
      .from('event_registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_email', standardFields.user_email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" which is expected for new registrations
      console.error('Error checking existing registration:', checkError);
      return errorResponse(
        'Failed to check existing registration',
        'DATABASE_ERROR',
        500
      );
    }

    if (existingRegistration) {
      return errorResponse(
        'You are already registered for this event',
        'ALREADY_REGISTERED',
        409
      );
    }

    // Determine registration status
    // Only set as waitlisted if event is already FULL
    // If event has space, register as pending/confirmed
    let registrationStatus: 'pending' | 'confirmed' | 'waitlisted' = 'pending';
    const isEventFull =
      event.max_participants !== null &&
      event.current_participants !== null &&
      event.current_participants >= event.max_participants;

    if (isEventFull) {
      registrationStatus = 'waitlisted';
    }

    // Insert registration
    const { data: newRegistration, error: insertError } = await supabase
      .from('event_registrations')
      .insert({
        event_id: eventId,
        user_name: standardFields.user_name,
        user_email: standardFields.user_email,
        user_phone: standardFields.user_phone || null,
        user_college: standardFields.user_college || null,
        user_year: standardFields.user_year || null,
        additional_info: Object.keys(extraFields).length > 0 ? extraFields : null,
        registration_status: registrationStatus
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting registration:', insertError);
      return errorResponse(
        'Failed to register for event',
        'DATABASE_ERROR',
        500
      );
    }

    // Update event's current_participants count
    // Only increment if event is NOT full (waitlisted registrations don't count toward capacity)
    if (!isEventFull) {
      const newParticipantCount = (event.current_participants || 0) + 1;
      const becomesFull =
        event.max_participants !== null &&
        newParticipantCount >= event.max_participants;

      // Update participant count and close registration if event becomes full
      const updateData: { current_participants: number; is_registration_open?: boolean } = {
        current_participants: newParticipantCount
      };

      // Auto-close registration when event reaches full capacity
      if (becomesFull) {
        updateData.is_registration_open = false;
      }

      const { error: updateError } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', eventId);

      if (updateError) {
        console.error('Error updating participant count:', updateError);
        // Don't fail the request, just log the error
      }
    }

    // Build response
    const response: RegistrationResponse = {
      registration_id: newRegistration.id,
      status: registrationStatus,
      message:
        registrationStatus === 'waitlisted'
          ? 'You have been added to the waitlist. We will notify you if a spot becomes available.'
          : 'Registration successful! Confirmation details will be sent to your email.'
    };

    return successResponse(response, 201);
  } catch (error) {
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return errorResponse('Invalid JSON in request body', 'INVALID_JSON', 400);
    }

    console.error('Unexpected error in /api/events/[id]/register:', error);
    return errorResponse(
      'An unexpected error occurred while processing registration',
      'INTERNAL_ERROR',
      500
    );
  }
}

