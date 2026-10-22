/**
 * Spreadsheet parsing (CSV via papaparse, XLSX via SheetJS) — client-only.
 * Produces raw header rows + row maps; normalization/cap/dedupe happens in
 * normalize.ts so the server can re-run the exact same checks.
 */

export interface SheetParseResult {
  columns: string[];
  rows: Record<string, unknown>[];
  fileName: string;
  totalRows: number;
}

const MAX_SHEET_BYTES = 15 * 1024 * 1024;

export async function parseSheetFile(file: File): Promise<SheetParseResult> {
  if (file.size > MAX_SHEET_BYTES) {
    throw new Error(`Spreadsheet too large (max 15 MB): ${file.name}`);
  }
  const name = file.name.toLowerCase();
  if (name.endsWith('.csv') || file.type === 'text/csv') return parseCsv(file);
  if (name.endsWith('.xlsx') || name.endsWith('.xls') || /\.xlsx?$/i.test(name)) return parseXlsx(file);
  if (name.endsWith('.tsv')) return parseCsv(file, '\t');
  throw new Error('Unsupported spreadsheet format — upload .csv, .xlsx or .xls');
}

async function parseCsv(file: File, delimiter: ',' | '\t' | ';' = ','): Promise<SheetParseResult> {
  const Papa = await import('papaparse');
  const text = await file.text();
  const result = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: 'greedy',
    dynamicTyping: false,
    delimiter,
    transformHeader: (h) => h.trim()
  });
  if (result.errors.length && result.data.length === 0) {
    throw new Error(`Could not parse "${file.name}": ${result.errors[0].message}`);
  }
  const columns = result.meta.fields ?? [];
  if (!columns.length) throw new Error(`"${file.name}" has no header row`);
  return { columns, rows: result.data, fileName: file.name, totalRows: result.data.length };
}

async function parseXlsx(file: File): Promise<SheetParseResult> {
  const XLSX = await import('xlsx');
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { cellDates: false, codepage: 65001 });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error(`"${file.name}" has no sheets`);
  const sheet = wb.Sheets[sheetName];
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    raw: false,
    defval: '',
    blankrows: false
  });
  if (!matrix.length) throw new Error(`"${file.name}" is empty`);

  // Build unique header names (SheetJS leaves duplicate headers collapsed).
  const seen = new Set<string>();
  const columns: string[] = [];
  for (const c of (matrix[0] as unknown[]).map((v) => String(v ?? '').trim())) {
    let name = c || 'Column';
    let n = 2;
    while (seen.has(name.toLowerCase())) name = `${c || 'Column'} ${n++}`;
    seen.add(name.toLowerCase());
    columns.push(name);
  }

  const rows: Record<string, unknown>[] = [];
  for (const cells of matrix.slice(1)) {
    const row: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      row[col] = cells[i] ?? '';
    });
    rows.push(row);
  }
  return { columns, rows, fileName: file.name, totalRows: rows.length };
}