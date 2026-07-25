import { describe, expect, it } from 'vitest';
import {
  sanitizeInteractionPayload,
  sanitizeTrustedInteractionTracking,
} from './payload-sanitize';

describe('trusted interaction tracking boundary', () => {
  it('lets the dedicated trusted channel overwrite form-controlled collisions', () => {
    const formPayload = sanitizeInteractionPayload({
      consent_marketing: true,
      fbclid: 'form-controlled-click',
      ga_client_id: 'form-controlled-client',
    });
    const trusted = sanitizeTrustedInteractionTracking({
      consent_analytics: false,
      consent_marketing: false,
      fbclid: 'unconsented-click',
      ga_client_id: 'unconsented-client',
    });

    expect({ ...formPayload, ...trusted }).toEqual({
      consent_marketing: false,
      consent_analytics: false,
    });
  });

  it('retains consented identifiers from the dedicated channel', () => {
    expect(
      sanitizeTrustedInteractionTracking({
        consent_analytics: true,
        consent_marketing: true,
        ga_client_id: '123.456',
        fbclid: 'fb-click',
      }),
    ).toMatchObject({
      consent_analytics: true,
      consent_marketing: true,
      ga_client_id: '123.456',
      fbclid: 'fb-click',
    });
  });
});
