'use client';

import type { InteractionSource } from '@/lib/interactions/types';

export type ClientInteractionBody = {
  source: InteractionSource;
  subject: string;
  email: string;
  payload?: Record<string, unknown>;
  /** Honeypot — leave empty */
  website?: string;
  company?: string;
};

export async function submitPublicInteraction(
  data: ClientInteractionBody
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: data.source,
        subject: data.subject,
        email: data.email,
        payload: data.payload ?? {},
        website: data.website ?? '',
        company: data.company ?? '',
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      return { ok: false, error: typeof json.error === 'string' ? json.error : 'Submission failed' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}
