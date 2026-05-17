import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await context.params;

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .update({
      sheets_status: 'pending',
      metadata: { retry_at: new Date().toISOString() },
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data, message: 'Retry queued' });
}
