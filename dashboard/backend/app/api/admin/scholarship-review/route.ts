import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }
  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('*')
    .eq('source', 'scholarship_review')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ submissions: data });
}
