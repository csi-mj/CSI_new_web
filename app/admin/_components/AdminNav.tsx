'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/browser';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/team', label: 'Team' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/magazines', label: 'Magazines' },
  { href: '/admin/resources', label: 'Resources' },
  { href: '/admin/sih', label: 'SIH' },
  { href: '/admin/admins', label: 'Admins' }
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const navLinks = (onClick?: () => void) =>
    links.map((l) => (
      <Link
        key={l.href}
        href={l.href}
        onClick={onClick}
        className={`block rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
          isActive(l.href) ? 'bg-red-600 text-white' : 'text-neutral-400 hover:bg-white/10 hover:text-white'
        }`}
      >
        {l.label}
      </Link>
    ));

  return (
    <>
      {/* ---------- Mobile top bar ---------- */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-neutral-950 px-4 py-3 md:hidden">
        <div>
          <p className="font-orbitron text-base font-bold text-white">CSI Admin</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* ---------- Mobile drawer ---------- */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 flex h-full w-64 flex-col border-l border-white/10 bg-neutral-950 p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-orbitron text-base font-bold text-white">CSI Admin</p>
                <p className="truncate text-xs text-neutral-500" title={email}>{email}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-lg bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">{navLinks(() => setOpen(false))}</nav>
            <button
              onClick={signOut}
              className="mt-auto rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* ---------- Desktop sidebar ---------- */}
      <aside className="hidden min-h-screen w-56 flex-col border-r border-white/10 bg-neutral-950 px-4 py-6 md:flex">
        <div className="mb-6 px-2">
          <p className="font-orbitron text-lg font-bold text-white">CSI Admin</p>
          <p className="mt-1 truncate text-xs text-neutral-500" title={email}>{email}</p>
        </div>
        <nav className="flex flex-col gap-1">{navLinks()}</nav>
        <button
          onClick={signOut}
          className="mt-auto rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-neutral-400 transition hover:bg-white/10 hover:text-white"
        >
          Sign out
        </button>
      </aside>
    </>
  );
}
