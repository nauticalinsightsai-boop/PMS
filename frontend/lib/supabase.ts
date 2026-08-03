import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export function requirePublicSupabaseConfig(
  urlValue: string | undefined,
  keyValue: string | undefined,
) {
  const url = urlValue?.trim();
  const key = keyValue?.trim();

  if (
    !url ||
    !key ||
    url.includes('placeholder') ||
    key.includes('placeholder')
  ) {
    throw new Error(
      'Supabase client configuration is unavailable: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured.',
    );
  }

  return { url, key };
}

/**
 * Shared server/client module export.
 * Prefer configured public env when present; fall back to placeholders so
 * Next.js can collect static page data in environments that import this module
 * without calling Supabase (Vercel preview / local build). Runtime callers that
 * need a real backend should use requirePublicSupabaseConfig first.
 */
function createSharedSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  if (url && key && !url.includes('placeholder') && !key.includes('placeholder')) {
    return createClient(url, key);
  }
  return createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export const supabase = createSharedSupabaseClient();
