import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('csi_memberships')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching memberships:', error);
      return errorResponse('Failed to fetch memberships', 'FETCH_ERROR', 500);
    }

    return successResponse({ memberships: data || [] });
  } catch (error) {
    console.error('Unexpected error fetching memberships:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { membership_id, status } = body;

    if (!membership_id) {
      return errorResponse('Missing membership_id', 'VALIDATION_ERROR', 400);
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;

    if (Object.keys(updates).length === 1) {
      return errorResponse('Nothing to update', 'VALIDATION_ERROR', 400);
    }

    const { error } = await supabaseAdmin
      .from('csi_memberships')
      .update(updates)
      .eq('id', membership_id);

    if (error) {
      console.error('Error updating membership:', error);
      return errorResponse('Failed to update membership', 'UPDATE_ERROR', 500);
    }

    return successResponse({ success: true });
  } catch (error) {
    console.error('Unexpected error updating membership:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
