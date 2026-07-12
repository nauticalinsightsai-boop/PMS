import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import type { RegionId } from '@/lib/regional-catalogue';

async function resolveAuthenticatedUserId(request: Request): Promise<string | null> {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const accessToken = auth.slice(7).trim();
  if (!accessToken) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !anon || anon.includes('placeholder')) return null;

  const supabase = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user?.id) return null;
  return data.user.id;
}

/** Upsert user_profiles.region_id for the authenticated user only. */
export async function POST(request: Request) {
  const authenticatedUserId = await resolveAuthenticatedUserId(request);
  if (!authenticatedUserId) {
    return jsonError('Unauthorized', 401);
  }

  const body = await request.json().catch(() => ({}));
  const { regionId, gccCountry, userId } = body as {
    userId?: string;
    regionId?: RegionId;
    gccCountry?: string | null;
  };

  if (!regionId) {
    return jsonError('regionId is required', 400);
  }

  // Never trust client-supplied userId — bind to verified JWT subject.
  if (userId && userId !== authenticatedUserId) {
    return jsonError('Forbidden', 403);
  }

  if (!isSupabaseConfigured) {
    return jsonOk({ saved: false, reason: 'Database not configured' });
  }

  const { error } = await supabaseAdmin.from('user_profiles').upsert(
    {
      id: authenticatedUserId,
      region_id: regionId,
      gcc_country: gccCountry ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (error) return jsonError(error.message, 500);
  return jsonOk({ saved: true });
}
