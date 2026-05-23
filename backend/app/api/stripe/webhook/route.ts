import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonOk } from '@/lib/response-helpers.js';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const sessionId = (payload as { data?: { object?: { id?: string } } })?.data?.object?.id;

  if (isSupabaseConfigured && sessionId) {
    await supabaseAdmin
      .from('orders')
      .update({ status: 'paid', updated_at: new Date().toISOString() })
      .eq('stripe_session_id', sessionId);
  }

  return jsonOk({ received: true });
}
