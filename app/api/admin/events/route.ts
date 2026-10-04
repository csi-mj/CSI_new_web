import { makeCrudHandlers } from '@/lib/adminCrud';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const h = makeCrudHandlers('events', 'event_date', false);

export const GET = h.GET;
export const DELETE = h.DELETE;

async function injectDefaultQr(body: any) {
  if (body.is_paid && (!body.payment_qr_url || body.payment_qr_url.trim() === '')) {
    const { data: settings } = await supabaseAdmin
      .from('platform_settings')
      .select('default_payment_qr_url')
      .eq('id', 1)
      .single();
    if (settings?.default_payment_qr_url) {
      body.payment_qr_url = settings.default_payment_qr_url;
    }
  }
  return body;
}

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const body = await request.json();
  const modifiedBody = await injectDefaultQr(body);

  const { data, error } = await supabaseAdmin.from('events').insert(modifiedBody).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const body = await request.json();
  const { id, ...fields } = await injectDefaultQr(body);

  if (!id) return Response.json({ error: 'id is required' }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from('events')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}
