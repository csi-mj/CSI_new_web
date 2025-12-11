import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';
import type { RegistrationForm, RegistrationFormField } from '@/lib/types/events';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = id;

    // Fetch event to check if it exists and is active
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, title, is_registration_open')
      .eq('id', eventId)
      .eq('is_active', true)
      .single();

    if (eventError || !event) {
      return errorResponse('Event not found', 'EVENT_NOT_FOUND', 404);
    }

    // Fetch form fields from event_registration_forms table
    const { data: formData, error: formError } = await supabase
      .from('event_registration_forms')
      .select('form_fields')
      .eq('event_id', eventId)
      .single();

    let formFields: RegistrationFormField[];

    if (formError || !formData) {
      // If no custom form exists, return default form fields based on event_registrations table columns
      formFields = [
        {
          name: 'user_name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          name: 'user_email',
          label: 'Email',
          type: 'email',
          required: true,
          placeholder: 'Enter your email address'
        },
        {
          name: 'user_phone',
          label: 'Phone Number',
          type: 'tel',
          required: false,
          placeholder: 'Enter your phone number'
        },
        {
          name: 'user_college',
          label: 'College Name',
          type: 'text',
          required: false,
          placeholder: 'Enter your college name'
        },
        {
          name: 'user_year',
          label: 'Year of Study',
          type: 'select',
          required: false,
          options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'],
          placeholder: 'Select your year'
        }
      ];
    } else {
      // Use form fields from database
      formFields = formData.form_fields as RegistrationFormField[];
    }

    const registrationForm: RegistrationForm = {
      event_id: eventId,
      form_fields: formFields
    };

    return successResponse(registrationForm);
  } catch (error) {
    console.error('Unexpected error in /api/events/[id]/registration-form:', error);
    return errorResponse(
      'An unexpected error occurred while fetching registration form',
      'INTERNAL_ERROR',
      500
    );
  }
}

