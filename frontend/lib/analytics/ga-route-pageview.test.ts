import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { buildGaRoutePageview, shouldDispatchGaRoute } from './ga-route-pageview';

describe('GA route pageview contract', () => {
  it.each(['/', '/newsletter', '/certifications/pmp/professional/enroll'])(
    'builds one deterministic payload for %s',
    (pathname) => {
      const result = buildGaRoutePageview({ origin: 'https://pmstructure.com', pathname, title: 'PM Structure' });
      expect(result?.routeKey).toBe(pathname);
      expect(result?.params.page_location).toBe(`https://pmstructure.com${pathname}`);
    },
  );

  it('retains only five bounded UTMs in deterministic order', () => {
    const long = 'x'.repeat(250);
    const result = buildGaRoutePageview({
      origin: 'https://pmstructure.com',
      pathname: '/newsletter',
      search: `gclid=secret&utm_term=${long}&email=a%40b.test&utm_source=owned&utm_campaign=launch#fragment`,
      title: 'Newsletter',
    });
    expect(result?.params.page_location).toBe(
      `https://pmstructure.com/newsletter?utm_source=owned&utm_campaign=launch&utm_term=${'x'.repeat(200)}`,
    );
    expect(JSON.stringify(result)).not.toMatch(/gclid|email|secret|fragment|a%40b/i);
  });

  it('dedupes unchanged routes but permits a later return after transition', () => {
    expect(shouldDispatchGaRoute(null, '/')).toBe(true);
    expect(shouldDispatchGaRoute('/', '/')).toBe(false);
    expect(shouldDispatchGaRoute('/', '/newsletter')).toBe(true);
    expect(shouldDispatchGaRoute('/newsletter', '/')).toBe(true);
  });

  it('fails closed for malformed or unsafe origins', () => {
    expect(buildGaRoutePageview({ origin: 'not-a-url', pathname: '/', title: '' })).toBeNull();
    expect(buildGaRoutePageview({ origin: 'http://preview.example', pathname: '/', title: '' })).toBeNull();
  });

  it('component owns consent, config ordering, and listener cleanup', () => {
    const source = fs.readFileSync(
      new URL('../../components/analytics/GoogleAnalytics.tsx', import.meta.url),
      'utf8',
    );
    expect(source).toContain("if (!allowed || !gaId || !isGaConfigured() || typeof window === 'undefined') return");
    expect(source.indexOf("gtag('config', gaId, { send_page_view: false })")).toBeLessThan(
      source.indexOf("gtag('event', 'page_view', payload.params)"),
    );
    expect(source).toContain("window.addEventListener('legal-consent-updated', sync)");
    expect(source).toContain("window.removeEventListener('legal-consent-updated', sync)");
    expect(source).not.toMatch(/Meta|fbq|trackMeta/);
  });
});
