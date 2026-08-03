import { createClient } from '@supabase/supabase-js';

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
      'Dashboard Supabase client configuration is unavailable: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured.',
    );
  }

  return { url, key };
}

function createSharedSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  if (url && key && !url.includes('placeholder') && !key.includes('placeholder')) {
    return createClient(url, key);
  }
  return createClient('https://placeholder.supabase.co', 'placeholder-key');
}

/** True only when real public Supabase env is present (not build placeholders). */
export const isSupabaseAuthConfigured = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
  return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
})();

export const supabase = createSharedSupabaseClient();
