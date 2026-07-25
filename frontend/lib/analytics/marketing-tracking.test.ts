import { describe, expect, it } from 'vitest';
import { sanitizeGaParams } from '@/lib/analytics/send-ga-event';
import {
  consumeBookingConfirmation,
  issueBookingConfirmation,
} from '@/lib/analytics/booking-confirmation';
import { shouldTrackRoutePageView } from '@/lib/analytics/route-pageview';

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

describe('marketing tracking safeguards', () => {
  it('removes PII while preserving GA4 ecommerce items', () => {
    expect(
      sanitizeGaParams({
        transaction_id: 'cs_test_123',
        email: 'person@example.com',
        phone_number: '+97400000000',
        items: [
          {
            item_id: 'pmp',
            item_name: 'PMP programme',
            email: 'nested@example.com',
          },
        ],
      }),
    ).toEqual({
      transaction_id: 'cs_test_123',
      items: [{ item_id: 'pmp', item_name: 'PMP programme' }],
    });
  });

  it('tracks one pageview per unique App Router path', () => {
    expect(shouldTrackRoutePageView(null, '/certifications/pmp')).toBe(true);
    expect(
      shouldTrackRoutePageView('/certifications/pmp', '/certifications/pmp'),
    ).toBe(false);
    expect(
      shouldTrackRoutePageView(
        '/certifications/pmp',
        '/certifications/pmp?utm_campaign=gcc',
      ),
    ).toBe(true);
  });

  it('requires trusted Calendly proof and deduplicates refreshes', () => {
    const storage = new MemoryStorage();
    const uuid = 'invitee-123';
    expect(consumeBookingConfirmation(uuid, 'copied-url-token', storage)).toBe(
      'invalid',
    );

    const token = issueBookingConfirmation(uuid, storage);
    expect(consumeBookingConfirmation(uuid, token, storage)).toBe('track');
    expect(consumeBookingConfirmation(uuid, token, storage)).toBe('duplicate');
  });
});
