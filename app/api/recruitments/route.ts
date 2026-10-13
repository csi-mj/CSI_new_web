import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const roll_no = formData.get('roll_no')?.toString();

    if (!name || !email || !roll_no) {
      return errorResponse(
        'Name, Email, and Roll Number are required',
        'MISSING_FIELDS',
        400
      );
    }

    // Check if user already applied with this email or roll number
    const { data: existingUsers, error: checkError } = await supabaseAdmin
      .from('recruitments')
      .select('email, roll_no')
      .or(`email.eq.${email},roll_no.eq.${roll_no}`)
      .limit(1);

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      if (existingUser.email === email) {
        return errorResponse(
          'An application with this email already exists.',
          'ALREADY_REGISTERED',
          400
        );
      }
      if (existingUser.roll_no === roll_no) {
        return errorResponse(
          'An application with this roll number already exists.',
          'ALREADY_REGISTERED',
          400
        );
      }
    }

    const isCsiMember = formData.get('is_csi_member') === 'true';

    // If they claim to be a CSI member, verify against csi_memberships table
    if (isCsiMember) {
      const { data: membership, error: membershipError } = await supabaseAdmin
        .from('csi_memberships')
        .select('status')
        .eq('email', email)
        .maybeSingle();
        
      if (membershipError || !membership) {
        return errorResponse(
          "We couldn't find a CSI membership for this email. Please use the email you bought the membership with, or select No for CSI Member.",
          'MEMBERSHIP_NOT_FOUND',
          400
        );
      }

      if (membership.status === 'pending') {
        return errorResponse(
          'Your CSI membership is still pending verification by our team. Please wait for it to be verified before applying as a member.',
          'MEMBERSHIP_PENDING',
          400
        );
      }

      if (membership.status === 'rejected') {
        return errorResponse(
          'Your CSI membership application was rejected. Please purchase a new membership or select No for CSI Member.',
          'MEMBERSHIP_REJECTED',
          400
        );
      }
    }

    let resume_url: string | null = null;
    const file = formData.get('resume') as File | null;

    if (file && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return errorResponse(
          'Resume size exceeds 5MB limit',
          'FILE_TOO_LARGE',
          400
        );
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const safeName = file.name
        .replace(/\.[^.]+$/, '')
        .replace(/[^a-zA-Z0-9-_]/g, '-')
        .slice(0, 30);
      const path = `resumes/${Date.now()}-${safeName}.${ext}`;

      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabaseAdmin.storage
        .from('media')
        .upload(path, buffer, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error('File upload failed:', uploadError);
        return errorResponse('Failed to upload resume', 'UPLOAD_FAILED', 500);
      }

      const { data: urlData } = supabaseAdmin.storage
        .from('media')
        .getPublicUrl(path);
      resume_url = urlData.publicUrl;
    }

    const dbPayload = {
      name,
      email,
      phone: formData.get('contact')?.toString() || '',
      roll_no,
      branch: formData.get('branch')?.toString() || '',
      year: formData.get('year')?.toString() || '',
      team: formData.get('team')?.toString() || 'execom',
      portfolio_1: formData.get('portfolio_1')?.toString() || '',
      portfolio_2: formData.get('portfolio_2')?.toString() || null,
      resume_url,
      is_csi_member: isCsiMember,
      status: 'pending',
      is_email_sent: false
    };

    const { error: insertError } = await supabaseAdmin
      .from('recruitments')
      .insert([dbPayload]);

    if (insertError) {
      console.error('Error inserting recruitment:', insertError);
      if (insertError.code === '23505') {
        return errorResponse(
          'You have already submitted an application with this email or roll number.',
          'ALREADY_REGISTERED',
          400
        );
      }
      return errorResponse(
        'Failed to submit application',
        'INSERT_FAILED',
        500
      );
    }

    return successResponse({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Unexpected error during recruitment submission:', error);
    return errorResponse('Unexpected error occurred', 'INTERNAL_ERROR', 500);
  }
}
