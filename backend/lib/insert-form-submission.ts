import { jsonError, jsonOk } from '@/lib/response-helpers.js';

export type InsertFormSubmissionInput = {
  source: string;
  subject?: string;
  email?: string;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  /** Honeypot: non-empty submissions are rejected silently */
  website?: string;
  company?: string;
};

/**
 * Proxies legacy marketing API form routes to the dashboard interactions pipeline
 * (Supabase → admin email → Google Sheets background sync).
 */
export async function insertFormSubmission(
  request: Request,
  input: InsertFormSubmissionInput,
) {
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

  const base = (process.env.DASHBOARD_BACKEND_URL || 'http://localhost:3002').replace(/\/$/, '');

  const res = await fetch(`${base}/api/interactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(request.headers.get('x-forwarded-for')
        ? { 'x-forwarded-for': request.headers.get('x-forwarded-for')! }
        : {}),
      ...(request.headers.get('referer') ? { referer: request.headers.get('referer')! } : {}),
      ...(request.headers.get('user-agent')
        ? { 'user-agent': request.headers.get('user-agent')! }
        : {}),
    },
    body: JSON.stringify({
      source: input.source,
      subject:
        input.subject ??
        (typeof payload.subject === 'string' ? payload.subject : undefined) ??
        'New submission',
      email: email.trim(),
      payload: {
        ...payload,
        ...(input.metadata ?? {}),
      },
      website: input.website ?? '',
      company: input.company ?? '',
    }),
  });

  const text = await res.text();
  let body: unknown = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { error: text.slice(0, 200) || 'Invalid response from interactions API' };
  }

  if (!res.ok) {
    const err =
      typeof body === 'object' && body && 'error' in body && typeof (body as { error: unknown }).error === 'string'
        ? (body as { error: string }).error
        : 'Submission failed';
    return jsonError(err, res.status >= 400 && res.status < 600 ? res.status : 503);
  }

  return jsonOk({ data: body }, 201);
}
