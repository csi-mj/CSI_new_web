import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return errorResponse('Recruitment ID is required', 'VALIDATION_ERROR', 400);
    }

    // Delete the recruitment
    const { error } = await supabaseAdmin
      .from('recruitments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting recruitment:', error);
      return errorResponse('Failed to delete recruitment', 'DB_ERROR', 500);
    }

    return successResponse({ success: true, message: 'Recruitment deleted successfully' });
  } catch (error) {
    console.error('Unexpected error deleting recruitment:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
