/**
 * Sheet/recipient normalization + validation.
 * Pure functions — the client calls these during parsing (UX) and the
 * recipients bulk-upsert route re-runs them (trust boundary).
 */
import { MAX_RECIPIENTS, type DataColumn } from './types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ParsedRow {
  row_index: number; // 1-based data row (excludes the header)
  name: string;
  email: string;
  row_data: Record<string, string>;
}

export interface RowError {
  row_index: number;
  reason: string;
}

export interface NormalizedSheet {
  columns: string[];
  rows: ParsedRow[];
  rowErrors: RowError[];
  duplicateEmails: string[];
}

export function normalizeEmail(raw: string): string {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[,;]$/, '');
}

function str(v: unknown): string {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

/**
 * Turns raw spreadsheet rows into normalized recipient rows.
 * columns: header names in original order. nameColumn: header marked as the
 * participant's name (optional; falls back to a name-ish first column).
 */
export function normalizeSheet(
  columns: string[],
  rawRows: Record<string, unknown>[],
  nameColumn?: string | null
): NormalizedSheet {
  const uniqueColumns: string[] = [];
  const seen = new Set<string>();
  for (const c of columns) {
    const name = str(c) || 'Column';
    let final = name;
    let n = 2;
    while (seen.has(final.toLowerCase())) final = `${name} ${n++}`;
    seen.add(final.toLowerCase());
    uniqueColumns.push(final);
  }

  const usedName = nameColumn && uniqueColumns.includes(nameColumn)
    ? nameColumn
    : pickDefaultNameColumn(uniqueColumns);

  const rows: ParsedRow[] = [];
  const rowErrors: RowError[] = [];
  const emailIndex = new Map<string, string>(); // normalized email -> first row's original
  const duplicateEmails = new Set<string>();

  rawRows.forEach((raw, i) => {
    const row_index = i + 1;
    const row_data: Record<string, string> = {};
    let allEmpty = true;
    uniqueColumns.forEach((col) => {
      const rawKey = Object.keys(raw).find((k) => str(k).toLowerCase() === col.toLowerCase());
      const value = str(raw[col] ?? (rawKey ? raw[rawKey] : ''));
      row_data[col] = value;
      if (value) allEmpty = false;
    });

    if (allEmpty) return; // silently skip fully empty spreadsheet rows

    const rawEmail = raw['email'] ?? raw['Email'] ?? Object.entries(raw).find(([k]) => k.toLowerCase() === 'email')?.[1];
    const email = normalizeEmail(str(rawEmail));

    if (!email) {
      rowErrors.push({ row_index, reason: 'No email address in this row' });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      rowErrors.push({ row_index, reason: `Invalid email address: "${str(rawEmail).slice(0, 60)}"` });
      return;
    }

    const existing = emailIndex.get(email);
    if (existing) {
      duplicateEmails.add(email);
      rowErrors.push({
        row_index,
        reason: `Duplicate email ${email} (first used in spreadsheet row ${existing})`
      });
      return;
    }
    emailIndex.set(email, String(row_index));

    const name = str(usedName ? raw[usedName] ?? row_data[usedName] : '') || email.split('@')[0];

    if (rows.length >= MAX_RECIPIENTS) {
      rowErrors.push({
        row_index,
        reason: `Reaches the ${MAX_RECIPIENTS}-recipient limit; this row was skipped`
      });
      return;
    }

    rows.push({ row_index, name, email, row_data });
  });

  return { columns: uniqueColumns, rows, rowErrors, duplicateEmails: [...duplicateEmails] };
}

function pickDefaultNameColumn(columns: string[]): string | undefined {
  const ranked = ['name', 'full name', 'participant', 'participant name', 'student name', 'first name'];
  for (const want of ranked) {
    const hit = columns.find((c) => c.toLowerCase() === want);
    if (hit) return hit;
  }
  const fuzzy = columns.find((c) => /name/i.test(c) && !/user|file|team/i.test(c));
  return fuzzy ?? columns[0];
}

/** Which bound variables does this template reference (for validation UX)? */
export function missingVariableColumns(
  layers: { type: string; mode?: string; variable?: string | null }[],
  columns: string[]
): string[] {
  const cols = new Set(columns.map((c) => c.toLowerCase()));
  return layers
    .filter((l) => l.type === 'text' && l.mode === 'variable' && l.variable)
    .filter((l) => !cols.has(l.variable!.toLowerCase()))
    .map((l) => l.variable!);
}

export function templateNeedsEmailColumn(dataColumnRoles: DataColumn[] | null): boolean {
  return !!dataColumnRoles?.some((c) => c.role === 'name');
}