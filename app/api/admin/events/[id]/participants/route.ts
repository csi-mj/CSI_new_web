import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from('event_registrations')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching participants:', error);
      return errorResponse('Failed to fetch participants', 'FETCH_ERROR', 500);
    }

    return successResponse({ participants: data || [] });
  } catch (error) {
    console.error('Unexpected error fetching participants:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { registration_id, status, is_attended } = body;

    if (!registration_id) {
      return errorResponse('Missing registration_id', 'VALIDATION_ERROR', 400);
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.registration_status = status;
    if (is_attended !== undefined) updates.is_attended = is_attended;

    if (Object.keys(updates).length === 1) {
      return errorResponse('Nothing to update', 'VALIDATION_ERROR', 400);
    }

    const { error } = await supabaseAdmin
      .from('event_registrations')
      .update(updates)
      .eq('id', registration_id)
      .eq('event_id', id);

    if (error) {
      console.error('Error updating participant:', error);
      return errorResponse('Failed to update participant', 'UPDATE_ERROR', 500);
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error('Unexpected error updating participant:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
