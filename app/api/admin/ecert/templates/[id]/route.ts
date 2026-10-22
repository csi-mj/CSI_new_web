import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/utils/response';

const TEMPLATE_STATUSES = ['draft', 'ready', 'sent'] as const;
const FORMATS = ['pdf', 'jpg', 'jpeg'] as const;

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { id } = await params;
    const { data: template, error } = await supabaseAdmin
      .from('ecert_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);
    if (!template) return errorResponse('Template not found', 'NOT_FOUND', 404);

    const { count, error: countError } = await supabaseAdmin
      .from('ecert_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id);
    if (countError) return errorResponse(countError.message, 'DATABASE_ERROR', 500);

    const { count: sentCount, error: sentError } = await supabaseAdmin
      .from('ecert_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('template_id', id)
      .eq('email_status', 'sent');
    if (sentError) return errorResponse(sentError.message, 'DATABASE_ERROR', 500);

    return successResponse({ template, recipient_count: count ?? 0, sent_count: sentCount ?? 0 });
  } catch (err) {
    console.error('[ecert] template GET failed:', err);
    return errorResponse('Failed to load e-certificate template', 'INTERNAL_ERROR', 500);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return errorResponse('Invalid JSON body', 'VALIDATION_ERROR', 400);
    }

    const updates: Record<string, unknown> = {};

    // Existing row read ONCE — render invalidation must key off actual VALUE
    // changes, not key-presence (e.g. the bulk runner re-sends `format` on
    // every start, and the editor re-saves identical layers; both used to
    // wipe freshly rendered certificates for no reason).
    const { data: existing } = await supabaseAdmin
      .from('ecert_templates')
      .select('width, height, layers_fingerprint, format')
      .eq('id', id)
      .maybeSingle();
    if (!existing) return errorResponse('Template not found', 'NOT_FOUND', 404);

    if (body.name !== undefined) updates.name = String(body.name).slice(0, 120);

    if (body.layers !== undefined) {
      // The layer doc: {version, canvas, fonts, layers} — store canonical JSON.
      const doc = body.layers;
      if (!doc || typeof doc !== 'object' || !Array.isArray(doc.layers)) {
        return errorResponse('layers must be a valid layer document', 'VALIDATION_ERROR', 400);
      }
      const incomingFingerprint = typeof body.layers_fingerprint === 'string' ? body.layers_fingerprint.slice(0, 64) : '';

      // Identical re-save (degenerate edits, proceed-button saves) → no-op.
      if (incomingFingerprint && incomingFingerprint === existing.layers_fingerprint) {
        delete body.layers; // skip the layers write entirely
      } else {
        const sanitized = {
          version: 1,
          canvas: doc.canvas ?? { width: existing.width, height: existing.height },
          fonts: Array.isArray(doc.fonts) ? doc.fonts.map(String).slice(0, 24) : [],
          layers: doc.layers
        };
        updates.layers = sanitized;
        if (incomingFingerprint) updates.layers_fingerprint = incomingFingerprint;
      }
    }

    if (body.data_columns !== undefined) {
      if (!Array.isArray(body.data_columns)) {
        return errorResponse('data_columns must be an array', 'VALIDATION_ERROR', 400);
      }
      updates.data_columns = body.data_columns.slice(0, 200).map((c: unknown) => {
        const col = typeof c === 'string' ? { name: c, role: null } : c;
        return { name: String((col as { name: unknown }).name ?? '').slice(0, 120), role: (col as { role: unknown }).role === 'name' ? 'name' : null };
      });
    }

    if (body.email_subject !== undefined) updates.email_subject = String(body.email_subject).slice(0, 200);
    if (body.email_body !== undefined) updates.email_body = String(body.email_body).slice(0, 20000);
    if (body.use_letterhead !== undefined) updates.use_letterhead = !!body.use_letterhead;
    if (body.format !== undefined) {
      if (!FORMATS.includes(body.format)) {
        return errorResponse('format must be pdf, jpg or jpeg', 'VALIDATION_ERROR', 400);
      }
      // identical format re-send → drop it (no invalidation, no churn)
      if (body.format === existing.format) {
        delete body.format;
      } else {
        updates.format = body.format;
      }
    }
    if (body.status !== undefined) {
      if (!TEMPLATE_STATUSES.includes(body.status)) {
        return errorResponse('invalid status', 'VALIDATION_ERROR', 400);
      }
      updates.status = body.status;
    }

    // Nothing effectively changed → not an error; return the current row.
    if (!Object.keys(updates).length) {
      return successResponse({ template: existing });
    }

    const { data, error } = await supabaseAdmin
      .from('ecert_templates')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);
    if (!data) return errorResponse('Template not found', 'NOT_FOUND', 404);

    // The layer doc or output format actually changed → renders are stale.
    // Reset only not-yet-emailed recipients (already-sent history untouched).
    if ('layers' in updates || 'format' in updates) {
      const { error: resetError } = await supabaseAdmin
        .from('ecert_recipients')
        .update({
          render_status: 'pending',
          render_error: null,
          rendered_fingerprint: '',
          rendered_path: null,
          rendered_url: null,
          rendered_at: null
        })
        .eq('template_id', id)
        .eq('email_status', 'pending');
      if (resetError) console.error('[ecert] render reset after layers edit failed:', resetError);
    }

    return successResponse({ template: data });
  } catch (err) {
    console.error('[ecert] template PATCH failed:', err);
    return errorResponse('Failed to update e-certificate template', 'INTERNAL_ERROR', 500);
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { id } = await params;
    const { data: template, error: fetchError } = await supabaseAdmin
      .from('ecert_templates')
      .select('storage_path, background_url')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) return errorResponse(fetchError.message, 'DATABASE_ERROR', 500);
    if (!template) return errorResponse('Template not found', 'NOT_FOUND', 404);

    const { error } = await supabaseAdmin.from('ecert_templates').delete().eq('id', id);
    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);

    // Recipients row-cascade with the template. Storage: best-effort cleanup.
    try {
      const { data: renders } = await supabaseAdmin.storage.from('media').list(`ecert/renders/${id}`, {
        limit: 2000
      });
      const paths =
        renders?.map((f) => `ecert/renders/${id}/${f.name}`).filter(Boolean) ?? [];
      if (template.storage_path) paths.push(template.storage_path);
      if (paths.length) {
        await supabaseAdmin.storage.from('media').remove(paths);
      }
    } catch (cleanupErr) {
      console.warn('[ecert] storage cleanup for deleted template failed (kept harmless):', cleanupErr);
    }

    return successResponse({ deleted: true });
  } catch (err) {
    console.error('[ecert] template DELETE failed:', err);
    return errorResponse('Failed to delete e-certificate template', 'INTERNAL_ERROR', 500);
  }
}