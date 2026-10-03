'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export default function AccessDenied({ email }: { email: string }) {
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="max-w-md rounded-2xl border border-white/10 bg-neutral-900/60 p-8 text-center">
        <h1 className="text-xl font-bold text-white mb-2">Access denied</h1>
        <p className="text-sm text-neutral-400 mb-6">
          <span className="text-white">{email}</span> is signed in but doesn&apos;t have admin access.
          Ask an existing CSI admin to add your email in the Admins section.
        </p>
        <button
          onClick={signOut}
          className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
        >
          Sign out and use a different account
        </button>
      </div>
    </div>
  );
}
