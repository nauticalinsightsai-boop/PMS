import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request: Request) {
  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page') ?? 0);
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100);
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from('form_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data, count });
}
