import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { interactionsToCsv } from '@/lib/csv-export.js';

export async function GET() {
  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const csv = interactionsToCsv(data ?? []);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="interactions.csv"',
    },
  });
}
