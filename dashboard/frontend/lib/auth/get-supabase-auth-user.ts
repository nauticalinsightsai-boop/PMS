import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';

export async function getSupabaseAuthUser() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;

  const headerStore = await headers();
  const authHeader = headerStore.get('authorization');
  const cookieStore = await cookies();
  const token =
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null) ||
    cookieStore.get('sb-access-token')?.value ||
    null;

  if (!token) return null;

  const supabase = createClient(url, anon);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
