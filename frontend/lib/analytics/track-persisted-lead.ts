'use client';

import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { trackMetaLead } from '@/lib/analytics/meta-browser';
import { mapRegionIdToAnalyticsRegion } from '@/lib/analytics/pms-events';

const STORAGE_KEY = 'analytics_persisted_lead_events_v1';
const MAX_TRACKED_SUBMISSIONS = 50;
const trackedSubmissionIds = new Set<string>();

export type PersistedLeadTrackingInput = {
  clientSubmissionId: string;
  submissionId: string;
  formVersion?: string;
  source: string;
  formId?: string;
  formPlacement?: string;
  pagePath?: string;
  regionId?: string;
  channel?: string;
  goSlug?: string;
};

function readTrackedSubmissionIds(): string[] {
  if (typeof sessionStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]') as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

function rememberSubmission(clientSubmissionId: string): boolean {
  if (!clientSubmissionId || trackedSubmissionIds.has(clientSubmissionId)) return false;

  const stored = readTrackedSubmissionIds();
  if (stored.includes(clientSubmissionId)) {
    trackedSubmissionIds.add(clientSubmissionId);
    return false;
  }

  trackedSubmissionIds.add(clientSubmissionId);
  if (typeof sessionStorage !== 'undefined') {
    try {
      const next = [...stored, clientSubmissionId].slice(-MAX_TRACKED_SUBMISSIONS);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // In-memory dedupe still applies when storage is unavailable.
    }
  }
  return true;
}

/**
 * Track one canonical lead conversion after the public interaction API confirms
 * the authoritative persisted submission. Only allow-listed non-PII context is
 * accepted, and the client idempotency key is reused as the browser/CAPI event id.
 */
export function trackPersistedLeadSuccess(input: PersistedLeadTrackingInput): boolean {
  if (!input.submissionId.trim()) return false;
  if (!rememberSubmission(input.clientSubmissionId)) return false;

  const channel = input.channel ?? input.goSlug;
  const formId = input.formId ?? input.source;
  const eventId = input.clientSubmissionId;

  pushAnalyticsEvent('generate_lead', {
    event_id: eventId,
    submission_id: input.submissionId,
    ...(input.formVersion ? { form_version: input.formVersion } : {}),
    lead_source: input.source,
    form_id: formId,
    ...(input.formPlacement ? { form_placement: input.formPlacement } : {}),
    ...(input.pagePath ? { page_path: input.pagePath } : {}),
    ...(input.regionId
      ? { region_group: mapRegionIdToAnalyticsRegion(input.regionId) }
      : {}),
    ...(channel
      ? {
          channel,
          go_slug: input.goSlug ?? channel,
          content_group: 'go_portal',
        }
      : {}),
  });

  trackMetaLead(
    {
      content_name: formId,
      content_category: 'lead_form',
      ...(input.formPlacement ? { form_placement: input.formPlacement } : {}),
    },
    eventId,
  );

  return true;
}

export function clearPersistedLeadTrackingState(): void {
  trackedSubmissionIds.clear();
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore blocked storage.
  }
}
