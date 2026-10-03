import type { Metadata } from 'next';
import { createAuthClient } from '@/lib/supabase/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import AdminNav from './_components/AdminNav';
import AccessDenied from './_components/AccessDenied';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false }
};

export default async function AdminLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createAuthClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  // Login page renders without the shell (middleware redirects signed-in users away)
  if (!user?.email) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  const { data: admin } = await supabaseAdmin
    .from('admin_users')
    .select('email')
    .eq('email', user.email.toLowerCase())
    .maybeSingle();

  if (!admin) {
    return <AccessDenied email={user.email} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-black md:flex-row">
      <AdminNav email={user.email} />
      <main className="flex-1 p-4 md:p-8 pt-6">{children}</main>
    </div>
  );
}
