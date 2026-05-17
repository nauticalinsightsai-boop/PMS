import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return jsonError('Database not configured', 503);
  }

  const body = await request.json().catch(() => ({}));
  const { source = 'contact', subject, email, payload = {}, metadata = {} } = body as {
    source?: string;
    subject?: string;
    email?: string;
    payload?: Record<string, unknown> & { email?: string; subject?: string };
    metadata?: Record<string, unknown>;
  };

  if (!email && !payload?.email) {
    return jsonError('Email is required', 400);
  }

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .insert({
      source,
      subject: subject ?? payload?.subject ?? 'New submission',
      email: email ?? payload?.email,
      payload,
      metadata,
      sheets_status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('form_submissions insert error:', error);
    return jsonError(error.message, 500);
  }

  return jsonOk({ data }, 201);
}
