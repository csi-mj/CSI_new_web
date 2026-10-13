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
      return errorResponse('Membership ID is required', 'VALIDATION_ERROR', 400);
    }

    // Delete the membership
    const { error } = await supabaseAdmin
      .from('csi_memberships')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting membership:', error);
      return errorResponse('Failed to delete membership', 'DB_ERROR', 500);
    }

    return successResponse({ success: true, message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Unexpected error deleting membership:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
