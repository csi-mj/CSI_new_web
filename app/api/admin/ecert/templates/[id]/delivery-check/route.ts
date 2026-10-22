import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { getBrevoDeliveryStatus } from '@/lib/email/brevo';

/**
 * Reconciles sent certificates against Brevo's real delivery event log.
 * Brevo accepts API requests synchronously but can REJECT at delivery time
 * (the classic case on a club account: sender email not yet verified in
 * Brevo / domain not authenticated). This turns that invisible failure into
 * explicit per-recipient state: delivered / still in transit / failed+reason.
 */

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const { id: templateId } = await params;

    const { data: recipients, error } = await supabaseAdmin
      .from('ecert_recipients')
      .select('id, name, email, email_status, email_error, brevo_message_id')
      .eq('template_id', templateId);
    if (error) return errorResponse(error.message, 'DATABASE_ERROR', 500);

    const sent = (recipients ?? []).filter((r) => r.email_status === 'sent' && r.brevo_message_id);

    const results: Array<{
      recipient_id: string;
      email: string;
      name: string;
      delivery: 'delivered' | 'in_transit' | 'failed' | 'unknown';
      reason: string | null;
    }> = [];

    // Sequential + small gap: Brevo event lookups are rate-limited per second.
    for (const r of sent) {
      try {
        const status = await getBrevoDeliveryStatus(r.brevo_message_id!);
        let delivery: 'delivered' | 'in_transit' | 'failed' | 'unknown';
        if (status.delivered) delivery = 'delivered';
        else if (status.failed) {
          delivery = 'failed';
          // keep the truth in the row: no longer "sent"
          await supabaseAdmin
            .from('ecert_recipients')
            .update({ email_status: 'failed', email_error: status.reason?.slice(0, 500) ?? 'Delivery failed at Brevo' })
            .eq('id', r.id);
        } else if (status.accepted) delivery = 'in_transit';
        else delivery = 'unknown';

        results.push({
          recipient_id: r.id,
          email: r.email,
          name: r.name,
          delivery,
          reason: status.reason
        });
      } catch (e) {
        results.push({
          recipient_id: r.id,
          email: r.email,
          name: r.name,
          delivery: 'unknown',
          reason: e instanceof Error ? e.message : 'Brevo lookup failed'
        });
      }
      await new Promise((res) => setTimeout(res, 150));
    }

    return successResponse({
      checked: sent.length,
      delivered: results.filter((r) => r.delivery === 'delivered').length,
      in_transit: results.filter((r) => r.delivery === 'in_transit').length,
      failed: results.filter((r) => r.delivery === 'failed').length,
      results
    });
  } catch (err) {
    console.error('[ecert] delivery check failed:', err);
    return errorResponse('Delivery check failed', 'INTERNAL_ERROR', 500);
  }
}