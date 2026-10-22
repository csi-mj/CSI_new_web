import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';

/**
 * Admin-authed byte proxy for e-certificate assets and renders.
 *
 * WHY: images loaded via a cross-origin <img src> taint the canvas — a tainted
 * canvas cannot be exported (toDataURL / toBlob throw). Fetching bytes through
 * this same-origin route and decoding via createImageBitmap keeps every canvas
 * export working, regardless of storage CORS behavior.
 *
 * SSRF-proof: only bucket paths under ecert/ with a safe charset are allowed.
 */
const PATH_RE = /^ecert\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(png|jpe?g|pdf|webp)$/;

export async function GET(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') ?? '';

    if (!PATH_RE.test(decodeURIComponent(path)) || path.includes('..')) {
      return Response.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.storage.from('media').download(decodeURIComponent(path));
    if (error || !data) {
      return Response.json(
        { error: error?.message || 'File not found' },
        { status: 404 }
      );
    }

    const mime = data.type || 'application/octet-stream';
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'private, max-age=300'
      }
    });
  } catch (err) {
    console.error('[ecert] file proxy failed:', err);
    return Response.json({ error: 'Failed to load file' }, { status: 500 });
  }
}