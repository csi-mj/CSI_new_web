import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { EMAIL_RE, normalizeEmail, type ParsedRow } from '@/lib/ecert/normalize';
import { MAX_RECIPIENTS } from '@/lib/ecert/types';

/**
 * Recipients of one e-certificate template.
 * POST is a bulk *idempotent* upsert keyed on (template_id, source, row_index):
 * unchanged rows keep their render/email state; changed rows are reset so
 * re-verified data re-renders. The client's own normalization is UX only —
 * the server re-validates everything here.
 */

type Params = { params: Promise<{ id: string }> };

const MAX_BATCH = 2000;
const CAP = MAX_RECIPIENTS;

interface IncomingRow {
  row_index?: number;
  name?: string;
  email?: string;
  row_data?: Record<string, unknown>;
}

export async function GET(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from('ecert_recipients')
      .select('*')
      .eq('template_id', id)
      .order('row_index', { ascending: true });

    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);
    return successResponse({ recipients: data ?? [] });
  } catch (err) {
    console.error('[ecert] recipients GET failed:', err);
    return errorResponse('Failed to load recipients', 'INTERNAL_ERROR', 500);
  }
}

export async function POST(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { id: templateId } = await params;
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Invalid JSON body', 'VALIDATION_ERROR', 400);

    const source = body.source === 'participants' ? 'participants' : 'sheet';
    const incoming: IncomingRow[] = Array.isArray(body.rows) ? body.rows.slice(0, MAX_BATCH) : [];
    if (!incoming.length) return errorResponse('No recipient rows provided', 'VALIDATION_ERROR', 400);

    const { error: existsError } = await supabaseAdmin
      .from('ecert_templates')
      .select('id', { count: 'exact', head: true })
      .eq('id', templateId);
    if (existsError) return errorResponse(existsError.message, 'DATABASE_ERROR', 500);

    const { data: templateExists } = await supabaseAdmin
      .from('ecert_templates')
      .select('id')
      .eq('id', templateId)
      .maybeSingle();
    if (!templateExists) return errorResponse('Template not found', 'NOT_FOUND', 404);

    // Normalize + validate every incoming row before touching the database.
    const rowErrors: { row_index: number; reason: string }[] = [];
    const valid: ParsedRow[] = [];
    const emailSeen = new Set<string>();

    for (let i = 0; i < incoming.length; i++) {
      const raw = incoming[i];
      const row_index = Number.isFinite(Number(raw.row_index)) ? Number(raw.row_index) : i + 1;
      const email = normalizeEmail(String(raw.email ?? ''));

      if (!EMAIL_RE.test(email)) {
        rowErrors.push({ row_index, reason: 'Missing or invalid email address' });
        continue;
      }
      if (emailSeen.has(email)) {
        rowErrors.push({ row_index, reason: `Duplicate email ${email}` });
        continue;
      }
      emailSeen.add(email);
      // Email-column requirement: every recipient row must be emailable.
      const row_data: Record<string, string> = {};
      if (raw.row_data && typeof raw.row_data === 'object') {
        for (const [k, v] of Object.entries(raw.row_data).slice(0, 200)) {
          row_data[String(k).slice(0, 120)] = String(v ?? '').slice(0, 1000);
        }
      }
      valid.push({
        row_index,
        name: String(raw.name ?? '').slice(0, 200) || email.split('@')[0],
        email,
        row_data
      });
    }

    // Row cap: existing rows for this source + new valid rows must fit.
    const { count: existingCount, error: countError } = await supabaseAdmin
      .from('ecert_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', templateId);
    if (countError) return errorResponse(countError.message, 'DATABASE_ERROR', 500);
    if ((existingCount ?? 0) + valid.length > CAP) {
      return errorResponse(
        `This template already has ${existingCount ?? 0} recipients; adding ${valid.length} would exceed the ${CAP}-recipient cap`,
        'LIMIT_EXCEEDED',
        400
      );
    }

    // Load existing rows of this template+source to detect real changes
    // (unchanged rows keep their render/email status; changed rows reset).
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('ecert_recipients')
      .select('row_index, name, email, row_data')
      .eq('template_id', templateId)
      .eq('source', source);
    if (fetchError) return errorResponse(fetchError.message, 'DATABASE_ERROR', 500);
    const existingByIndex = new Map<number, (typeof existing)[number]>();
    for (const ex of existing ?? []) existingByIndex.set(ex.row_index, ex);

    const RESET = {
      render_status: 'pending',
      render_error: null,
      rendered_fingerprint: '',
      rendered_path: null,
      rendered_url: null,
      rendered_at: null,
      email_status: 'pending',
      email_error: null,
      email_sent_at: null,
      brevo_message_id: null
    };

    const toUpsert = [];
    for (const r of valid) {
      const ex = existingByIndex.get(r.row_index);
      if (ex) {
        const dataChanged =
          ex.email !== r.email ||
          ex.name !== r.name ||
          JSON.stringify(ex.row_data ?? {}) !== JSON.stringify(r.row_data);
        if (!dataChanged) continue; // unchanged → keep existing state entirely
      }
      toUpsert.push(
        ex
          ? {
              template_id: templateId,
              source,
              row_index: r.row_index,
              name: r.name,
              email: r.email,
              row_data: r.row_data,
              ...RESET
            }
          : {
              template_id: templateId,
              source,
              row_index: r.row_index,
              name: r.name,
              email: r.email,
              row_data: r.row_data
            }
      );
    }

    let upserted = 0;
    if (toUpsert.length) {
      // Chunked upserts keep payloads small (JSONB rows can be wide).
      const CHUNK = 250;
      for (let i = 0; i < toUpsert.length; i += CHUNK) {
        const chunk = toUpsert.slice(i, i + CHUNK);
        const { error, count } = await supabaseAdmin
          .from('ecert_recipients')
          .upsert(chunk, { onConflict: 'template_id,source,row_index', count: 'exact' });
        if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);
        upserted += count ?? chunk.length;
      }
    }

    return successResponse({
      upserted,
      accepted: valid.length,
      rejected: rowErrors.length,
      row_errors: rowErrors,
      unchanged: valid.length - toUpsert.filter((r) => 'render_status' in r || !existingByIndex.get(r.row_index)).length
    });
  } catch (err) {
    console.error('[ecert] recipients POST failed:', err);
    return errorResponse('Failed to save recipients', 'INTERNAL_ERROR', 500);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { id } = await params;
    const url = new URL(request.url);
    const rowIndex = url.searchParams.get('row_index');
    const source = url.searchParams.get('source');

    let query = supabaseAdmin
      .from('ecert_recipients')
      .delete()
      .eq('template_id', id);
    if (source && ['sheet', 'participants'].includes(source)) {
      query = query.eq('source', source);
    }
    if (rowIndex !== null && rowIndex !== '' && Number.isFinite(Number(rowIndex))) {
      query = query.eq('row_index', Number(rowIndex));
    }
    const { error } = await query;
    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('[ecert] recipients DELETE failed:', err);
    return errorResponse('Failed to delete recipients', 'INTERNAL_ERROR', 500);
  }
}