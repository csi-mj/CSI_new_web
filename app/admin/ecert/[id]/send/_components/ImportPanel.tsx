'use client';

import { useRef, useState } from 'react';
import { Database, FileUp, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/admin/_components/ui';
import { parseSheetFile } from '@/lib/ecert/sheet';
import { normalizeSheet } from '@/lib/ecert/normalize';
import { participantsToRecipientRows, fetchEventParticipants } from '@/lib/ecert/participants';
import { useRecipientMutations } from '../../../hooks/useEcert';

/**
 * Recipient import — the two sources:
 *  1. CSV/XLSX upload (columns selectable; "participant name" marking enforces email)
 *  2. Load from the event's confirmed participants
 * Rows are normalized (dedupe, casing, caps) and surfaced with a full report;
 * the import is an idempotent upsert so re-doing it never duplicates.
 */
export default function ImportPanel({
  templateId,
  eventId,
  onImported,
  existingCount
}: {
  templateId: string;
  eventId: string | null;
  onImported?: () => void;
  existingCount: number;
}) {
  const { importRows } = useRecipientMutations(templateId);
  const [parsing, setParsing] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [report, setReport] = useState<{
    kind: 'sheet' | 'participants';
    columns: string[];
    nameColumn: string | null;
    rows: { row_index: number; name: string; email: string; row_data: Record<string, string> }[];
    rowErrors: { row_index: number; reason: string }[];
    duplicates: string[];
    fileName: string;
  } | null>(null);

  const parseAndReport = async (file: File, nameColumn: string | null = null) => {
    setParsing(true);
    setReport(null);
    try {
      const parsed = await parseSheetFile(file);
      let normalized = normalizeSheet(parsed.columns, parsed.rows, undefined);
      if (nameColumn) normalized = normalizeSheet(parsed.columns, parsed.rows, nameColumn);
      setReport({
        kind: 'sheet',
        columns: normalized.columns,
        nameColumn: nameColumn ?? (normalized.columns.find((c) => c.toLowerCase() === 'name') ?? null),
        rows: normalized.rows,
        rowErrors: normalized.rowErrors,
        duplicates: normalized.duplicateEmails,
        fileName: parsed.fileName
      });
      if (!normalized.rows.length) {
        toast.error('No usable rows — every participant needs a valid email address');
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not read the file');
    } finally {
      setParsing(false);
    }
  };

  const loadParticipants = async () => {
    if (!eventId) {
      toast.error('This template is not tied to an event — use a CSV/XLSX instead');
      return;
    }
    setLoadingParticipants(true);
    try {
      const participants = await fetchEventParticipants(eventId);
      const rows = participantsToRecipientRows(participants);
      if (!rows.length) {
        toast.error('No confirmed participants with emails found for this event');
        setReport(null);
        return;
      }
      setReport({
        kind: 'participants',
        columns: ['participant_name', 'participant_email'],
        nameColumn: 'participant_name',
        rows: rows.map((r) => ({ ...r, row_data: r.row_data })),
        rowErrors: [],
        duplicates: [],
        fileName: 'confirmed participants'
      });
      toast.success(`${rows.length} confirmed participant(s) ready to import`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not load participants');
    } finally {
      setLoadingParticipants(false);
    }
  };

  const confirmImport = async () => {
    if (!report) return;
    try {
      await importRows.mutateAsync({ source: report.kind === 'sheet' ? 'sheet' : 'participants', rows: report.rows });
      toast.success(`${report.rows.length} recipient(s) imported${existingCount ? ` (${existingCount} already existed)` : ''}`);
      setReport(null);
      onImported?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Import failed');
    }
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-neutral-900 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          <Users size={15} className="text-red-400" /> Import recipients
        </h3>
        <span className="text-xs text-neutral-500">from a spreadsheet, or straight from the event&apos;s confirmed participants</span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SheetUploadCard parsing={parsing} onFile={(f) => parseAndReport(f)} disabled={!!report} />
        <button
          onClick={loadParticipants}
          disabled={loadingParticipants || !!report}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 px-4 py-6 text-sm font-semibold text-neutral-300 transition hover:border-red-500/40 hover:text-white disabled:opacity-50"
        >
          {loadingParticipants ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
          Load from event participants
        </button>
      </div>

      {report && (
        <div className="space-y-3 border border-white/10 bg-neutral-800 p-3 text-xs">
          <div className="flex items-center justify-between">
            <p className="font-bold text-white">
              {report.rows.length} import-ready recipient{report.rows.length !== 1 ? 's' : ''}
              {report.rowErrors.length > 0 && <span className="ml-2 font-normal text-amber-300">· {report.rowErrors.length} problem row(s)</span>}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setReport(null)} className="px-2.5 py-1.5 text-neutral-400 hover:text-white">Cancel</button>
              <Button onClick={confirmImport} disabled={!report.rows.length || importRows.isPending}>
                {importRows.isPending ? 'Importing…' : 'Import'}
              </Button>
            </div>
          </div>

          {report.kind === 'sheet' && (
            <div>
              <p className="mb-1.5 text-neutral-400">
                Columns in <span className="font-semibold text-white">{report.fileName}</span> — mark the
                participant-name column (the email column is mandatory):
              </p>
              <div className="flex w-full flex-wrap gap-1.5">
                {report.columns.map((c) => {
                  const isName = report.nameColumn === c;
                  const isEmail = c.toLowerCase() === 'email';
                  return (
                    <span
                      key={c}
                      className={`flex items-center gap-1 rounded-full border px-2 py-1 font-mono text-[10px] ${isName ? 'border-blue-500/50 bg-blue-500/15 text-blue-200' : isEmail ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-neutral-900 text-neutral-400'}`}
                    >
                      {c}
                      {isEmail && ' ✓'}
                    </span>
                  );
                })}
              </div>
              {!report.columns.some((c) => c.toLowerCase() === 'email') && (
                <p className="mt-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300">
                  This sheet has no “email” column — certificates can be rendered but cannot be emailed until one is added.
                </p>
              )}
            </div>
          )}

          {report.rowErrors.length > 0 && (
            <details>
              <summary className="cursor-pointer font-semibold text-amber-300">{report.rowErrors.length} row(s) will be skipped — why?</summary>
              <ul className="mt-1.5 max-h-40 space-y-0.5 overflow-y-auto text-neutral-400">
                {report.rowErrors.map((re) => (
                  <li key={re.row_index}>Row {re.row_index}: {re.reason}</li>
                ))}
              </ul>
            </details>
          )}

          <details>
            <summary className="cursor-pointer text-neutral-400">Preview first rows</summary>
            <ul className="mt-1.5 max-h-40 space-y-0.5 overflow-y-auto text-neutral-300">
              {report.rows.slice(0, 8).map((r) => {
                const name = report.kind === 'sheet'
                  ? Object.entries(r.row_data).find(([k]) => k.toLowerCase() === (report.nameColumn ?? '').toLowerCase())?.[1] ?? r.name
                  : r.name;
                return (
                  <li key={r.row_index} className="flex gap-3">
                    <span className="text-neutral-500"><FileUp size={10} className="inline" /> {name}</span>
                    <span className="font-mono text-neutral-400">{r.email}</span>
                  </li>
                );
              })}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}

function SheetUploadCard({ parsing, onFile, disabled }: { parsing: boolean; onFile: (f: File) => void; disabled: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={parsing || disabled}
      className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/15 px-4 py-6 text-sm font-semibold text-neutral-300 transition hover:border-red-500/40 hover:text-white disabled:opacity-50"
    >
      {parsing ? <Loader2 size={16} className="animate-spin" /> : <FileUp size={16} />}
      {parsing ? 'Parsing…' : 'Upload CSV / XLSX'}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
    </button>
  );
}