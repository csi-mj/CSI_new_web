export interface SendEmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

/**
 * Sender identity, configurable per environment.
 * NOTE: changing this does NOT bypass Brevo delivery rules — whichever address
 * appears here must be a verified sender (or on an authenticated domain) in
 * the Brevo account whose API key is used, or Brevo rejects delivery.
 */
function getBrevoSender(): { name: string; email: string } {
  return {
    name: process.env.BREVO_SENDER_NAME?.trim() || 'CSI Chapter',
    email: process.env.BREVO_SENDER_EMAIL?.trim() || 'csi@mjcollege.ac.in'
  };
}

/**
 * Sends an email using the Brevo API.
 * This acts as our single reusable instance for the whole app.
 */
export async function sendEmail({ to, subject, htmlContent }: SendEmailOptions) {
  const API_KEY = process.env.BREVO_API_KEY;

  if (!API_KEY) {
    throw new Error('BREVO_API_KEY is missing in environment variables');
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: getBrevoSender(),
      to,
      subject,
      htmlContent
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Brevo API Error:', errorData);
    throw new Error('Failed to send email via Brevo');
  }

  return await response.json();
}

export interface EmailAttachment {
  /** File name shown on the attachment, with extension. */
  name: string;
  /** Base64-encoded file contents (raw base64, no data: prefix). */
  content: string;
}

export interface SendEmailWithAttachmentsOptions extends SendEmailOptions {
  attachments?: EmailAttachment[];
}

/**
 * Sends an email with file attachments using the Brevo API.
 * Additive to sendEmail (which stays untouched) — only used by the
 * e-certificate routes. Brevo limits total message size to 20 MB.
 */
export async function sendEmailWithAttachments({
  to,
  subject,
  htmlContent,
  attachments
}: SendEmailWithAttachmentsOptions) {
  const API_KEY = process.env.BREVO_API_KEY;

  if (!API_KEY) {
    throw Object.assign(
      new Error('BREVO_API_KEY is missing in environment variables'),
      { status: 500 }
    );
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: getBrevoSender(),
      to,
      subject,
      htmlContent,
      ...(attachments?.length ? { attachment: attachments } : {})
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message =
      (errorData as { message?: string }).message || 'Failed to send email via Brevo';
    console.error('Brevo API Error:', errorData);
    // status is read by the e-certificate send route (e.g. 429 backoff).
    throw Object.assign(new Error(message), { status: response.status });
  }

  return await response.json();
}

/** Brevo event types from /smtp/statistics/events. */
export type BrevoEventType =
  | 'requests'
  | 'delivered'
  | 'opened'
  | 'clicked'
  | 'softBounce'
  | 'hardBounce'
  | 'blocked'
  | 'spam'
  | 'error'
  | 'unsubscribed';

export interface BrevoEvent {
  event: BrevoEventType;
  email: string;
  messageId: string;
  date: string;
  reason?: string;
  subject?: string;
  from?: string;
}

export interface BrevoDeliveryStatus {
  accepted: boolean; // Brevo pipeline accepted the request (API 2xx already proved that)
  delivered: boolean;
  failed: boolean;
  reason: string | null;
  events: BrevoEvent[];
}

/**
 * Fetches the real delivery state of one message from Brevo's event log.
 * Brevo ACCEPTS API sends synchronously but may reject them at delivery time
 * (unverified sender/domain being the classic case) — this surfaces that.
 */
export async function getBrevoDeliveryStatus(messageId: string): Promise<BrevoDeliveryStatus> {
  const API_KEY = process.env.BREVO_API_KEY;
  if (!API_KEY) {
    throw new Error('BREVO_API_KEY is missing in environment variables');
  }

  const url = `https://api.brevo.com/v3/smtp/statistics/events?messageId=${encodeURIComponent(messageId)}&limit=25`;
  const response = await fetch(url, {
    headers: { 'accept': 'application/json', 'api-key': API_KEY }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = (errorData as { message?: string }).message || `Brevo delivery lookup failed (HTTP ${response.status})`;
    console.error('Brevo API Error (events):', errorData);
    throw Object.assign(new Error(message), { status: response.status });
  }

  const json = (await response.json()) as { events?: BrevoEvent[] };
  const events = json.events ?? [];

  const FAIL_EVENTS: BrevoEventType[] = ['hardBounce', 'softBounce', 'blocked', 'spam', 'error'];
  const failEvent = events.find((e) => FAIL_EVENTS.includes(e.event));
  const delivered = events.some((e) => e.event === 'delivered');

  return {
    accepted: events.some((e) => e.event === 'requests') || events.length > 0,
    delivered,
    failed: !!failEvent && !delivered,
    reason: failEvent ? `${failEvent.event === 'error' ? 'Rejected' : failEvent.event}: ${failEvent.reason ?? 'no reason given'}` : null,
    events
  };
}
