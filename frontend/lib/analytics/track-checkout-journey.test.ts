import { beforeEach, describe, expect, it, vi } from 'vitest';

const createEventId = vi.hoisted(() => vi.fn());
const trackBeginCheckout = vi.hoisted(() => vi.fn());
const pushAnalyticsEvent = vi.hoisted(() => vi.fn(() => true));

vi.mock('@/lib/analytics/event-id', () => ({
  createAnalyticsEventId: createEventId,
}));
vi.mock('@/lib/analytics/track-begin-checkout', () => ({
  trackBeginCheckout,
}));
vi.mock('@/lib/analytics/push-event', () => ({
  pushAnalyticsEvent,
}));

import { PMS_EVENTS } from '@/lib/analytics/pms-events';
import {
  createCheckoutAttemptId,
  trackCheckoutInitiated,
  trackCheckoutSessionCreated,
  trackCheckoutSuccessView,
} from '@/lib/analytics/track-checkout-journey';

describe('checkout journey measurement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createEventId.mockImplementation((prefix: string) => `${prefix}_opaque`);
  });

  it('uses one opaque checkout attempt identity for begin and session-created events', () => {
    const checkoutAttemptId = createCheckoutAttemptId();
    const context = {
      checkoutAttemptId,
      packageType: 'membership' as const,
      offeringId: 'membership_professional_monthly',
      paymentType: 'monthly',
      currency: 'USD',
      value: 19,
    };

    trackCheckoutInitiated(context);
    trackCheckoutSessionCreated(context);

    expect(checkoutAttemptId).toBe('checkout_attempt_opaque');
    expect(trackBeginCheckout).toHaveBeenCalledWith(
      expect.objectContaining({
        checkout_attempt_id: checkoutAttemptId,
        package_type: 'membership',
      }),
    );
    expect(pushAnalyticsEvent).toHaveBeenCalledWith(
      PMS_EVENTS.CHECKOUT_SESSION_CREATED,
      expect.objectContaining({
        checkout_attempt_id: checkoutAttemptId,
        event_id: 'checkout_session_created_opaque',
      }),
    );
  });

  it('never places Stripe session IDs, client secrets, or contact PII in analytics', () => {
    const context = {
      checkoutAttemptId: 'checkout_attempt_safe',
      packageType: 'resource' as const,
      offeringId: 'pmp-guide',
    };

    trackCheckoutInitiated(context);
    trackCheckoutSessionCreated(context);

    const payloads = [
      trackBeginCheckout.mock.calls[0]?.[0],
      pushAnalyticsEvent.mock.calls[0]?.[1],
    ];
    for (const payload of payloads) {
      expect(payload).not.toHaveProperty('sessionId');
      expect(payload).not.toHaveProperty('session_id');
      expect(payload).not.toHaveProperty('clientSecret');
      expect(payload).not.toHaveProperty('client_secret');
      expect(payload).not.toHaveProperty('email');
      expect(payload).not.toHaveProperty('name');
      expect(payload).not.toHaveProperty('phone');
    }
  });

  it('records success-view as a non-revenue acknowledgement', () => {
    trackCheckoutSuccessView({
      packageType: 'professional',
      resultState: 'verified_paid',
      offeringId: 'pmp-professional',
      paymentType: 'seat_deposit',
      pagePath: '/certifications/pmp/professional/enroll/success',
    });

    expect(pushAnalyticsEvent).toHaveBeenCalledWith(
      PMS_EVENTS.CHECKOUT_SUCCESS_VIEW,
      expect.objectContaining({
        event_id: 'checkout_success_view_opaque',
        checkout_result_state: 'verified_paid',
      }),
    );
    expect(pushAnalyticsEvent).not.toHaveBeenCalledWith(
      PMS_EVENTS.PURCHASE,
      expect.anything(),
    );
  });
});
