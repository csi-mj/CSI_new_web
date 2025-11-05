// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - ambient types provided locally; suppress missing module types during typecheck
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
