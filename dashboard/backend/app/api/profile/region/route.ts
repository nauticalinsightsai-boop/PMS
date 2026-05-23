import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { userId, regionId, gccCountry } = body as {
    userId?: string;
    regionId?: string;
    gccCountry?: string | null;
  };

  if (!userId || !regionId) {
    return Response.json({ error: 'userId and regionId are required' }, { status: 400 });
  }

  if (!isSupabaseConfigured) {
    return Response.json({ saved: false, reason: 'Database not configured' });
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

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ saved: true });
}
