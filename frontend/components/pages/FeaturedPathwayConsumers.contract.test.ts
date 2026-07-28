import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const home = readFileSync(new URL('./Home.tsx', import.meta.url), 'utf8');
const certifications = readFileSync(new URL('./Certifications.tsx', import.meta.url), 'utf8');

describe('featured pathway section ownership', () => {
  for (const [name, source] of [['Home', home], ['Certifications', certifications]] as const) {
    it(`${name} owns exactly one expanded pathway id and controls each child`, () => {
      expect(source).toContain('useState<string | null>(null)');
      expect(source).toContain('expanded={expandedFeaturedPathwayId ===');
      expect(source).toContain('setFeaturedDisclosure(');
    });

    it(`${name} records same-URL disclosure state without router or analytics calls`, () => {
      expect(source).toContain('__pmsPathwayDisclosure');
      expect(source).toContain("v: 1");
      expect(source).toContain("window.history.pushState");
      expect(source).toContain("window.history.replaceState");
      expect(source).toContain("window.history.back()");
      expect(source).toContain("window.addEventListener('popstate'");
      expect(source).not.toContain('router.push');
      expect(source).not.toContain('page_view');
      expect(source).toContain('previousCertId');
      expect(source).toContain('[data-pathway-details="${previousCertId}"]');
      expect(source).toContain('[data-pathway-region="${certId}"]');
      expect(source).not.toContain("'[data-pathway-details]'");
      expect(source).toContain('window.history.replaceState');
      expect(source).toContain('window.history.back()');
      expect(source).toContain('data-pathway-region');
    });
  }

  it('limits the desktop flagship-open presentation to Certifications', () => {
    expect(certifications).toContain('desktopFlagshipOpen');
    expect(home).not.toContain('desktopFlagshipOpen');
    expect(certifications).toContain('layout="catalog"');
  });
});
