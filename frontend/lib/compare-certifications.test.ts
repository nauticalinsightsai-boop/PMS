import { describe, expect, it } from 'vitest';
import {
  DEFAULT_COMPARE_CERT_IDS,
  MAX_COMPARE_CERTS,
  getCompareableCertifications,
  parseCompareCertIds,
  toggleCompareSelection,
} from './compare-certifications';

describe('compare-certifications', () => {
  it('lists certifications with matrix pathways', () => {
    const ids = getCompareableCertifications().map((c) => c.id);
    expect(ids).toContain('pmp');
    expect(ids).toContain('capm');
    expect(ids).not.toContain('gpm-b');
  });

  it('parses URL cert ids with fallback defaults', () => {
    const allowed = new Set(getCompareableCertifications().map((c) => c.id));
    expect(parseCompareCertIds('pmp,prince2', allowed)).toEqual(['pmp', 'prince2']);
    expect(parseCompareCertIds(null, allowed).length).toBeGreaterThan(0);
    expect(parseCompareCertIds('invalid', allowed)).toEqual(
      DEFAULT_COMPARE_CERT_IDS.filter((id) => allowed.has(id)).slice(0, MAX_COMPARE_CERTS),
    );
  });

  it('limits selection to three', () => {
    const { next, atMax } = toggleCompareSelection(['a', 'b', 'c'], 'd');
    expect(next).toEqual(['a', 'b', 'c']);
    expect(atMax).toBe(true);
  });
});
