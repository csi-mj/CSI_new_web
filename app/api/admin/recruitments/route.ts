import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('recruitments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recruitments:', error);
      return errorResponse('Failed to fetch recruitments', 'FETCH_ERROR', 500);
    }

    return successResponse({ recruitments: data || [] });
  } catch (error) {
    console.error('Unexpected error fetching recruitments:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, interview_time, interview_venue, is_email_sent } = body;

    if (!id) {
      return errorResponse('Missing recruitment id', 'VALIDATION_ERROR', 400);
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (interview_time !== undefined) updates.interview_time = interview_time;
    if (interview_venue !== undefined) updates.interview_venue = interview_venue;
    if (is_email_sent !== undefined) updates.is_email_sent = is_email_sent;

    if (Object.keys(updates).length === 1) {
      return errorResponse('Nothing to update', 'VALIDATION_ERROR', 400);
    }

    const { error } = await supabaseAdmin
      .from('recruitments')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating recruitment:', error);
      return errorResponse('Failed to update recruitment', 'UPDATE_ERROR', 500);
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error('Unexpected error updating recruitment:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
