import { createAuthClient } from '@/lib/supabase/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const ALLOWED_DOMAIN = '@mjcollege.ac.in';
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

async function getCollegeUser() {
  const supabase = await createAuthClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user?.email) return { error: 'Not signed in', status: 401, email: null };
  const email = user.email.toLowerCase();
  if (!email.endsWith(ALLOWED_DOMAIN)) {
    return { error: `Only ${ALLOWED_DOMAIN} college accounts can register`, status: 403, email: null };
  }
  return { error: null, status: 200, email };
}

export async function GET() {
  const { error, status, email } = await getCollegeUser();
  if (error || !email) {
    return Response.json({ error: error ?? 'Not signed in' }, { status });
  }

  const { data } = await supabaseAdmin
    .from('sih_registrations')
    .select('team_name, team_leader, roll_number, phone, email, created_at')
    .eq('email', email)
    .maybeSingle();

  return Response.json({ submission: data });
}

export async function POST(request: Request) {
  const { error, status, email } = await getCollegeUser();
  if (error || !email) {
    return Response.json({ error: error ?? 'Not signed in' }, { status });
  }

  const { data: existing } = await supabaseAdmin
    .from('sih_registrations')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (existing) {
    return Response.json({ error: 'This account has already registered a team.' }, { status: 409 });
  }

  const form = await request.formData();
  const team_name = (form.get('team_name') as string | null)?.trim();
  const team_leader = (form.get('team_leader') as string | null)?.trim();
  const roll_number = (form.get('roll_number') as string | null)?.trim();
  const phone = (form.get('phone') as string | null)?.trim();
  const file = form.get('file') as File | null;

  if (!team_name || !team_leader || !roll_number || !phone) {
    return Response.json({ error: 'All fields are required.' }, { status: 400 });
  }
  if (!/^[0-9+\-() ]{10,15}$/.test(phone)) {
    return Response.json({ error: 'Enter a valid phone number.' }, { status: 400 });
  }
  if (!file) {
    return Response.json({ error: 'Team details file is required.' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'File too large (max 10 MB).' }, { status: 400 });
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!['doc', 'docx', 'pdf'].includes(ext)) {
    return Response.json({ error: 'Upload a Word document or PDF.' }, { status: 400 });
  }

  const path = `sih/${Date.now()}-${email.split('@')[0]}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabaseAdmin.storage
    .from('media')
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (upErr) return Response.json({ error: upErr.message }, { status: 500 });

  const { data: pub } = supabaseAdmin.storage.from('media').getPublicUrl(path);

  const { error: insErr } = await supabaseAdmin.from('sih_registrations').insert({
    team_name,
    team_leader,
    roll_number,
    phone,
    email,
    file_url: pub.publicUrl
  });
  if (insErr) {
    const dup = insErr.message.includes('duplicate');
    return Response.json(
      { error: dup ? 'This account has already registered a team.' : insErr.message },
      { status: dup ? 409 : 500 }
    );
  }

  return Response.json({ success: true }, { status: 201 });
}
