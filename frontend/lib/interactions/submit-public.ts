'use client';

import type { WebsiteFormContextInput } from '@pms/booking-crm/form-submissions';
import { buildWebsiteFormContext } from '@pms/booking-crm/form-submissions';
import { collectLeadTrackingContext } from '@/lib/analytics/lead-tracking-context';

export type InteractionSource =
  | 'contact'
  | 'meeting_booking'
  | 'pmp_roadmap_lead'
  | 'cert_roadmap_lead'
  | 'consultation'
  | 'waitlist'
  | 'scholarship_review'
  | 'subscription'
  | string;

export type ClientInteractionBody = {
  source: InteractionSource;
  subject: string;
  email: string;
  payload?: Record<string, unknown>;
  /** Merged into payload for CRM origin / page tracking */
  formContext?: WebsiteFormContextInput;
  /** Honeypot: leave empty */
  website?: string;
  company?: string;
};

export async function submitPublicInteraction(
  data: ClientInteractionBody,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const contextFields = data.formContext
      ? buildWebsiteFormContext(data.formContext)
      : {};
    const leadTracking = await collectLeadTrackingContext();

    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: data.source,
        subject: data.subject,
        email: data.email,
        payload: {
          ...contextFields,
          ...leadTracking,
          ...(data.payload ?? {}),
        },
        metadata: {
          clientSubmittedAt: new Date().toISOString(),
        },
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