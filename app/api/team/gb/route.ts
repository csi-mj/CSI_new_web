import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("csi_team")
    .select("*")
    .eq("role", "gb")
    .eq("is_active", true)
    .order("sno", { ascending: true });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}
