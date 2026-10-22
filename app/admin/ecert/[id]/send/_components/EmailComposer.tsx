'use client';

import { useMemo, useState } from 'react';
import { Mail, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/admin/_components/ui';
import type { DataColumn } from '@/lib/ecert/types';
import {
  EMAIL_BUILTIN_TOKENS,
  substituteTokens,
  tokensUsed,
  type TokenContext
} from '@/lib/ecert/tokens';

/**
 * Email composer — plain text, WYSIWYG-faithful.
 * The admin types normally: line breaks, blank lines, spacing and emojis all
 * replicate exactly into the sent email (rendered server-side inside a
 * white-space: pre-wrap escaped container). Only {{column}} placeholders are
 * parsed; anything else is protected from HTML injection.
 */
export default function EmailComposer({
  subject,
  body,
  columns,
  sample,
  allRows,
  useLetterhead,
  onToggleLetterhead,
  onSave,
  saving
}: {
  subject: string;
  body: string;
  columns: DataColumn[];
  /** First recipient's token context — powers the live sample preview. */
  sample: TokenContext | null;
  /** All imported rows (builtin values merged in) — chip de-duplication. */
  allRows?: Record<string, string>[];
  /** Official CSI letterhead (header banner + contact footer) — default on. */
  useLetterhead?: boolean;
  onToggleLetterhead?: (use: boolean) => void;
  onSave: (subject: string, body: string) => void;
  saving?: boolean;
}) {
  const [sub, setSub] = useState(subject);
  const [bd, setBd] = useState(body || defaultBody());

  const isLegacyHtml = /<\/?(?:p|br|div|b|strong|i|em|u|span|h[1-6])\b/i.test(bd);

  const usable = useMemo(() => {
    // builtins come from the shared token contract (lib/ecert/tokens.ts);
    // sheet columns follow and are hidden when they merely duplicate a builtin
    // across the imported rows (e.g. a canvas-bound `Name` column vs {{participant_name}})
    const builtins: readonly string[] = EMAIL_BUILTIN_TOKENS;
    const columnChips = (columns ?? [])
      .map((c) => c.name)
      .filter((c) => {
        const ci = c.toLowerCase();
        if (builtins.includes(ci)) return false;
        if (!allRows?.length) return true;
        return !builtins.some((b) => matchesEveryRow(c, b, allRows));
      });
    return [...builtins, ...columnChips];
  }, [columns, allRows]);

  function matchesEveryRow(a: string, b: string, rows: Record<string, string>[]): boolean {
    return rows.slice(0, 50).every((row) => resolveValue(a, row) === resolveValue(b, row));
  }

  function resolveValue(chip: string, row: Record<string, string>): string {
    const match = Object.keys(row).find((c) => c.toLowerCase() === chip.toLowerCase());
    return match ? row[match] : '';
  }

  const missingVars = useMemo(() => {
    const known = new Set(usable.map((u) => u.toLowerCase()));
    return tokensUsed(sub, bd).filter((k) => !known.has(k.toLowerCase()));
  }, [usable, sub, bd]);

  const previewSubject = sample ? substituteTokens(sub, sample) : sub;
  const previewText = sample ? substituteTokens(bd, sample) : bd;

  const insertAtCursor = (token: string) => {
    setBd((b) => `${b}${b && !b.endsWith('\n') ? '\n' : ''}{{${token}}}`);
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-neutral-900 p-4">
      <div className="flex items-center gap-2">
        <Mail size={16} className="text-red-400" />
        <h3 className="text-sm font-bold text-white">Email message</h3>
        <button
          onClick={() => onSave(sub, bd)}
          disabled={saving}
          className="ml-auto flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
        >
          {saving ? <Save size={12} className="animate-pulse" /> : <Save size={12} />} Save email
        </button>
      </div>

      {sample ? (
        <div className="rounded-lg border border-white/10 bg-neutral-800/60 p-2.5 text-[11px] text-neutral-400">
          Type <span className="font-mono text-neutral-200">{'{{column}}'}</span> wherever the participant&apos;s value should appear (click to insert):
          <div className="mt-2 flex flex-wrap gap-1">
            {usable.map((c) => (
              <button
                key={c}
                onClick={() => insertAtCursor(c)}
                className="rounded-full border border-white/10 bg-neutral-900 px-2 py-0.5 font-mono text-[10px] text-neutral-300 hover:border-red-500/50 hover:text-white"
                title={`Insert {{${c}}}`}
              >
                {'{{'}{c}{'}}'}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300">
          Import recipients first — then the variable list appears here.
        </p>
      )}

      {missingVars.length > 0 && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300">
          Unknown placeholder{missingVars.length !== 1 ? 's' : ''}: {missingVars.map((m) => `{{${m}}}`).join(', ')} — these will be empty in sent emails.
        </p>
      )}

      {/* official letterhead toggle — configurable like the registration emails */}
      {onToggleLetterhead && (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-800/60 px-3 py-2.5">
          <div className="pr-3">
            <p className="text-xs font-semibold text-white">Official letterhead</p>
            <p className="text-[10px] text-neutral-500">Sends inside the branded shell (CSI header banner + contact footer managed in Admin → Settings) — like the registration/ticket emails.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!!useLetterhead}
            onClick={() => onToggleLetterhead(!(useLetterhead !== false))}
            className={`relative h-5 w-9 shrink-0 rounded-full transition ${useLetterhead !== false ? 'bg-emerald-500' : 'bg-neutral-600'}`}
          >
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${useLetterhead !== false ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Subject</span>
        <input
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          placeholder="Your e-certificate — {{participant_name}}"
          className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          Body — just type normally
        </span>
        <textarea
          value={bd}
          onChange={(e) => setBd(e.target.value)}
          rows={9}
          placeholder={'Dear {{participant_name}},\n\nCongratulations! Your e-certificate is attached.\n\n— CSI MJCET'}
          className="w-full rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-sm leading-relaxed text-white"
        />
        <span className="mt-1 block text-[10px] text-neutral-500">
          ✍️ No HTML needed — line breaks, empty lines, spacing and emojis are kept exactly in the email. (Newlines in the subject line are not possible — email standard.)
        </span>
      </label>

      {isLegacyHtml && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300">
          This body was saved earlier in HTML format and will be sent as-is. To switch to simple typing, clear the body and write normally.
        </p>
      )}

      <details className="group">
        <summary className="cursor-pointer text-xs font-semibold text-neutral-400 hover:text-white">Live sample preview (first recipient&apos;s data)</summary>
        <div className="mt-2 space-y-2 rounded-lg border border-white/10 bg-neutral-800 p-3">
          <p className="text-xs"><span className="text-neutral-500">Subject:</span> {previewSubject}</p>
          {isLegacyHtml ? (
            // eslint-disable-next-line react/no-danger
            <div className="prose prose-invert prose-sm max-w-none text-xs" dangerouslySetInnerHTML={{ __html: previewText }} />
          ) : (
            <div className="whitespace-pre-wrap break-words text-xs text-neutral-200">{previewText}</div>
          )}
        </div>
      </details>

      <p className="text-[10px] text-neutral-500">
        The rendered certificate is attached automatically. (Single-brace {'{columns}'} are canvas-only placeholders; {'{{double-brace}}'} are email-only.)
      </p>
    </div>
  );
}

function defaultBody(): string {
  return [
    'Dear {{participant_name}},',
    '',
    'Congratulations! 🎉 We are pleased to share your e-certificate — it is attached to this email.',
    '',
    'Warm regards,',
    'CSI MJCET Student Chapter'
  ].join('\n');
}

