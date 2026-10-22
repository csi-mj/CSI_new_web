/**
 * E-certificates — the email placeholder contract.
 * ONE source of truth used by BOTH the composer UI and the send route, so a
 * builtin can never exist on one side without the other.
 *
 * Two distinct placeholder namespaces:
 *   {{double-brace}} → emails only (this file)
 *   {single-brace}   → canvas artwork placeholders only (from sheet columns
 *                      bound to variable layers — never parsed here)
 */

/** All email-level builtin tokens — adding one here makes it work + suggested everywhere. */
export const EMAIL_BUILTIN_TOKENS = [
  'participant_name',
  'participant_email',
  'certificate_url',
  'certificate_format',
  'template_name'
] as const;

export const EMAIL_TOKEN_RE = /\{\{\s*([^{}]+?)\s*\}\}/g;

export interface TokenContext {
  /** The recipient being personalized for. */
  recipient: { name: string; email: string; rendered_url?: string | null };
  /** The template being sent. */
  template: { name: string; format: string };
  /** The recipient's imported spreadsheet row (canvas-bound columns live here). */
  rowData: Record<string, string>;
}

export interface TemplateKey {
  key: string;
  isToken: boolean;
}

/** Splits a template into literal / {{token}} segments, in order. */
export function tokenizeTemplate(template: string): TemplateKey[] {
  const segments: TemplateKey[] = [];
  EMAIL_TOKEN_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  let last = 0;
  while ((m = EMAIL_TOKEN_RE.exec(template))) {
    if (m.index > last) segments.push({ isToken: false, key: template.slice(last, m.index) });
    segments.push({ isToken: true, key: m[1] });
    last = m.index + m[0].length;
  }
  if (last < template.length) segments.push({ isToken: false, key: template.slice(last) });
  return segments;
}

/** Resolves one {{token}}: builtins from the recipient/template, then sheet columns. */
export function resolveTokenValue(rawKey: string, ctx: TokenContext): string {
  const key = rawKey.trim().toLowerCase();
  switch (key) {
    case 'participant_name':
      return ctx.recipient.name ?? '';
    case 'participant_email':
      return ctx.recipient.email ?? '';
    case 'certificate_url':
      return ctx.recipient.rendered_url ?? '';
    case 'certificate_format':
      return ctx.template.format ?? 'pdf';
    case 'template_name':
      return ctx.template.name ?? '';
    default: {
      const found = Object.keys(ctx.rowData ?? {}).find((c) => c.toLowerCase() === key);
      return found ? ctx.rowData[found] : '';
    }
  }
}

/** Substitutes every {{token}} in a template (values NOT escaped — callers decide). */
export function substituteTokens(template: string, ctx: TokenContext): string {
  return template.replace(EMAIL_TOKEN_RE, (_m, key: string) => resolveTokenValue(key, ctx));
}

/** Every {{token}} key actually referenced by a template. */
export function tokensUsed(...templates: string[]): string[] {
  const keys = new Set<string>();
  for (const t of templates) {
    if (!t) continue;
    EMAIL_TOKEN_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = EMAIL_TOKEN_RE.exec(t))) keys.add(m[1].trim());
  }
  return [...keys];
}