import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { EMAIL_RE, normalizeEmail } from '@/lib/ecert/normalize';

/**
 * One recipient: per-certificate fixes (overrides) + row corrections.
 * Changing anything that affects the rendered output resets the render so
 * the review screen re-renders before send.
 */

type Params = { params: Promise<{ id: string }> };

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
    if (body.name !== undefined) updates.name = String(body.name).slice(0, 200);
    if (body.email !== undefined) {
      const email = normalizeEmail(String(body.email));
      if (!EMAIL_RE.test(email)) {
        return errorResponse('Invalid email address', 'VALIDATION_ERROR', 400);
      }
      updates.email = email;
    }
    if (body.row_data !== undefined) {
      if (!body.row_data || typeof body.row_data !== 'object') {
        return errorResponse('row_data must be an object', 'VALIDATION_ERROR', 400);
      }
      const row_data: Record<string, string> = {};
      for (const [k, v] of Object.entries(body.row_data).slice(0, 200)) {
        row_data[String(k).slice(0, 120)] = String(v ?? '').slice(0, 1000);
      }
      updates.row_data = row_data;
    }
    if (body.overrides !== undefined) {
      if (!body.overrides || typeof body.overrides !== 'object') {
        return errorResponse('overrides must be an object keyed by layer id', 'VALIDATION_ERROR', 400);
      }
      // Cap per-recipient override payloads (sanity, not a hard product limit).
      const keys = Object.keys(body.overrides);
      if (keys.length > 200) {
        return errorResponse('Overrides too large', 'VALIDATION_ERROR', 400);
      }
      updates.overrides = body.overrides;
    }

    // Render/email bookkeeping — written by the render queue and status resets.
    // email_status 'sent'/'email_sent_at'/'brevo_message_id' are set ONLY by the
    // send route; they cannot be forged through this generic patch.
    if (body.render_status !== undefined) {
      if (!['pending', 'rendered', 'failed'].includes(body.render_status)) {
        return errorResponse('render_status must be pending, rendered or failed', 'VALIDATION_ERROR', 400);
      }
      updates.render_status = body.render_status;
    }
    if (body.render_error !== undefined) updates.render_error = body.render_error === null ? null : String(body.render_error).slice(0, 500);
    if (body.rendered_path !== undefined) updates.rendered_path = body.rendered_path === null ? null : String(body.rendered_path);
    if (body.rendered_url !== undefined) updates.rendered_url = body.rendered_url === null ? null : String(body.rendered_url);
    if (body.rendered_fingerprint !== undefined) updates.rendered_fingerprint = body.rendered_fingerprint === null ? null : String(body.rendered_fingerprint).slice(0, 64);
    if (body.rendered_at !== undefined) updates.rendered_at = body.rendered_at === null ? null : String(body.rendered_at);
    if (body.email_status !== undefined) {
      if (!['pending', 'failed'].includes(body.email_status)) {
        // 'sent' is reserved for the send route
        return errorResponse("email_status 'sent' can only be set by the send endpoint", 'VALIDATION_ERROR', 400);
      }
      updates.email_status = body.email_status;
    }
    if (body.email_error !== undefined) updates.email_error = body.email_error === null ? null : String(body.email_error).slice(0, 500);

    // Render-queue bookkeeping: the queue passes the superseded render path so
    // old files don't accumulate in storage (also why new renders use unique
    // paths — identical URLs would serve stale browser-cached images).
    const previousRenderedPath =
      typeof body.previous_rendered_path === 'string' ? body.previous_rendered_path : null;

    // Anything that changes the rendered image → force a fresh render,
    // unless the caller is the render queue itself setting render state.
    if (overridesOrDataChanged(updates) && !('render_status' in updates)) {
      updates.render_status = 'pending';
      updates.render_error = null;
      updates.rendered_fingerprint = '';
      updates.rendered_path = null;
      updates.rendered_url = null;
      updates.rendered_at = null;
      // A re-render does NOT undo a send; but a data-fix on an already-sent
      // row means the sent file is outdated — flag it so the UI can warn.
    }

    if (!Object.keys(updates).length) {
      return errorResponse('Nothing to update', 'VALIDATION_ERROR', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('ecert_recipients')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);
    if (!data) return errorResponse('Recipient not found', 'NOT_FOUND', 404);

    // Best-effort cleanup of the superseded render file.
    if (previousRenderedPath && previousRenderedPath !== data.rendered_path) {
      try {
        if (previousRenderedPath.startsWith('ecert/renders/') && !previousRenderedPath.includes('..')) {
          await supabaseAdmin.storage.from('media').remove([previousRenderedPath]);
        }
      } catch (cleanupErr) {
        console.warn('[ecert] superseded render cleanup failed (harmless):', cleanupErr);
      }
    }

    return successResponse({ recipient: data });
  } catch (err) {
    console.error('[ecert] recipient PATCH failed:', err);
    return errorResponse('Failed to update recipient', 'INTERNAL_ERROR', 500);
  }
}

function overridesOrDataChanged(updates: Record<string, unknown>): boolean {
  return (
    'overrides' in updates ||
    'row_data' in updates ||
    'name' in updates ||
    'email' in updates
  );
}