import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim() ||
    ''
  );
}

function getServiceRole(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';
}

export function isSupabaseConfigured(): boolean {
  const key = getServiceRole();
  return Boolean(getUrl() && key && !key.includes('placeholder'));
}

export function getSupabaseAdmin(): SupabaseClient {
  const url = getUrl();
  const key = getServiceRole();
  if (!url || !key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are required');
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
