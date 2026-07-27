import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('MetaPixel consent bootstrap', () => {
  it('keeps consent gating and one explicit PageView path', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/analytics/MetaPixel.tsx'), 'utf8');
    expect(source).toContain("setAllowed(hasMarketingConsent())");
    expect(source).toContain("if (!allowed || !pixelId || !isMetaPixelConfigured()) return null");
    expect(source.match(/trackMetaPageView\(\)/g)).toHaveLength(1);
    expect(source).toContain('flushPendingMetaBrowserEvents()');
  });

  it('loads the provider before disabling automatic events and initializing once', () => {
    const source = readFileSync(resolve(process.cwd(), 'components/analytics/MetaPixel.tsx'), 'utf8');
    const loader = source.indexOf('https://connect.facebook.net/en_US/fbevents.js');
    const autoConfig = source.indexOf("fbq('set', 'autoConfig', false");
    const init = source.indexOf("fbq('init'");

    expect(loader).toBeGreaterThanOrEqual(0);
    expect(autoConfig).toBeGreaterThan(loader);
    expect(init).toBeGreaterThan(autoConfig);
    expect(source.match(/fbq\('set', 'autoConfig', false/g)).toHaveLength(1);
    expect(source.match(/fbq\('init'/g)).toHaveLength(1);
  });
});
