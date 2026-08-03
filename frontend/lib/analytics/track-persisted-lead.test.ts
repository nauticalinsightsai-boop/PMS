import { beforeEach, describe, expect, it, vi } from 'vitest';

const pushAnalyticsEvent = vi.hoisted(() => vi.fn());
const trackMetaLead = vi.hoisted(() => vi.fn(() => 'lead_event'));

vi.mock('@/lib/analytics/push-event', () => ({ pushAnalyticsEvent }));
vi.mock('@/lib/analytics/meta-browser', () => ({ trackMetaLead }));

import {
  clearPersistedLeadTrackingState,
  trackPersistedLeadSuccess,
} from '@/lib/analytics/track-persisted-lead';

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

describe('persisted public lead conversion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('sessionStorage', new MemoryStorage());
    clearPersistedLeadTrackingState();
  });

  it('emits one GA lead and one Meta Lead with the same opaque event id', () => {
    const input = {
      clientSubmissionId: 'lead_opaque_123',
      submissionId: 'submission_durable_123',
      source: 'contact',
      formVersion: 'p0.6.2-333-authoritative',
      formId: 'contact_form',
      formPlacement: 'footer',
      pagePath: '/contact',
      email: 'must-not-leak@example.com',
      phone: '+97400000000',
      message: 'free text must not leave the CRM',
    } as any;

    expect(trackPersistedLeadSuccess(input)).toBe(true);
    expect(trackPersistedLeadSuccess(input)).toBe(false);

    expect(pushAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(pushAnalyticsEvent).toHaveBeenCalledWith(
      'generate_lead',
      expect.objectContaining({
        event_id: 'lead_opaque_123',
        clientSubmissionId: 'lead_opaque_123',
        submission_id: 'submission_durable_123',
        form_version: 'p0.6.2-333-authoritative',
        lead_source: 'contact',
        form_id: 'contact_form',
        form_placement: 'footer',
      }),
    );
    expect(trackMetaLead).toHaveBeenCalledTimes(1);
    expect(trackMetaLead).toHaveBeenCalledWith(
      expect.objectContaining({
        content_name: 'contact_form',
        content_category: 'lead_form',
        form_placement: 'footer',
      }),
      'lead_opaque_123',
    );

    const gaPayload = pushAnalyticsEvent.mock.calls[0]?.[1];
    const metaPayload = (trackMetaLead as any).mock.calls[0]?.[0];
    for (const payload of [gaPayload, metaPayload]) {
      expect(payload).not.toHaveProperty('email');
      expect(payload).not.toHaveProperty('phone');
      expect(payload).not.toHaveProperty('message');
    }
  });
});
