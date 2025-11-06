import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("csi_team").select("*");

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const total = data.length;
  const gb = data.filter((m) => m.role === "gb").length;
  const core = data.filter((m) => m.role === "core").length;
  const execom = data.filter((m) => m.role === "execom").length;

  return Response.json({ total, gb, core, execom });
}
