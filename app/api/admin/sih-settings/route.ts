import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { SIH_DEFAULTS } from '@/lib/sihSettings';

export async function GET() {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'sih_form')
    .maybeSingle();
  return Response.json({ ...SIH_DEFAULTS, ...(data?.value || {}) });
}

export async function PUT(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const body = await request.json();
  const value = {
    title: String(body.title || SIH_DEFAULTS.title),
    intro: String(body.intro || ''),
    details: String(body.details || ''),
    contact: String(body.contact || ''),
    template_url: String(body.template_url || SIH_DEFAULTS.template_url),
    is_open: Boolean(body.is_open)
  };
  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key: 'sih_form', value, updated_at: new Date().toISOString() });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(value);
}
