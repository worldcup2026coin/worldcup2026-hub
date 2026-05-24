import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getRequiredServerEnv } from "@/lib/env";

export function createSupabaseAdminClient(): SupabaseClient {
  const supabaseUrl = getRequiredServerEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseSecretKey || supabaseSecretKey.trim().length === 0) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY server environment variable."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
