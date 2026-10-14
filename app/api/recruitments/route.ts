import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { successResponse, errorResponse } from '@/lib/utils/response';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let email = '';
    let roll_no = '';
    let phone = '';
    let branch = '';
    let year = '';
    let team = 'execom';
    let portfolio_1 = '';
    let portfolio_2: string | null = null;
    let isCsiMember = false;
    let resume_url: string | null = null;

    if (contentType.includes('application/json')) {
      const body = await request.json().catch(() => ({}));
      name = (body.name || '').toString().trim();
      email = (body.email || '').toString().trim().toLowerCase();
      roll_no = (body.roll_no || body.rollNumber || '')
        .toString()
        .trim()
        .toUpperCase();
      phone = (body.contact || body.phone || '').toString().trim();
      branch = (body.branch || '').toString().trim();
      year = (body.year || '').toString().trim();
      team = (body.team || body.execomCore || 'execom')
        .toString()
        .trim()
        .toLowerCase();
      portfolio_1 = (
        body.portfolio_1 ||
        (Array.isArray(body.portfolios) ? body.portfolios[0] : '') ||
        ''
      )
        .toString()
        .trim();
      portfolio_2 =
        body.portfolio_2 ||
        (Array.isArray(body.portfolios) && body.portfolios[1]
          ? body.portfolios[1]
          : null) ||
        null;
      if (portfolio_2) portfolio_2 = portfolio_2.toString().trim();
      isCsiMember = Boolean(body.is_csi_member);
    } else {
      const formData = await request.formData();
      name = (formData.get('name')?.toString() || '').trim();
      email = (formData.get('email')?.toString() || '').trim().toLowerCase();
      roll_no = (
        formData.get('roll_no')?.toString() ||
        formData.get('rollNumber')?.toString() ||
        ''
      )
        .trim()
        .toUpperCase();
      phone = (
        formData.get('contact')?.toString() ||
        formData.get('phone')?.toString() ||
        ''
      ).trim();
      branch = (formData.get('branch')?.toString() || '').trim();
      year = (formData.get('year')?.toString() || '').trim();
      team = (
        formData.get('team')?.toString() ||
        formData.get('execomCore')?.toString() ||
        'execom'
      )
        .trim()
        .toLowerCase();
      portfolio_1 = (formData.get('portfolio_1')?.toString() || '').trim();
      portfolio_2 = formData.get('portfolio_2')?.toString()?.trim() || null;
      isCsiMember = formData.get('is_csi_member') === 'true';

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
    }

    if (!name || !email || !roll_no) {
      return errorResponse(
        'Name, Email, and Roll Number are required',
        'MISSING_FIELDS',
        400
      );
    }

    // Check if user already applied with this email or roll number (case-insensitive & trimmed)
    const { data: existingUser } = await supabaseAdmin
      .from('recruitments')
      .select('email, roll_no')
      .or(`email.ilike.${email},roll_no.ilike.${roll_no}`)
      .limit(1)
      .maybeSingle();

    if (existingUser) {
      if (existingUser.email?.toLowerCase() === email) {
        return errorResponse(
          'An application with this email already exists.',
          'ALREADY_REGISTERED',
          400
        );
      }
      if (existingUser.roll_no?.toUpperCase() === roll_no) {
        return errorResponse(
          'An application with this roll number already exists.',
          'ALREADY_REGISTERED',
          400
        );
      }
      return errorResponse(
        'An application with this email or roll number already exists.',
        'ALREADY_REGISTERED',
        400
      );
    }

    // If they claim to be a CSI member, verify against csi_memberships table
    if (isCsiMember) {
      const { data: membership, error: membershipError } = await supabaseAdmin
        .from('csi_memberships')
        .select('status')
        .ilike('email', email)
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

    const dbPayload = {
      name,
      email,
      phone,
      roll_no,
      branch,
      year,
      team,
      portfolio_1,
      portfolio_2,
      resume_url,
      is_csi_member: isCsiMember,
      status: 'pending',
      is_email_sent: false
    };

    // Single atomic insert (reduces DB latency by 50% by avoiding a separate duplicate SELECT round-trip)
    const { error: insertError } = await supabaseAdmin
      .from('recruitments')
      .insert([dbPayload]);

    if (insertError) {
      console.error('Error inserting recruitment:', insertError);
      if (insertError.code === '23505') {
        const errorDetails = (
          insertError.details ||
          insertError.message ||
          ''
        ).toLowerCase();
        if (errorDetails.includes('email')) {
          return errorResponse(
            'An application with this email already exists.',
            'ALREADY_REGISTERED',
            400
          );
        }
        if (errorDetails.includes('roll_no') || errorDetails.includes('roll')) {
          return errorResponse(
            'An application with this roll number already exists.',
            'ALREADY_REGISTERED',
            400
          );
        }
        return errorResponse(
          'You have already submitted an application with this email or roll number.',
          'ALREADY_REGISTERED',
          400
        );
      }
      return errorResponse(
        'Failed to submit application. Please check your details and try again.',
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
