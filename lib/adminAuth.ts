import { createAuthClient } from '@/lib/supabase/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export interface AdminCheck {
  ok: boolean;
  email: string | null;
  status: number;
  message: string;
}

/** Verifies the request comes from a logged-in user whose email is in admin_users. */
export async function requireAdmin(): Promise<AdminCheck> {
  const supabase = await createAuthClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, email: null, status: 401, message: 'Not signed in' };
  }

  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('email')
    .eq('email', user.email.toLowerCase())
    .maybeSingle();

  if (error) {
    return { ok: false, email: user.email, status: 500, message: error.message };
  }
  if (!data) {
    return { ok: false, email: user.email, status: 403, message: 'Not an admin' };
  }
  return { ok: true, email: user.email, status: 200, message: 'ok' };
}

export function adminError(check: AdminCheck) {
  return Response.json({ error: check.message }, { status: check.status });
}
