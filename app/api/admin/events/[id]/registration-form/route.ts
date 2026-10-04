import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: formData, error } = await supabase
      .from('event_registration_forms')
      .select('form_fields')
      .eq('event_id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return errorResponse('Failed to fetch form', 'FETCH_ERROR', 500);
    }

    let fields = formData?.form_fields;
    
    if (!fields || fields.length === 0) {
      fields = [
        {
          id: 'base-name',
          name: 'user_name',
          label: 'Full Name',
          type: 'text',
          required: true,
          isBaseField: true,
          lockedRequired: true,
          placeholder: 'Enter your full name'
        },
        {
          id: 'base-email',
          name: 'user_email',
          label: 'Email Address',
          type: 'email',
          required: true,
          isBaseField: true,
          lockedRequired: true,
          placeholder: 'Enter your email'
        },
        {
          id: 'base-phone',
          name: 'user_phone',
          label: 'Phone Number',
          type: 'tel',
          required: false,
          isBaseField: true,
          placeholder: 'Enter your phone number'
        },
        {
          id: 'base-college',
          name: 'user_college',
          label: 'College/University Name',
          type: 'text',
          required: false,
          isBaseField: true,
          placeholder: 'Enter your college name'
        },
        {
          id: 'base-year',
          name: 'user_year',
          label: 'Year of Study',
          type: 'select',
          required: false,
          isBaseField: true,
          options: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'],
          placeholder: 'Select your year'
        },
        {
          id: 'base-csi-member',
          name: 'is_csi_member',
          label: 'Are you a CSI Member?',
          type: 'radio',
          required: false,
          isBaseField: true,
          options: ['Yes', 'No']
        }
      ];
    }

    return successResponse({ form_fields: fields });
  } catch (error) {
    console.error('Error fetching form:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { form_fields } = await request.json();

    if (!Array.isArray(form_fields)) {
      return errorResponse('Invalid form_fields format', 'VALIDATION_ERROR', 400);
    }

    const { error } = await supabase
      .from('event_registration_forms')
      .upsert(
        { event_id: id, form_fields },
        { onConflict: 'event_id' }
      );

    if (error) {
      console.error('Supabase Upsert Error:', error);
      return errorResponse('Failed to save form', 'SAVE_ERROR', 500);
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error('Error saving form:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
