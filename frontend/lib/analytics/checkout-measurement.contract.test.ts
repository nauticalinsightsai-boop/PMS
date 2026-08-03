import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(__dirname, '../..');

function source(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('Stripe surface measurement contract', () => {
  it.each([
    'components/pages/MembershipCheckout.tsx',
    'components/pages/StoreCheckout.tsx',
    'components/enrollment/StripeEmbeddedSeatCheckout.tsx',
  ])('%s gates session creation behind an explicit user action', (relativePath) => {
    const text = source(relativePath);
    expect(text).toContain('Start secure checkout');
    expect(text).toContain('trackCheckoutInitiated');
    expect(text).toContain('trackCheckoutSessionCreated');
    expect(text.indexOf('trackCheckoutInitiated')).toBeLessThan(
      text.lastIndexOf('trackCheckoutSessionCreated'),
    );
  });

  it.each([
    'app/(site)/membership/checkout/success/page.tsx',
    'app/(site)/checkout/store/success/page.tsx',
    'components/pages/ProgramEnrollmentSuccess.tsx',
  ])('%s separates return acknowledgement from server-paid purchase', (relativePath) => {
    const text = source(relativePath);
    expect(text).toContain('trackCheckoutSuccessView');
    expect(text).toContain('trackPurchaseOnce');
    expect(text).toContain('verified.durableTransactionId');
    expect(text).toContain('verified.durablePurchaseEventId');
    expect(text).toContain('serverVerifiedPaid: true');
    expect(text).not.toContain('transactionId: sessionId');
    expect(text).not.toContain('durableTransactionId: sessionId');
  });
});
