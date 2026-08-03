import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const home = readFileSync(new URL('./Home.tsx', import.meta.url), 'utf8');
const certifications = readFileSync(new URL('./Certifications.tsx', import.meta.url), 'utf8');

describe('featured pathway section ownership', () => {
  it('Home keeps featured visual cards always open without disclosure state', () => {
    expect(home).toContain('layout="visual"');
    expect(home).not.toContain('expandedFeaturedPathwayId');
    expect(home).not.toContain('setFeaturedDisclosure');
    expect(home).not.toContain('__pmsPathwayDisclosure');
    expect(home).not.toContain('expanded={expandedFeaturedPathwayId ===');
  });

  it('Certifications keeps flagship catalog cards always open without disclosure state', () => {
    expect(certifications).toContain('desktopFlagshipOpen');
    expect(certifications).toContain('layout="catalog"');
    expect(certifications).not.toContain('expandedFeaturedPathwayId');
    expect(certifications).not.toContain('setFeaturedDisclosure');
    expect(certifications).not.toContain('__pmsPathwayDisclosure');
    expect(certifications).not.toContain('expanded={expandedFeaturedPathwayId ===');
  });

  it('limits the desktop flagship-open presentation to Certifications', () => {
    expect(certifications).toContain('desktopFlagshipOpen');
    expect(home).not.toContain('desktopFlagshipOpen');
  });
});
