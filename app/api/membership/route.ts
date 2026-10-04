import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    
    if (!name || !email) {
      return errorResponse('Name and Email are required', 'MISSING_FIELDS', 400);
    }

    let payment_screenshot_url: string | null = null;
    const file = formData.get('payment_screenshot') as File | null;

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return errorResponse('Screenshot size exceeds 5MB limit', 'FILE_TOO_LARGE', 400);
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-').slice(0, 30);
      const path = `memberships/${Date.now()}-${safeName}.${ext}`;

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

    const dbPayload = {
      name,
      email,
      contact: formData.get('contact')?.toString() || null,
      roll_no: formData.get('roll_no')?.toString() || null,
      branch: formData.get('branch')?.toString() || null,
      year: formData.get('year')?.toString() || null,
      about_yourself: formData.get('about_yourself')?.toString() || null,
      queries: formData.get('queries')?.toString() || null,
      payment_mode: formData.get('payment_mode')?.toString() || 'online',
      payment_screenshot_url,
      status: 'pending'
    };

    const { error: insertError } = await supabaseAdmin
      .from('csi_memberships')
      .insert([dbPayload]);

    if (insertError) {
      console.error('Error inserting membership:', insertError);
      if (insertError.code === '23505') { 
        return errorResponse('You have already applied for membership with this email or roll number.', 'ALREADY_REGISTERED', 400);
      }
      return errorResponse('Failed to submit membership registration', 'INSERT_FAILED', 500);
    }

    return successResponse({ success: true, message: 'Membership registration submitted successfully' });
  } catch (error) {
    console.error('Unexpected error during membership registration:', error);
    return errorResponse('Unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}
