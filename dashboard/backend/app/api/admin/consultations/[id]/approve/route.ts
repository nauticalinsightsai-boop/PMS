import type { NextRequest } from 'next/server';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { requireAdminRoute } from '@/lib/auth/admin-route-auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminRoute(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from('form_submissions')
    .select('metadata, payload')
    .eq('id', id)
    .single();

  if (fetchError || !existing) {
    return Response.json({ error: fetchError?.message ?? 'Not found' }, { status: 404 });
  }

  const metadata = {
    ...(existing.metadata as Record<string, unknown>),
    approvalStatus: 'approved',
    approvedAt: new Date().toISOString(),
    approvedBy: auth.email,
  };

  const { error } = await supabaseAdmin
    .from('form_submissions')
    .update({ metadata })
    .eq('id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ approved: true, id });
}
