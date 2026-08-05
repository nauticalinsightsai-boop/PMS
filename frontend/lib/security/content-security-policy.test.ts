import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { contentSecurityPolicyReportOnly } from './content-security-policy';

describe('report-only CSP', () => {
  it('is deterministic, source-bound, duplicate-free, and report-only', () => {
    const value = contentSecurityPolicyReportOnly();
    const names = value.split(';').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean);
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

  it('is wired exactly once as report-only without an enforcement header', () => {
    const config = readFileSync(fileURLToPath(new URL('../../next.config.ts', import.meta.url)), 'utf8');
    expect(config.match(/key: 'Content-Security-Policy-Report-Only'/g)).toHaveLength(1);
    expect(config).not.toMatch(/key: 'Content-Security-Policy'/);
  });
});
