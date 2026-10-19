/**
 * n8n WhatsApp webhook integration.
 *
 * Fires AFTER a successful event registration (post-response, via `after()` in
 * the register route). Sends every field the user filled in plus the ticket QR
 * code (same generator used in the ticket email) as base64.
 *
 * Contract: this module NEVER throws and NEVER affects the registration flow.
 * If the QR fetch or the webhook call fails, the failure is logged to the
 * server console and the user-facing registration is untouched.
 */

const WEBHOOK_URL = process.env.CSI_WEBHOOK_URL || 'https://n8n-n8n.jchnju.easypanel.host/webhook/CSI_whatsapp_webhook';
const WEBHOOK_USERNAME = process.env.CSI_WEBHOOK_USERNAME || 'CSI_webhook';
const WEBHOOK_PASSWORD = process.env.CSI_WEBHOOK_PASSWORD || 'CSI2026';

const QR_FETCH_TIMEOUT_MS = 8_000;
const WEBHOOK_TIMEOUT_MS = 10_000;

/** Same generator + parameters the ticket email uses (lib/email/ticketTemplate.ts). */
const QR_URL = (registrationId: string) =>
  `https://quickchart.io/qr?text=${registrationId}&size=250&margin=2`;

export interface RegistrationWebhookEventInfo {
  id: string;
  title: string;
  event_date: string | null;
  event_end_date: string | null;
  venue: string | null;
  category: string | null;
}

export interface RegistrationWebhookPayload {
  type: 'event_registration';
  source: 'csi-website';
  webhook_sent_at: string;

  /** Event the user registered for. */
  event: RegistrationWebhookEventInfo;

  /** The registration row — `id` is the same UUID the QR encodes. */
  registration: {
    id: string;
    status: string;
    submitted_at: string;
  };

  /**
   * Everything the user filled in: the known base fields plus every custom
   * field from the admin-built registration form (flattened, verbatim).
   */
  form_data: Record<string, string | boolean>;

  /** Payment block — only meaningful when the event is paid. */
  payment: {
    is_paid: boolean;
    entry_fee: number | null;
    csi_entry_fee: number | null;
    mode: string | null;
    transaction_id: string | null;
    screenshot_url: string | null;
  };

  /**
   * PNG QR code of the registration ID, base64-encoded (NOT a data URI —
   * prefix with "data:image/png;base64," or set a mime field in n8n).
   * Null if QuickChart could not be reached, in which case `qr_code_error`
   * explains why and the webhook is still delivered.
   */
  qr_code_base64: string | null;
  qr_code_error: string | null;
}

/**
 * Downloads the ticket QR for a registration and returns it as base64.
 * Isolated: any failure degrades to `{ base64: null, error }`.
 */
async function fetchQrCodeBase64(
  registrationId: string
): Promise<{ base64: string | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), QR_FETCH_TIMEOUT_MS);

    const response = await fetch(QR_URL(registrationId), {
      signal: controller.signal,
      headers: { Accept: 'image/png' }
    });

    clearTimeout(timer);

    if (!response.ok) {
      return { base64: null, error: `QR fetch failed with HTTP ${response.status}` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0) {
      return { base64: null, error: 'QR fetch returned an empty image' };
    }

    return { base64: buffer.toString('base64'), error: null };
  } catch (err: any) {
    const reason =
      err?.name === 'AbortError' ? `QR fetch timed out after ${QR_FETCH_TIMEOUT_MS}ms` : err?.message || 'Unknown QR fetch error';
    return { base64: null, error: reason };
  }
}

/**
 * Sends the registration details + QR to the n8n webhook with Basic auth.
 * Fire-and-forget with hard timeouts; resolves `{ ok, ...diagnostics }` and
 * only ever rejects on its own bugs (all runtime failures are caught).
 */
export async function sendRegistrationWebhook(
  event: RegistrationWebhookEventInfo,
  registrationId: string,
  registrationStatus: string,
  formData: Record<string, string | boolean>,
  payment: RegistrationWebhookPayload['payment']
): Promise<{ ok: boolean; qrOk: boolean; webhookStatus?: number; error?: string }> {
  try {
    // QR first; a failure here is not fatal for the delivery.
    const { base64, error: qrError } = await fetchQrCodeBase64(registrationId);

    const payload: RegistrationWebhookPayload = {
      type: 'event_registration',
      source: 'csi-website',
      webhook_sent_at: new Date().toISOString(),
      event,
      registration: {
        id: registrationId,
        status: registrationStatus,
        submitted_at: new Date().toISOString()
      },
      form_data: formData,
      payment,
      qr_code_base64: base64,
      qr_code_error: qrError
    };

    if (qrError) {
      console.error('[registration-webhook] QR generation failed, sending without QR:', qrError);
    }

    const auth = Buffer.from(`${WEBHOOK_USERNAME}:${WEBHOOK_PASSWORD}`).toString('base64');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

    let response: Response;
    let responseText: string;

    try {
      response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      responseText = await response.text().catch(() => '');
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      console.error(
        `[registration-webhook] Webhook responded with HTTP ${response.status} for registration ${registrationId}: ${responseText.slice(0, 500)}`
      );
      return { ok: false, qrOk: !!base64, webhookStatus: response.status, error: `HTTP ${response.status}` };
    }

    console.log(`[registration-webhook] Delivered registration ${registrationId} (HTTP ${response.status})`);
    return { ok: true, qrOk: !!base64, webhookStatus: response.status };
  } catch (err: any) {
    const reason =
      err?.name === 'AbortError'
        ? `Webhook request timed out after ${WEBHOOK_TIMEOUT_MS}ms`
        : err?.message || 'Unknown webhook error';
    console.error(`[registration-webhook] Failed to deliver registration ${registrationId}: ${reason}`);
    return { ok: false, qrOk: false, error: reason };
  }
}