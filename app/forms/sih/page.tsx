'use client';

import { useCallback, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

const inputCls =
  'w-full rounded-lg border border-white/10 bg-neutral-900 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-red-500 focus:outline-none';

interface Submission {
  team_name: string;
  team_leader: string;
  roll_number: string;
  phone: string;
  email: string;
  created_at: string;
}

export default function SihRegistrationPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [fields, setFields] = useState({ team_name: '', team_leader: '', roll_number: '', phone: '' });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const isCollege = email?.toLowerCase().endsWith('@mjcollege.ac.in') ?? false;

  const loadSubmission = useCallback(async () => {
    try {
      const res = await fetch('/api/sih');
      if (res.ok) {
        const json = await res.json();
        setSubmission(json.submission || null);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setChecking(false);
      if (user?.email?.toLowerCase().endsWith('@mjcollege.ac.in')) loadSubmission();
    });
  }, [loadSubmission]);

  const signIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/forms/sih`,
        queryParams: { hd: 'mjcollege.ac.in', prompt: 'select_account' }
      }
    });
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setEmail(null);
    setSubmission(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!file) return setError('Please attach your team details file.');
    setBusy(true);
    const fd = new FormData();
    Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
    fd.append('file', file);
    const res = await fetch('/api/sih', { method: 'POST', body: fd });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error || 'Submission failed. Try again.');
    setDone(true);
    loadSubmission();
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24">
      <div className="mb-8 rounded-2xl border-t-4 border-red-600 bg-neutral-900/60 p-6 md:p-8">
        <h1 className="font-orbitron text-2xl font-bold text-white md:text-3xl">
          Smart India Hackathon — Registration
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-300">
          Students interested in participating in the national-level <strong>Smart India Hackathon</strong> can
          form a team of <strong>six students, including at least one female student</strong>, and register below.
          Only the <strong>team leader</strong> should fill this form, using their{' '}
          <strong>college email ID</strong> (…@mjcollege.ac.in).
        </p>
        <p className="mt-3 text-sm leading-relaxed text-neutral-300">
          Once the problem statements are uploaded on the SIH website, prepare your abstract and a 15-minute
          presentation. Winning teams from Hack Revolution (conducted by CSI &amp; E-Cell on 08-11-25) receive
          direct entry — they can update their teams to a total of six students and submit before the deadline.
        </p>
        <a
          href="/forms/Team-Details.docx"
          download
          className="mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          ⬇ Download team details template
        </a>
        <p className="mt-4 text-xs text-neutral-500">
          Md Zainuddin Naveed · Assistant Professor, CSED · +91 80191 77889
        </p>
      </div>

      {checking ? (
        <p className="text-center text-neutral-500">Checking sign-in…</p>
      ) : !email ? (
        <div className="rounded-2xl border border-white/10 bg-neutral-900/60 p-8 text-center">
          <p className="mb-6 text-sm text-neutral-300">
            Sign in with your <strong className="text-white">college Google account</strong> to register.
          </p>
          <button
            onClick={signIn}
            className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-neutral-200"
          >
            Sign in with college ID
          </button>
        </div>
      ) : !isCollege ? (
        <div className="rounded-2xl border border-red-500/30 bg-neutral-900/60 p-8 text-center">
          <p className="text-sm text-neutral-300">
            <span className="text-white">{email}</span> is not a college account. Please sign in with your{' '}
            <strong className="text-white">@mjcollege.ac.in</strong> ID (e.g. 160422733145@mjcollege.ac.in).
          </p>
          <button
            onClick={signOut}
            className="mt-6 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20"
          >
            Switch account
          </button>
        </div>
      ) : submission || done ? (
        <div className="rounded-2xl border border-green-500/30 bg-neutral-900/60 p-8">
          <h2 className="mb-4 text-lg font-bold text-green-400">✓ Registration received</h2>
          {submission && (
            <div className="space-y-1 text-sm text-neutral-300">
              <p><span className="text-neutral-500">Team:</span> {submission.team_name}</p>
              <p><span className="text-neutral-500">Leader:</span> {submission.team_leader} ({submission.roll_number})</p>
              <p><span className="text-neutral-500">Phone:</span> {submission.phone}</p>
              <p><span className="text-neutral-500">Registered as:</span> {submission.email}</p>
            </div>
          )}
          <p className="mt-4 text-xs text-neutral-500">
            One registration per team leader. For corrections, contact the coordinators.
          </p>
          <button onClick={signOut} className="mt-6 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20">
            Sign out
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5 rounded-2xl border border-white/10 bg-neutral-900/60 p-6 md:p-8">
          <p className="text-xs text-neutral-500">
            Signed in as <span className="text-neutral-300">{email}</span>{' '}
            <button type="button" onClick={signOut} className="ml-2 underline hover:text-white">switch</button>
          </p>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Team Name *</span>
            <input required className={inputCls} value={fields.team_name} onChange={(e) => setFields({ ...fields, team_name: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Team Leader *</span>
            <input required className={inputCls} value={fields.team_leader} onChange={(e) => setFields({ ...fields, team_leader: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Roll Number *</span>
            <input required className={inputCls} value={fields.roll_number} onChange={(e) => setFields({ ...fields, roll_number: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-white">Phone Number *</span>
            <input required type="tel" className={inputCls} value={fields.phone} onChange={(e) => setFields({ ...fields, phone: e.target.value })} />
          </label>
          <div>
            <span className="mb-1 block text-sm font-semibold text-white">Team Details *</span>
            <p className="mb-2 text-xs text-neutral-500">
              Fill the template above and upload it (Word or PDF, max 10 MB).
            </p>
            <input
              required
              type="file"
              accept=".doc,.docx,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-neutral-400 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-white/20"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {busy ? 'Submitting…' : 'Submit registration'}
          </button>
        </form>
      )}
    </div>
  );
}
