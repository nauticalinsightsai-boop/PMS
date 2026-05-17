/**
 * Browser Supabase client factory (JavaScript).
 * Used by client components that cannot import the TypeScript module directly.
 */
import { createClient } from '@supabase/supabase-js';

export function createBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}
