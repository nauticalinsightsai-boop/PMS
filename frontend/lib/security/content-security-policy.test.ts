import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contentSecurityPolicy } from './content-security-policy';

const acceptedPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://connect.facebook.net https://js.stripe.com https://assets.calendly.com",
  "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.facebook.com https://*.supabase.co",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.facebook.com https://graph.facebook.com https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://api.calendly.com https://api.bigdatacloud.net",
  "frame-src https://js.stripe.com https://hooks.stripe.com https://calendly.com https://www.youtube.com https://www.youtube-nocookie.com",
  "media-src 'self' blob: https://*.supabase.co",
  "worker-src 'self' blob:",
].join('; ') + ';';

describe('enforced CSP', () => {
  it('is deterministic, source-bound, and duplicate-free with the accepted policy unchanged', () => {
    const value = contentSecurityPolicy();
    const names = value.split(';').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean);
    expect(value).toBe(acceptedPolicy);
    expect(names).toHaveLength(13);
    expect(new Set(names).size).toBe(names.length);
    for (const origin of ['https://www.googletagmanager.com', 'https://connect.facebook.net', 'https://js.stripe.com', 'https://*.supabase.co', 'https://api.calendly.com', 'https://www.youtube.com']) {
      expect(value).toContain(origin);
    }
    expect(value).toMatch(/script-src[^;]*https:\/\/assets\.calendly\.com/);
    expect(value).toMatch(/style-src[^;]*https:\/\/assets\.calendly\.com/);
    expect(value).toMatch(/connect-src[^;]*https:\/\/api\.bigdatacloud\.net/);
    expect(value).not.toContain('report-uri');
    expect(value).not.toContain('report-to');
  });

  it('is wired exactly once for enforcement without a report-only header', () => {
    const config = readFileSync(fileURLToPath(new URL('../../next.config.ts', import.meta.url)), 'utf8');
    expect(config.match(/key: 'Content-Security-Policy'/g)).toHaveLength(1);
    expect(config).not.toContain('Content-Security-Policy-Report-Only');
  });
});
