import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/utils/response';

/**
 * E-Certificate templates — list + create.
 * Unlike some legacy /api/admin routes, every handler here enforces requireAdmin.
 */

export async function GET() {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { data: templates, error } = await supabaseAdmin
      .from('ecert_templates')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);

    // Aggregated per-template recipient stats (single query, tiny columns).
    const { data: stats, error: statsError } = await supabaseAdmin
      .from('ecert_recipients')
      .select('template_id, email_status, render_status');
    if (statsError) return errorResponse(statsError.message, 'DATABASE_ERROR', 500);

    const byTemplate = new Map<
      string,
      { recipient_count: number; sent_count: number }
    >();
    for (const s of stats ?? []) {
      const agg = byTemplate.get(s.template_id) ?? { recipient_count: 0, sent_count: 0 };
      agg.recipient_count += 1;
      if (s.email_status === 'sent') agg.sent_count += 1;
      byTemplate.set(s.template_id, agg);
    }

    const enriched = (templates ?? []).map((t) => {
      const agg = byTemplate.get(t.id) ?? { recipient_count: 0, sent_count: 0 };
      return { ...t, ...agg };
    });

    return successResponse({ templates: enriched });
  } catch (err) {
    console.error('[ecert] templates GET failed:', err);
    return errorResponse('Failed to list e-certificate templates', 'INTERNAL_ERROR', 500);
  }
}

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const body = await request.json().catch(() => null);
    if (!body) return errorResponse('Invalid JSON body', 'VALIDATION_ERROR', 400);

    const eventId = String(body.event_id ?? '');
    const storagePath = String(body.storage_path ?? '');
    const backgroundUrl = String(body.background_url ?? '');
    const sourceUrl = String(body.source_url ?? backgroundUrl);
    const backgroundMime = String(body.background_mime ?? '');
    const width = Math.round(Number(body.width));
    const height = Math.round(Number(body.height));

    if (!eventId) return errorResponse('event_id is required', 'VALIDATION_ERROR', 400);
    if (!storagePath || !storagePath.startsWith('ecert/')) {
      return errorResponse('storage_path must be an ecert/ bucket path', 'VALIDATION_ERROR', 400);
    }
    if (!backgroundUrl) return errorResponse('background_url is required', 'VALIDATION_ERROR', 400);
    if (!/^image\/(png|jpe?g)$/.test(backgroundMime)) {
      return errorResponse('The background must already be rasterized to png/jpg', 'VALIDATION_ERROR', 400);
    }
    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      return errorResponse('width and height are required', 'VALIDATION_ERROR', 400);
    }

    // Snapshot the event server-side (never trust the client for this data).
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('title, poster_url')
      .eq('id', eventId)
      .maybeSingle();

    if (eventError) return errorResponse(eventError.message, 'DATABASE_ERROR', 500);
    if (!event) return errorResponse('Event not found', 'EVENT_NOT_FOUND', 404);

    const doc = {
      version: 1,
      canvas: { width, height },
      fonts: [],
      layers: []
    };

    const { data, error } = await supabaseAdmin
      .from('ecert_templates')
      .insert({
        event_id: eventId,
        event_title: event.title,
        event_poster_url: event.poster_url,
        name: String(body.name ?? `E-Certificates — ${event.title}`).slice(0, 120),
        background_url: backgroundUrl,
        source_url: sourceUrl,
        background_mime: backgroundMime,
        storage_path: storagePath,
        width,
        height,
        layers: doc,
        layers_fingerprint: '',
        created_by: check.email
      })
      .select('*')
      .single();

    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);
    return successResponse({ template: data }, 201);
  } catch (err) {
    console.error('[ecert] templates POST failed:', err);
    return errorResponse('Failed to create e-certificate template', 'INTERNAL_ERROR', 500);
  }
}