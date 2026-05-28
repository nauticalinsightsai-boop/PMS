import { describe, expect, it } from 'vitest';

import {
  collectInteractionRequestMetadata,
  getClientIp,
  getInteractionClientIp,
} from '@/lib/interactions/request-ip';

function mockRequest(headers: Record<string, string>) {
  return {
    headers: {
      get(name: string) {
        const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
        return key ? headers[key] : null;
      },
    },
  };
}

describe('getInteractionClientIp', () => {
  it('prefers cf-connecting-ip', () => {
    const req = mockRequest({
      'cf-connecting-ip': '203.0.113.10',
      'x-forwarded-for': '198.51.100.1',
    });
    expect(getInteractionClientIp(req)).toBe('203.0.113.10');
  });

  it('falls back to first x-forwarded-for hop', () => {
    const req = mockRequest({ 'x-forwarded-for': '198.51.100.2, 10.0.0.1' });
    expect(getInteractionClientIp(req)).toBe('198.51.100.2');
  });

  it('returns unknown via getClientIp when missing', () => {
    expect(getClientIp(mockRequest({}))).toBe('unknown');
  });
});

describe('collectInteractionRequestMetadata', () => {
  it('includes client_ip, user_agent, and referrer', () => {
    const meta = collectInteractionRequestMetadata(
      mockRequest({
        'x-real-ip': '203.0.113.44',
        'user-agent': 'TestAgent/1.0',
        referer: 'https://example.com/contact',
      })
    );
    expect(meta).toEqual({
      client_ip: '203.0.113.44',
      user_agent: 'TestAgent/1.0',
      referrer: 'https://example.com/contact',
    });
  });
});
