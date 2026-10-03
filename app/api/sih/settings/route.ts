import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { SIH_DEFAULTS } from '@/lib/sihSettings';

export async function GET() {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', 'sih_form')
    .maybeSingle();

  return Response.json({ ...SIH_DEFAULTS, ...(data?.value || {}) });
}
