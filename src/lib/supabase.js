import { createClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) return "";

  // Strip /rest/v1 suffix if DATABASE_URL was set to REST API endpoint
  return url.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

const supabaseUrl = getSupabaseUrl();
const supabaseKey = process.env.SUPABASE_ANON_KEY;

/**
 * Server-side Supabase client instance.
 * Configured with persistSession: false for stateless Node.js / Server environments.
 */
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
}
);

/**
 * Helper function to instantiate a fresh server-side Supabase client.
 */
export function createServerClient() {
  const url = getSupabaseUrl();
  const key = process.env.SUPABASE_ANON_KEY;
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
  );
}

export default supabase;
