import { describe, expect, it } from 'vitest';
import { sanitizeBookingHandoff } from './handoff';

describe('sanitizeBookingHandoff', () => {
  it('retains consent-safe attribution without accepting contact PII', () => {
    const sanitized = sanitizeBookingHandoff({
      pagePath: '/go/instagram',
      channel: 'instagram',
      funnelLabel: 'mentor-intro',
      attribution: {
        consent_analytics: true,
        consent_marketing: false,
        ga_client_id: '123.456',
        utm_source: 'instagram',
        fbclid: 'raw-click-id',
        email: 'candidate@example.com',
        phone: '+974 3365 2500',
      },
    });

    expect(sanitized.analytics_client_id).toBe('123.456');
    expect(sanitized.attribution).toEqual({ utm_source: 'instagram' });
    expect(JSON.stringify(sanitized)).not.toContain('candidate@example.com');
    expect(JSON.stringify(sanitized)).not.toContain('3365');
    expect(JSON.stringify(sanitized)).not.toContain('raw-click-id');
  });

  it('retains click IDs only after marketing consent', () => {
    const sanitized = sanitizeBookingHandoff({
      attribution: {
        consent_marketing: true,
        fbclid: 'fb-click',
        gclid: 'google-click',
      },
    });
    expect(sanitized.attribution).toMatchObject({
      fbclid: 'fb-click',
      gclid: 'google-click',
    });
  });
});
