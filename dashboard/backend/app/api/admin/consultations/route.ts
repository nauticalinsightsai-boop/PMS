import type { NextRequest } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdminRoute } from '@/lib/auth/admin-route-auth';

export async function GET(request: NextRequest) {
  const auth = await requireAdminRoute(request);
  if (auth instanceof Response) return auth;

  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }
  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('*')
    .eq('source', 'consultation')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ consultations: data });
}
