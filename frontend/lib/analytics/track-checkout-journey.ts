'use client';

import { createAnalyticsEventId } from '@/lib/analytics/event-id';
import { trackBeginCheckout } from '@/lib/analytics/track-begin-checkout';
import { type PackageType, PMS_EVENTS } from '@/lib/analytics/pms-events';
import {
  pushAnalyticsEvent,
  type AnalyticsEventParams,
  type AnalyticsItem,
} from '@/lib/analytics/push-event';

export type CheckoutMeasurementContext = {
  checkoutAttemptId: string;
  packageType: PackageType;
  offeringId?: string;
  paymentType?: string;
  currency?: string;
  value?: number;
  items?: AnalyticsItem[];
  pagePath?: string;
};

export type CheckoutSuccessState = 'verified_paid' | 'not_verified_paid';

function contextParams(context: CheckoutMeasurementContext): AnalyticsEventParams {
  return {
    checkout_attempt_id: context.checkoutAttemptId,
    package_type: context.packageType,
    ...(context.offeringId ? { offering_id: context.offeringId } : {}),
    ...(context.paymentType ? { payment_type: context.paymentType } : {}),
    ...(context.currency ? { currency: context.currency } : {}),
    ...(typeof context.value === 'number' && Number.isFinite(context.value)
      ? { value: context.value }
      : {}),
    ...(context.items?.length ? { items: context.items } : {}),
    ...(context.pagePath ? { page_path: context.pagePath } : {}),
  };
}

/** Create one opaque identity for one explicit user-initiated checkout attempt. */
export function createCheckoutAttemptId(): string {
  return createAnalyticsEventId('checkout_attempt');
}

/** Call only from the explicit user action that starts a valid checkout attempt. */
export function trackCheckoutInitiated(context: CheckoutMeasurementContext): void {
  trackBeginCheckout(contextParams(context));
}

/**
 * Record that the server returned a usable Checkout Session without exposing
 * the Stripe session ID or client secret to analytics.
 */
export function trackCheckoutSessionCreated(context: CheckoutMeasurementContext): boolean {
  return pushAnalyticsEvent(PMS_EVENTS.CHECKOUT_SESSION_CREATED, {
    ...contextParams(context),
    event_id: createAnalyticsEventId('checkout_session_created'),
  });
}

/**
 * A client acknowledgement of the returned checkout page. This is explicitly
 * not revenue and must never be interpreted as a purchase.
 */
export function trackCheckoutSuccessView(params: {
  packageType: PackageType;
  resultState: CheckoutSuccessState;
  offeringId?: string;
  paymentType?: string;
  pagePath?: string;
}): boolean {
  return pushAnalyticsEvent(PMS_EVENTS.CHECKOUT_SUCCESS_VIEW, {
    event_id: createAnalyticsEventId('checkout_success_view'),
    package_type: params.packageType,
    checkout_result_state: params.resultState,
    ...(params.offeringId ? { offering_id: params.offeringId } : {}),
    ...(params.paymentType ? { payment_type: params.paymentType } : {}),
    ...(params.pagePath ? { page_path: params.pagePath } : {}),
  });
}
