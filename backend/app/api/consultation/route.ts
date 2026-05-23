import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, offeringId, regionId, name, message, topic } = body as Record<string, string>;

  if (!email) return jsonError('Email is required', 400);

  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin.from('form_submissions').insert({
      source: 'consultation',
      email,
      subject: topic ?? `Consultation: ${offeringId ?? 'pathway'}`,
      payload: { offeringId, regionId, name, message, topic },
      metadata: { type: 'consultation', approvalStatus: 'pending' },
    });
    if (error) return jsonError(error.message, 500);
  }

  return jsonOk({ submitted: true }, 201);
}
