import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';

const ALLOWED_FOLDERS = ['team', 'events', 'magazines', 'resources'];
const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(request: Request) {
  const check = await requireAdmin();
  if (!check.ok) return adminError(check);

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'misc';

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return Response.json({ error: 'Invalid folder' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: 'File too large (max 25MB)' }, { status: 400 });
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .slice(0, 60);
  const path = `${folder}/${Date.now()}-${safeName}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabaseAdmin.storage
    .from('media')
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data } = supabaseAdmin.storage.from('media').getPublicUrl(path);
  return Response.json({ url: data.publicUrl, path });
}
