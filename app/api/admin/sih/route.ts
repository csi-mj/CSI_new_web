import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';

export async function GET() {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { data, error } = await supabaseAdmin
    .from('sih_registrations')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function DELETE(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { id } = await request.json();
  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });
  const { error } = await supabaseAdmin.from('sih_registrations').delete().eq('id', id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
