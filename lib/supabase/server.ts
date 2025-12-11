import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseURL || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file.'
    );
  }

  // Validate URL format
  try {
    new URL(supabaseURL);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SUPABASE_URL format. It must be a valid HTTP/HTTPS URL. Current value: ${supabaseURL || 'undefined'}`
    );
  }

  return createClient(supabaseURL, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Export a function that returns the client (lazy initialization)
export const supabase = getSupabaseClient();