import { supabaseAdmin } from "@/lib/supabaseAdmin";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");

  let query = supabaseAdmin
    .from("csi_team")
    .select("*")
    .eq("role", "gb")
    .eq("is_active", true)
    .order("sno", { ascending: true });

  if (year) {
    query = query.eq("team_year", year);
  }

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}
