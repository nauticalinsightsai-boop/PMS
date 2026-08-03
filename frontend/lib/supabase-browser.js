/**
 * Browser Supabase client factory (JavaScript).
 * Used by client components that cannot import the TypeScript module directly.
 */
import { createClient } from '@supabase/supabase-js';

export function requireBrowserSupabaseConfig(urlValue, keyValue) {
  const url = urlValue?.trim();
  const key = keyValue?.trim();

  if (
    !url ||
    !key ||
    url.includes('placeholder') ||
    key.includes('placeholder')
  ) {
    throw new Error(
      'Supabase browser client configuration is unavailable: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured.',
    );
  }

  return { url, key };
}

export function createBrowserSupabaseClient() {
  const { url, key } = requireBrowserSupabaseConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return createClient(url, key);
}
