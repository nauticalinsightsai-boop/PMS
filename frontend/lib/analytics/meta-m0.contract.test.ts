import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { certifications } from '@/data/certification-index';
import { stableAnalyticsEventId } from '@/lib/analytics/event-id';
import {
  normalizeVerifiedStripeMoney,
  verifiedPurchaseMoney,
} from '@/services/enrollment';

const root = join(process.cwd(), '..');
const source = (path: string) => readFileSync(join(root, path), 'utf8');

describe('Meta M0 source contract', () => {
  it('covers every current certification detail through one registry-driven tracker', () => {
    expect(certifications).toHaveLength(27);
    expect(new Set(certifications.map((cert) => cert.id)).size).toBe(27);
    const detail = source('frontend/components/pages/CertificationDetail.tsx');
    expect(detail).toContain('<CertificationViewContentTracker');
    expect(detail).toContain('certificationId={cert.id}');
    expect(detail).not.toContain("cert.id === 'pmp' ? <PmpViewContentTracker");
  });

  it('derives stable provider-bound dedupe IDs', () => {
    expect(stableAnalyticsEventId('checkout', 'cs_test_123')).toBe(
      'checkout_cs_test_123',
    );
    expect(stableAnalyticsEventId('purchase', 'cs_test_123')).toBe(
      'purchase_cs_test_123',
    );
  });

  it('tracks checkout only from successful session-returning services', () => {
    for (const path of [
      'frontend/services/regional.ts',
      'frontend/services/checkout.ts',
      'frontend/services/enrollment.ts',
    ]) {
      const service = source(path);
      expect(service).toContain('const sessionId = result.data?.session.sessionId');
      expect(service).toContain('if (sessionId)');
      expect(service).toContain('trackBeginCheckout(');
    }
    expect(source('frontend/components/checkout/CheckoutForm.tsx')).not.toContain(
      'PMS_EVENTS.BEGIN_CHECKOUT',
    );
    expect(source('frontend/components/pages/MembershipCheckout.tsx')).not.toContain(
      'PMS_EVENTS.BEGIN_CHECKOUT',
    );
  });

  it('keeps browser booking confirmation GA-only and Meta Schedule server-only', () => {
    const booking = source(
      'frontend/app/(site)/booking-confirmed/BookingConfirmedClient.tsx',
    );
    expect(booking).toContain("trackGaEvent('booking_confirmed'");
    expect(booking).not.toContain('trackMetaSchedule');
    const webhook = source('packages/booking-crm/src/calendly/webhook.ts');
    expect(webhook).toContain("metaEvent: 'Schedule'");
    expect(webhook).toContain('bookingConversionEventId(webhook.inviteeUri)');
  });

  it('uses independent analytics and marketing consent for Purchase', () => {
    const purchase = source('frontend/lib/analytics/track-purchase-once.ts');
    expect(purchase).toContain("hasAnalyticsConsent()");
    expect(purchase).toContain("hasMarketingConsent()");
    expect(purchase).toContain("alreadyFired(opts.transactionId, 'ga')");
    expect(purchase).toContain("alreadyFired(opts.transactionId, 'meta')");
    expect(purchase).toContain("stableAnalyticsEventId('purchase', opts.transactionId)");
  });

  it('normalizes only verified Stripe monetary fields', () => {
    expect(normalizeVerifiedStripeMoney('USD', 89900)).toEqual({
      currency: 'usd',
      amountTotal: 89900,
    });
    for (const [currency, amount] of [
      ['', 89900],
      ['US', 89900],
      ['usd', -1],
      ['usd', 1.5],
      ['usd', Number.NaN],
      ['usd', '89900'],
    ]) {
      const normalized = normalizeVerifiedStripeMoney(currency, amount);
      expect(normalized.currency && normalized.amountTotal !== undefined).toBeFalsy();
    }
  });

  it('creates Purchase input only from a paid verified Stripe response', () => {
    expect(
      verifiedPurchaseMoney({
        paid: true,
        sessionId: 'cs_test_paid',
        currency: 'USD',
        amountTotal: 89900,
      }),
    ).toEqual({
      transactionId: 'cs_test_paid',
      currency: 'usd',
      value: 899,
    });
    for (const data of [
      { paid: false, sessionId: 'cs_test_unpaid', currency: 'usd', amountTotal: 89900 },
      { paid: true, sessionId: '', currency: 'usd', amountTotal: 89900 },
      { paid: true, sessionId: 'cs_test_missing', currency: 'usd' },
      { paid: true, sessionId: 'cs_test_bad', currency: 'usd', amountTotal: -1 },
      { paid: true, sessionId: 'cs_test_bad_currency', currency: 'US', amountTotal: 89900 },
    ]) {
      expect(verifiedPurchaseMoney(data)).toBeNull();
    }
  });

  it('wires all three paid-success consumers to verified monetary fields', () => {
    for (const path of [
      'frontend/app/(site)/checkout/store/success/page.tsx',
      'frontend/app/(site)/membership/checkout/success/page.tsx',
      'frontend/components/pages/ProgramEnrollmentSuccess.tsx',
    ]) {
      const consumer = source(path);
      expect(consumer).toContain('verifiedPurchaseMoney(result.data)');
      expect(consumer).toContain('currency: verifiedMoney.currency');
      expect(consumer).toContain('value: verifiedMoney.value');
      expect(consumer).toContain('|| !verifiedMoney');
    }
  });

  it('returns Stripe monetary fields only from the verified session object', () => {
    const route = source('backend/app/api/checkout/session/[id]/route.ts');
    expect(route).toContain('currency: session.currency ?? null');
    expect(route).toContain('amountTotal: session.amount_total ?? null');
    expect(route).not.toContain('searchParams');
  });
});
