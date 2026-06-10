import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import { jsonError, jsonOk } from '@/lib/response-helpers.js';

export type InsertFormSubmissionInput = {
  source: string;
  subject?: string;
  email?: string;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  /** Honeypot — non-empty submissions are rejected silently */
  website?: string;
  company?: string;
};

function serverMetadata(request: Request): Record<string, unknown> {
  return {
    userAgent: request.headers.get('user-agent') ?? undefined,
    referer: request.headers.get('referer') ?? undefined,
    serverReceivedAt: new Date().toISOString(),
  };
}

export async function insertFormSubmission(
  request: Request,
  input: InsertFormSubmissionInput,
) {
  if (!isSupabaseConfigured) {
    return jsonError('Database not configured', 503);
  }

  if (input.website?.trim() || input.company?.trim()) {
    return jsonOk({ data: { ok: true } }, 201);
  }

  const payload = input.payload ?? {};
  const email =
    input.email ??
    (typeof payload.email === 'string' ? payload.email : undefined);

  if (!email?.trim()) {
    return jsonError('Email is required', 400);
  }

  const metadata = {
    ...serverMetadata(request),
    ...(input.metadata ?? {}),
  };

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .insert({
      source: input.source,
      subject:
        input.subject ??
        (typeof payload.subject === 'string' ? payload.subject : undefined) ??
        'New submission',
      email: email.trim(),
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
