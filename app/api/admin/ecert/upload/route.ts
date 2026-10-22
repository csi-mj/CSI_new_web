import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';

/**
 * E-certificate-specific upload with nested bucket paths:
 *   ecert/backgrounds/…   rasterized certificate background
 *   ecert/assets/…        element images (logos, signatures)
 *   ecert/renders/<templateId>/<recipientId>.<ext>   per-recipient renders
 *
 * The generic /api/admin/upload route supports single-level paths only, and
 * the send route's security regex requires the ecert/renders/<templateId>
 * layout — hence this dedicated route. All client inputs are pre-rasterized /
 * downscaled (≤ ~3 MB) for the Vercel 4.5 MB serverless body limit.
 */

const PATH_RE = /^ecert\/(?:backgrounds|assets|renders)\/[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\.(png|jpe?g|pdf)$/;
const MAX_SIZE = 3.5 * 1024 * 1024; // client-side processing keeps everything ≤ ~3 MB

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const path = String(formData.get('path') ?? '');

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });
    if (!PATH_RE.test(path) || path.includes('..')) {
      return Response.json({ error: 'Invalid target path' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: `File too large (${(file.size / 1048576).toFixed(1)} MB) — max 3.5 MB after client-side processing` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabaseAdmin.storage
      .from('media')
      .upload(path, buffer, { contentType: file.type, upsert: true });

    if (error) {
      console.error('[ecert] storage upload error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage.from('media').getPublicUrl(path);
    return Response.json({ url: data.publicUrl, path });
  } catch (err) {
    console.error('[ecert] upload failed:', err);
    const message = err instanceof Error ? err.message : 'Upload failed';
    return Response.json({ error: message }, { status: 500 });
  }
}