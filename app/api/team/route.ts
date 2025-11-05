import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("csi_team").select("*");

  if (error) return Response.json({ error: error.message }, { status: 500 });

  type TeamRow = { role: string } & Record<string, unknown>;
  const rows = (data as TeamRow[]) || [];
  const total = rows.length;
  const gb = rows.filter((m: TeamRow) => m.role === "gb").length;
  const core = rows.filter((m: TeamRow) => m.role === "core").length;
  const execom = rows.filter((m: TeamRow) => m.role === "execom").length;

  return Response.json({ total, gb, core, execom });
}
