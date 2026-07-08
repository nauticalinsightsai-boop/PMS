'use client';

import type { InteractionSource } from '@/lib/interactions/types';

export type ClientInteractionBody = {
  source: InteractionSource;
  subject: string;
  email: string;
  payload?: Record<string, unknown>;
  /** Honeypot: leave empty */
  website?: string;
  company?: string;
};

export type SubmitPublicInteractionResult = {
  ok: boolean;
  error?: string;
  sheetsSynced?: boolean;
};

type InteractionPostResponse = {
  error?: string;
  sheetsSynced?: boolean;
  sheetsWarning?: string | null;
};

const SHEETS_SYNC_USER_ERROR =
  'We received your details but could not sync them to our records system. Please try again in a moment or contact us directly.';

export async function submitPublicInteraction(
  data: ClientInteractionBody
): Promise<SubmitPublicInteractionResult> {
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
    const json = (await res.json().catch(() => ({}))) as InteractionPostResponse;
    if (!res.ok) {
      return { ok: false, error: typeof json.error === 'string' ? json.error : 'Submission failed' };
    }
    if (typeof json.sheetsWarning === 'string' && json.sheetsWarning.trim()) {
      return { ok: false, error: SHEETS_SYNC_USER_ERROR, sheetsSynced: false };
    }
    return { ok: true, sheetsSynced: json.sheetsSynced === true };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}