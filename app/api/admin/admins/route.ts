import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';

export async function GET() {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { email } = await request.json();
  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email is required' }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .insert({ email: email.toLowerCase().trim(), added_by: check.email })
    .select()
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { email } = await request.json();
  if (!email) return Response.json({ error: 'email is required' }, { status: 400 });
  if (email.toLowerCase() === check.email?.toLowerCase()) {
    return Response.json({ error: 'You cannot remove yourself' }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from('admin_users').delete().eq('email', email.toLowerCase());
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
