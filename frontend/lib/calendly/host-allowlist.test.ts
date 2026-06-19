import { describe, expect, it } from 'vitest';
import { assertCalendlySchedulingUrl, isCalendlySchedulingHost } from '@/lib/calendly/host-allowlist';

describe('host-allowlist', () => {
  it('accepts calendly.com and subdomains', () => {
    expect(isCalendlySchedulingHost('calendly.com')).toBe(true);
    expect(isCalendlySchedulingHost('assets.calendly.com')).toBe(true);
    expect(isCalendlySchedulingHost('evil.com')).toBe(false);
  });

  it('normalizes http Calendly URLs to https', () => {
    expect(assertCalendlySchedulingUrl('http://calendly.com/pm-structure/talk-to-mentor')).toBe(
      'https://calendly.com/pm-structure/talk-to-mentor',
    );
  });

  it('preserves https Calendly URLs', () => {
    const url = 'https://calendly.com/pm-structure/go-pmi-professional';
    expect(assertCalendlySchedulingUrl(url)).toBe(url);
  });

  it('rejects non-calendly hosts', () => {
    expect(assertCalendlySchedulingUrl('https://example.com/widget')).toBeNull();
    expect(assertCalendlySchedulingUrl('http://example.com/widget')).toBeNull();
  });

  it('rejects unsupported protocols', () => {
    expect(assertCalendlySchedulingUrl('ftp://calendly.com/x')).toBeNull();
  });
});
