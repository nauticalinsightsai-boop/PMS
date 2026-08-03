import { describe, expect, it } from 'vitest';
import { buildEnrollmentSuccessRedirect } from './checkout-success-redirect';

describe('checkout success enrollment redirect', () => {
  it('preserves the Stripe session id through the enrollment handoff', () => {
    expect(
      buildEnrollmentSuccessRedirect(
        '/certifications/pmp/professional/enroll/success',
        'pmp-preparation-professional',
        'cs_paid_1',
      ),
    ).toBe(
      '/certifications/pmp/professional/enroll/success?offering=pmp-preparation-professional&session_id=cs_paid_1',
    );
  });

  it('does not fabricate a session id when the source URL has none', () => {
    expect(
      buildEnrollmentSuccessRedirect(
        '/certifications/pmp/professional/enroll/success',
        'pmp-preparation-professional',
        null,
      ),
    ).toBe(
      '/certifications/pmp/professional/enroll/success?offering=pmp-preparation-professional',
    );
  });
});
