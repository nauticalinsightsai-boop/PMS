import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./PortalFeaturedPathways.tsx', import.meta.url), 'utf8');

describe('PortalFeaturedPathways accordion contract', () => {
  it('defaults to a single shared collapsed expand id (null)', () => {
    expect(source).toContain('useState<string | null>(null)');
    expect(source).toContain('expanded={expandedCertId === certId}');
    expect(source).toContain(
      'onExpandedChange={(next) => setDisclosure(certId, next)}',
    );
  });

  it('enforces one-open-at-a-time at every viewport (no sm-up independent expand)', () => {
    expect(source).not.toContain('useIsSmUp');
    expect(source).not.toContain('matchMedia');
    expect(source).not.toContain('isSmUp');
    expect(source).not.toContain('expanded={isSmUp ? undefined');
  });

  it('keeps the approved two-card grid and cert defaults', () => {
    expect(source).toContain("['pmp', 'pmi-rmp']");
    expect(source).toContain('ids.slice(0, 2)');
    expect(source).toContain('grid grid-cols-1 sm:grid-cols-2');
  });

  it('uses items-start so a collapsed peer stays compact while one card is open', () => {
    expect(source).toContain('items-start');
    expect(source).not.toContain('items-stretch');
    expect(source).not.toContain('className="flex h-full flex-col"');
    expect(source).toContain('className="flex flex-col"');
  });

  it('adds no analytics or page_view for disclosure', () => {
    expect(source).not.toContain('page_view');
    expect(source).not.toContain('trackFunnelEvent');
    expect(source).not.toContain('pushAnalyticsEvent');
    expect(source).not.toContain('sendGAEvent');
    expect(source).not.toContain('PMS_EVENTS');
    expect(source).not.toContain("from '@/lib/analytics");
  });

  it('uses a minimal same-URL portal disclosure marker with push, replace, and popstate recovery', () => {
    expect(source).toContain("surface: 'portal-featured'");
    expect(source).toContain('__pmsPathwayDisclosure');
    expect(source).toContain('window.history.pushState');
    expect(source).toContain('window.history.replaceState');
    expect(source).toContain('window.history.back()');
    expect(source).toContain("window.addEventListener('popstate'");
    expect(source).toContain('previousCertId');
    expect(source).toContain('[data-pathway-details="${previousCertId}"]');
    expect(source).not.toContain("'[data-pathway-details]'");
    expect(source).toContain('window.history.replaceState');
    expect(source).toContain('window.history.back()');
  });
});
