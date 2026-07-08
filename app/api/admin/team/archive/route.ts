import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';

/** Archives the current team: marks all active members inactive.
 *  New members added afterwards (with a new team_year) become the current team. */
export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { error } = await supabaseAdmin
    .from('csi_team')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('is_active', true);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
