import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

async function count(table: string, filters?: Record<string, string | boolean>) {
  let q = supabaseAdmin.from(table).select('*', { count: 'exact', head: true });
  if (filters) for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
  const { count: c } = await q;
  return c ?? 0;
}

export default async function AdminDashboard() {
  const [team, events, upcoming, mags, res, admins] = await Promise.all([
    count('csi_team', { is_active: true }),
    count('events'),
    count('events', { status: 'upcoming' }),
    count('magazines'),
    count('resources'),
    count('admin_users')
  ]);

  const cards = [
    { href: '/admin/team', label: 'Active team members', value: team },
    { href: '/admin/events', label: 'Total events', value: events },
    { href: '/admin/events', label: 'Upcoming events', value: upcoming },
    { href: '/admin/magazines', label: 'Magazines', value: mags },
    { href: '/admin/resources', label: 'Resources', value: res },
    { href: '/admin/admins', label: 'Admins', value: admins }
  ];

  return (
    <div>
      <h1 className="mb-6 font-orbitron text-2xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {cards.map((c, i) => (
          <Link
            key={i}
            href={c.href}
            className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 transition hover:border-red-500/50"
          >
            <p className="text-3xl font-bold text-white">{c.value}</p>
            <p className="mt-1 text-sm text-neutral-400">{c.label}</p>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-sm text-neutral-500">
        Changes made here go live on the website immediately — no redeploy needed.
      </p>
    </div>
  );
}
