import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/utils/response';

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') {
      return errorResponse('Failed to fetch settings', 'FETCH_ERROR', 500);
    }

    return successResponse(data || {});
  } catch (error) {
    console.error('Error fetching settings:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Ensure id is always 1 for the singleton
    const payload = {
      ...body,
      id: 1,
    };

    const { data, error } = await supabase
      .from('platform_settings')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase Upsert Error:', error);
      return errorResponse('Failed to save settings', 'SAVE_ERROR', 500);
    }

    return successResponse(data);
  } catch (error) {
    console.error('Error saving settings:', error);
    return errorResponse('Unexpected error', 'INTERNAL_ERROR', 500);
  }
}
