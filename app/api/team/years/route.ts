import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("csi_team")
    .select("team_year")
    .eq("is_active", true);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // Get unique years and sort them descending (e.g., '2026-27' before '2025-26')
  const years = Array.from(new Set(data.map((row) => row.team_year)))
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));

  return Response.json(years);
}
