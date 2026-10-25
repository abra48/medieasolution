import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase admin client that bypasses RLS.
 * Uses the service role key — NEVER expose this on the client side.
 * Falls back to anon key if service role key is not set (with warning).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceRoleKey || anonKey;

  if (!url || !key) {
    // During build, return a dummy client
    return createSupabaseClient(
      url || "https://placeholder.supabase.co",
      key || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }

  if (!serviceRoleKey) {
    console.warn(
      "[WARN] SUPABASE_SERVICE_ROLE_KEY not set. Using anon key for admin operations. " +
      "This may fail if RLS policies block the operation. " +
      "Set SUPABASE_SERVICE_ROLE_KEY in your environment variables."
    );
  }

  return createSupabaseClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
