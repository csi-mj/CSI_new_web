import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const revalidate = 60;

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
