import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/** Build-safe server client: null when public env is unset (CI / local without secrets). */
export function getOptionalServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  if (!url || !key || url.includes('placeholder') || key.includes('placeholder')) {
    return null;
  }
  return createClient(url, key);
}
