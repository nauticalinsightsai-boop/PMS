import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

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

export async function POST(request: Request) {
  const authenticatedUserId = await resolveAuthenticatedUserId(request);
  if (!authenticatedUserId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const { userId, regionId, gccCountry } = body as {
    userId?: string;
    regionId?: string;
    gccCountry?: string | null;
  };

  if (!regionId) {
    return Response.json({ error: 'regionId is required' }, { status: 400 });
  }

  if (userId && userId !== authenticatedUserId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!isSupabaseConfigured) {
    return Response.json({ saved: false, reason: 'Database not configured' });
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

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ saved: true });
}
