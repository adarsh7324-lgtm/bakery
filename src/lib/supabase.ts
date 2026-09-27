/**
 * Supabase Client
 *
 * Replace the placeholder values below with your actual Supabase
 * Project URL and Anon (public) Key before use.
 *
 * These come from: Supabase Dashboard → Your Project → Settings → API
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// ─── Credentials ─────────────────────────────────────────────────────────────
// TODO: Replace with your real values or load from env vars
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
    "Add them to your .env file."
  );
}

// ─── Client ──────────────────────────────────────────────────────────────────
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export default supabase;
