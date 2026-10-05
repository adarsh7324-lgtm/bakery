/**
 * Supabase Client
 *
 * VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in:
 *   - Local dev: .env file
 *   - Vercel: Project Settings → Environment Variables
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// ─── Credentials ─────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env['VITE_SUPABASE_URL'] as string;
const SUPABASE_ANON_KEY = import.meta.env['VITE_SUPABASE_ANON_KEY'] as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "[Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. " +
    "Add them to your .env file locally and to Environment Variables on Vercel."
  );
}

// ─── Client ──────────────────────────────────────────────────────────────────
// Fall back to placeholder values so the module loads without crashing.
// API calls will fail gracefully until real credentials are provided.
export const supabase = createClient<any>(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);

export default supabase;

