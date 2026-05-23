import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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
  };

  const { error } = await supabaseAdmin
    .from('form_submissions')
    .update({ metadata })
    .eq('id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ approved: true, id });
}
