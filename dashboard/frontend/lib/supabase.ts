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

const { url: supabaseUrl, key: supabaseAnonKey } =
  requirePublicSupabaseConfig(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

export const isSupabaseAuthConfigured = true;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
