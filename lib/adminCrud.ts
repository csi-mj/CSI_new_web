import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireAdmin, adminError } from '@/lib/adminAuth';

/** Generic CRUD handlers for simple admin-managed tables. */
export function makeCrudHandlers(table: string, orderBy = 'created_at', ascending = false) {
  return {
    async GET(request: Request) {
      const check = await requireAdmin();
      if (!check.ok) return adminError(check);

      const url = new URL(request.url);
      let query = supabaseAdmin.from(table).select('*').order(orderBy, { ascending });
      for (const [key, value] of url.searchParams.entries()) {
        if (key !== 'order') query = query.eq(key, value);
      }
      const { data, error } = await query;
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data);
    },

    async POST(request: Request) {
      const check = await requireAdmin();
      if (!check.ok) return adminError(check);

      const body = await request.json();
      const { data, error } = await supabaseAdmin.from(table).insert(body).select().single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data, { status: 201 });
    },

    async PUT(request: Request) {
      const check = await requireAdmin();
      if (!check.ok) return adminError(check);

      const { id, ...fields } = await request.json();
      if (!id) return Response.json({ error: 'id is required' }, { status: 400 });
      const { data, error } = await supabaseAdmin
        .from(table)
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json(data);
    },

    async DELETE(request: Request) {
      const check = await requireAdmin();
      if (!check.ok) return adminError(check);

      const { id } = await request.json();
      if (!id) return Response.json({ error: 'id is required' }, { status: 400 });
      const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
      if (error) return Response.json({ error: error.message }, { status: 500 });
      return Response.json({ success: true });
    }
  };
}
