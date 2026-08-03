'use client';

import type { WebsiteFormContextInput } from '@pms/booking-crm/form-submissions';
import { buildWebsiteFormContext } from '@pms/booking-crm/form-submissions';
import type { InteractionSource } from '@pms/booking-crm/form-submissions';
import { collectLeadTrackingContext } from '@/lib/analytics/lead-tracking-context';
import { trackPersistedLeadSuccess } from '@/lib/analytics/track-persisted-lead';

export type { InteractionSource };

export type ClientInteractionBody = {
  source: InteractionSource;
  subject: string;
  email: string;
  /** Stable for one logical form submission and reused if the client retries. */
  clientSubmissionId?: string;
  payload?: Record<string, unknown>;
  /** Merged into payload for CRM origin / page tracking */
  formContext?: WebsiteFormContextInput;
  /** Honeypot: leave empty */
  website?: string;
  company?: string;
};

export type SubmitPublicInteractionResult = {
  ok: boolean;
  error?: string;
  /** Authoritative Supabase submission ID returned by the API. */
  submissionId?: string;
  /** Client-generated idempotency key used for this logical submission. */
  clientSubmissionId?: string;
  /** True when the server appended the row to Google Sheets in the same request. */
  sheetsSynced?: boolean;
  /** True when secondary Sheets synchronization remains pending. */
  sheetsSyncPending?: boolean;
  /** True when the server recognized an idempotent replay. */
  idempotentReplay?: boolean;
};

type InteractionPostResponse = {
  id?: string;
  error?: string;
  sheetsSynced?: boolean;
  sheetsSyncPending?: boolean;
  sheetsWarning?: string | null;
  idempotentReplay?: boolean;
};

export function createClientSubmissionId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `lead_${globalThis.crypto.randomUUID()}`;
  }
  return `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 14)}`;
}

function resolveOptionalFormVersion(
  data: ClientInteractionBody,
): string | undefined {
  if (typeof data.formContext?.formVersion === 'string') {
    const fromContext = data.formContext.formVersion.trim();
    if (fromContext) return fromContext;
  }
  if (typeof data.payload?.formVersion === 'string') {
    const fromPayload = data.payload.formVersion.trim();
    if (fromPayload) return fromPayload;
  }
  return undefined;
}

export async function submitPublicInteraction(
  data: ClientInteractionBody,
): Promise<SubmitPublicInteractionResult> {
  const clientSubmissionId =
    data.clientSubmissionId?.trim() || createClientSubmissionId();

  try {
    const contextFields = data.formContext
      ? buildWebsiteFormContext(data.formContext)
      : {};
    const leadTracking = await collectLeadTrackingContext();

    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': clientSubmissionId,
      },
      body: JSON.stringify({
        source: data.source,
        subject: data.subject,
        email: data.email,
        clientSubmissionId,
        payload: {
          ...contextFields,
          ...(data.payload ?? {}),
        },
        tracking: leadTracking,
        metadata: {
          clientSubmittedAt: new Date().toISOString(),
        },
        website: data.website ?? '',
        company: data.company ?? '',
      }),
    });
    const json = (await res.json().catch(() => ({}))) as InteractionPostResponse;
    if (!res.ok) {
      return {
        ok: false,
        error: typeof json.error === 'string' ? json.error : 'Submission failed',
        clientSubmissionId,
      };
    }

    const submissionId = typeof json.id === 'string' ? json.id.trim() : '';
    const idempotentReplay = json.idempotentReplay === true;
    const isHoneypot = Boolean(data.website?.trim() || data.company?.trim());
    const formVersion = resolveOptionalFormVersion(data);

    if (!isHoneypot && !submissionId) {
      return {
        ok: false,
        error: 'Submission failed',
        clientSubmissionId,
        idempotentReplay,
      };
    }

    if (res.status === 201 && submissionId && !idempotentReplay && !isHoneypot) {
      trackPersistedLeadSuccess({
        clientSubmissionId,
        submissionId,
        formVersion,
        source: data.source,
        formId: data.formContext?.formId,
        formPlacement: data.formContext?.placement,
        pagePath: data.formContext?.pagePath,
        regionId: data.formContext?.regionId,
        channel: data.formContext?.channelKey,
        goSlug: data.formContext?.landingSlug,
      });
    }

    // A successful HTTP response means Supabase accepted the authoritative lead.
    // Sheets is a secondary operations sink and must never prompt a user retry.
    return {
      ok: true,
      submissionId: isHoneypot ? undefined : submissionId || undefined,
      clientSubmissionId,
      sheetsSynced: json.sheetsSynced === true,
      sheetsSyncPending:
        json.sheetsSyncPending === true ||
        (typeof json.sheetsWarning === 'string' && json.sheetsWarning.trim().length > 0),
      idempotentReplay,
    };
  } catch {
    return { ok: false, error: 'Network error', clientSubmissionId };
  }
}
