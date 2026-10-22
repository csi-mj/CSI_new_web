import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';
import { successResponse, errorResponse } from '@/lib/utils/response';
import { sendEmailWithAttachments } from '@/lib/email/brevo';
import { certificateFileName, type EcertFormat } from '@/lib/ecert/types';
import { substituteTokens, tokenizeTemplate, type TokenContext } from '@/lib/ecert/tokens';

/**
 * Sends ONE rendered certificate to its recipient via Brevo.
 * The client renders + uploads the certificate; the server never renders.
 * Hard guards: rendered file must exist under ecert/renders/<templateId>/,
 * must match the template's current layers fingerprint, and the row must not
 * already be sent (unless ?force=1, e.g. an explicit resend).
 */

const STORAGE_PATH_RE = /^ecert\/renders\/[A-Za-z0-9._-]+(\/[A-Za-z0-9._-]+)+\.(pdf|jpg|jpeg|png)$/;
const EMAIL_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const { id } = await params;
  const url = new URL(request.url);
  const force = url.searchParams.get('force') === '1';

  try {
    const { data: recipient, error: recError } = await supabaseAdmin
      .from('ecert_recipients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (recError) return errorResponse(recError.message, 'DATABASE_ERROR', 500);
    if (!recipient) return errorResponse('Recipient not found', 'NOT_FOUND', 404);

    if (recipient.email_status === 'sent' && !force) {
      return errorResponse(
        'This certificate was already sent (use force to resend)',
        'ALREADY_SENT',
        409
      );
    }
    if (recipient.render_status !== 'rendered' || !recipient.rendered_path) {
      return errorResponse('This certificate has not been rendered yet', 'NOT_RENDERED', 400);
    }
    if (!recipient.email || !recipient.email.includes('@')) {
      return errorResponse('This recipient has no valid email', 'VALIDATION_ERROR', 400);
    }

    const { data: template, error: tplError } = await supabaseAdmin
      .from('ecert_templates')
      .select('layers_fingerprint, email_subject, email_body, format, name, use_letterhead')
      .eq('id', recipient.template_id)
      .maybeSingle();
    if (tplError) return errorResponse(tplError.message, 'DATABASE_ERROR', 500);
    if (!template) return errorResponse('Template not found', 'NOT_FOUND', 404);

    if (recipient.rendered_fingerprint !== template.layers_fingerprint) {
      return errorResponse(
        'The saved render is outdated (the template was edited). Re-render this certificate first.',
        'STALE_RENDER',
        409
      );
    }

    if (!STORAGE_PATH_RE.test(recipient.rendered_path)) {
      return errorResponse('Invalid rendered file path', 'VALIDATION_ERROR', 400);
    }

    // ---- attachment bytes from Supabase Storage (path already whitelisted) ----
    const { data: fileBlob, error: dlError } = await supabaseAdmin.storage
      .from('media')
      .download(recipient.rendered_path);
    if (dlError || !fileBlob) {
      return errorResponse(
        `Rendered file could not be loaded from storage: ${dlError?.message ?? 'not found'}`,
        'RENDER_FILE_MISSING',
        404
      );
    }
    if (fileBlob.size > EMAIL_ATTACHMENT_MAX_BYTES) {
      return errorResponse('Rendered certificate is too large to email', 'ATTACHMENT_TOO_LARGE', 413);
    }

    const buffer = await fileBlob.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);

    // ---- subject/body templating: {{column}} tokens, HTML-escaped values ----
    const ctx = tokenContextFor(recipient, template);
    const subject = renderSubject(template.email_subject ?? 'Your e-certificate', ctx);
    const bodySrc = (template.email_body ?? '').trim() || DEFAULT_PLAIN_BODY;
    const inner = renderBody(bodySrc, ctx);
    // Branded letterhead (CSI header + contact footer) unless turned off.
    const body = template.use_letterhead !== false
      ? await withLetterhead(inner, (template.email_body ?? '').trim() !== '')
      : inner;

    const result = await sendEmailWithAttachments({
      to: [{ email: recipient.email, name: recipient.name || undefined }],
      subject,
      htmlContent: body,
      attachments: [
        {
          name: certificateFileName(recipient.name || 'Participant', (template.format as EcertFormat) || 'pdf'),
          content: base64
        }
      ]
    });

    const newSendCount = (recipient.send_count ?? 0) + 1;
    const { error: updateError } = await supabaseAdmin
      .from('ecert_recipients')
      .update({
        email_status: 'sent',
        email_error: null,
        email_sent_at: new Date().toISOString(),
        brevo_message_id: result?.messageId ?? null,
        send_count: newSendCount
      })
      .eq('id', id);
    if (updateError) {
      // Email went out but bookkeeping failed — report honestly, never silently.
      console.error('[ecert] send succeeded but DB status update failed:', updateError);
    }

    // First successful send promotes the template to 'sent' for the grid view.
    await supabaseAdmin
      .from('ecert_templates')
      .update({ status: 'sent' })
      .eq('id', recipient.template_id)
      .neq('status', 'sent');

    return successResponse({ sent: true, message_id: result?.messageId ?? null, send_count: newSendCount });
  } catch (err) {
    // Record the failure on the row, then surface it with the original status
    // (e.g. Brevo 429 → client backs off once).
    const message = err instanceof Error ? err.message : 'Unexpected error while sending';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = (err as any)?.status && Number((err as any).status) ? Number((err as any).status) : 500;
    try {
      await supabaseAdmin
        .from('ecert_recipients')
        .update({
          email_status: 'failed',
          email_error: message.slice(0, 500),
          brevo_message_id: null
        })
        .eq('id', id);
    } catch (logErr) {
      console.error('[ecert] failed to record email failure:', logErr);
    }
    console.error('[ecert] send failed:', message);
    return errorResponse(message, 'SEND_FAILED', status === 500 ? 500 : status);
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type RecipientRow = {
  name: string;
  email: string;
  row_data: Record<string, string>;
  rendered_url: string | null;
};

/** A body already written as HTML (legacy) keeps its structure; plain text is faithful. */
const LEGACY_HTML_RE = /<\/?(?:p|br|div|b|strong|i|em|u|span|h[1-6]|ul|ol|li|a|table|tr|td|img)\b/i;

/** Used when the admin hasn't written a custom body. Uses the shared token contract. */
const DEFAULT_PLAIN_BODY =
  'Dear {{participant_name}},\n\nCongratulations! 🎉 We are pleased to share your e-certificate — it is attached to this email.\n\nWarm regards,\nCSI MJCET Student Chapter';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function tokenContextFor(
  recipient: RecipientRow,
  tpl: { name: string; format: string }
): TokenContext {
  return {
    recipient: { name: recipient.name ?? '', email: recipient.email ?? '', rendered_url: recipient.rendered_url ?? null },
    template: { name: tpl.name ?? '', format: tpl.format ?? 'pdf' },
    rowData: recipient.row_data ?? {}
  };
}

function renderSubject(subject: string, ctx: TokenContext): string {
  return substituteTokens(subject, ctx);
}

/**
 * Plain-text faithful body: newlines and spacing preserved EXACTLY
 * (white-space: pre-wrap), values HTML-escaped, emojis untouched.
 * Legacy bodies that were deliberately written as HTML keep working as HTML.
 */
function renderBody(
  template: string,
  ctx: TokenContext
): string {
  if (LEGACY_HTML_RE.test(template)) {
    // legacy: treat as HTML — escape only the substituted values
    return tokenizeTemplate(template)
      .map((s) => (s.isToken ? escapeHtml(substituteTokens(`{{${s.key}}}`, ctx)) : s.key))
      .join('');
  }

  // plain-text mode: escape every literal chunk + value, preserve newlines
  const parts = tokenizeTemplate(template).map((s) =>
    s.isToken ? escapeHtml(substituteTokens(`{{${s.key}}}`, ctx)) : escapeHtml(s.key ?? '')
  );
  return [
    '<div style="white-space:pre-wrap;word-wrap:break-word;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#1f2937;">',
    parts.join(''),
    '</div>'
  ].join('');
}
/* =====================================================================
 * Letterhead — the branded email shell (matches the site's other email
 * flows in spirit): CSI header banner, rendered content, contact footer.
 * Header/footer identity comes from platform_settings (managed in Admin →
 * Settings), so rebranding there rebrands these emails automatically.
 * ===================================================================== */

const LETTERHEAD_FALLBACK = {
  platform_name: 'CSI MJCET',
  contact_email: 'csi@mjcollege.ac.in',
  website_url: 'https://csi-mjcet.in',
  instagram_url: null as string | null,
  linkedin_url: null as string | null
};

/** Same logo the registration/ticket emails use (centered, white banner). */
const DEFAULT_LOGO_URL = 'https://csi-mjcet.in/logos/csi_logo.png';

async function withLetterhead(content: string, isLegacyHtml: boolean): Promise<string> {
  let settings: typeof LETTERHEAD_FALLBACK = { ...LETTERHEAD_FALLBACK };
  try {
    const { data } = await supabaseAdmin
      .from('platform_settings')
      .select('platform_name, contact_email, website_url, instagram_url, linkedin_url')
      .eq('id', 1)
      .maybeSingle();
    if (data) settings = { ...settings, ...Object.fromEntries(Object.entries(data).filter(([, v]) => v != null && v !== '')) as typeof LETTERHEAD_FALLBACK };
  } catch {
    /* fallback branding — never fail the email over the wrapper */
  }

  const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  // The logo is intentionally the SAME asset the registration emails use —
  // NOT platform_settings.logo_url (that slot currently holds a tiny low-res
  // webp that renders blocky). One swap here updates both flows together.
  const logoUrl = DEFAULT_LOGO_URL;

  const hostOf = (u: string) => {
    try {
      return new URL(u).hostname;
    } catch {
      return u.replace(/^https?:\/\//, '').split('/')[0] || u;
    }
  };
  const socials = [
    settings.instagram_url,
    settings.linkedin_url,
    settings.website_url
  ]
    .filter((u): u is string => !!u)
    .map((u) => `<a href="${esc(u)}" style="color:#71717a;text-decoration:none;">${esc(hostOf(u))}</a>`)
    .join(' &nbsp;·&nbsp; ');

  const contentBlock = isLegacyHtml
    ? content // legacy authors manage their own tags/spacing
    : content; // the plain-text renderBody already embeds its pre-wrap styling

  return `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;">
<div style="margin:0;padding:24px 12px;background:#f4f4f5;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
    <!-- Centered logo banner — same identity as the registration/ticket emails -->
    <div style="background-color:#ffffff;padding:20px;text-align:center;border-bottom:1px solid #e2e8f0;">
      <img src="${esc(logoUrl)}" alt="${esc(settings.platform_name)}" style="height:70px;object-fit:contain;" />
    </div>
    <div style="padding:24px;">${contentBlock}</div>
    <div style="border-top:1px solid #e2e8f0;padding:13px 24px;background:#fafafa;text-align:center;color:#71717a;font-size:11px;line-height:1.6;">
      ${settings.contact_email ? `<a href="mailto:${esc(settings.contact_email)}" style="color:#71717a;text-decoration:none;">${esc(settings.contact_email)}</a>` : ''}
      ${socials ? ` &nbsp;·&nbsp; ${socials}` : ''}
    </div>
  </div>
</div>
</body>
</html>`;
}
