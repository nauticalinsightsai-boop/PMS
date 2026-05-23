import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';
import type { RegionId } from '@/lib/regional-catalogue';

/** Upsert user_profiles.region_id (requires authenticated user id). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { userId, regionId, gccCountry } = body as {
    userId?: string;
    regionId?: RegionId;
    gccCountry?: string | null;
  };

  if (!userId || !regionId) {
    return jsonError('userId and regionId are required', 400);
  }

  if (!isSupabaseConfigured) {
    return jsonOk({ saved: false, reason: 'Database not configured' });
  }

  const { error } = await supabaseAdmin.from('user_profiles').upsert(
    {
      id: userId,
      region_id: regionId,
      gcc_country: gccCountry ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) return jsonError(error.message, 500);
  return jsonOk({ saved: true });
}
