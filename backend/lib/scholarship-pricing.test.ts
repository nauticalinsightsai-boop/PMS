import { describe, expect, it } from 'vitest';
import { getCatalogue } from './regional-catalogue';
import {
  exactScholarshipUnitAmount,
  GCC_SCHOLARSHIP_COUNTRIES,
  isScholarshipPathwayTierAllowed,
  scholarshipLevelForTierId,
  siteIdForScholarshipCourse,
} from './scholarship-core';
import {
  resolveScholarshipPrice,
  resolveScholarshipRouteIdentity,
  scholarshipCountryDecision,
} from './scholarship-pricing';

function canonicalRows() {
  return getCatalogue().offerings.filter((offering, index, all) => {
    const siteCertId = siteIdForScholarshipCourse(offering.courseName);
    const level = scholarshipLevelForTierId(offering.tierId);
    if (!siteCertId || !level || !isScholarshipPathwayTierAllowed(siteCertId, offering.tierId)) {
      return false;
    }
    return index === all.findIndex((candidate) =>
      siteIdForScholarshipCourse(candidate.courseName) === siteCertId &&
      scholarshipLevelForTierId(candidate.tierId) === level &&
      isScholarshipPathwayTierAllowed(siteCertId, candidate.tierId),
    );
  });
}

describe('scholarship route and price matrix', () => {
  it('contains exactly the 42 supported Professional/Mastery mentor-led rows', () => {
    const rows = canonicalRows();
    expect(rows).toHaveLength(42);
    for (const offering of rows) {
      const siteCertId = siteIdForScholarshipCourse(offering.courseName)!;
      const level = scholarshipLevelForTierId(offering.tierId)!;
      expect(['professional', 'mastery']).toContain(level);
      expect(resolveScholarshipRouteIdentity({
        offeringId: offering.offeringId,
        siteCertId,
        tierSlug: level,
        market: 'global',
      })?.offering.offeringId).toBe(offering.offeringId);
    }
  });

  it('calculates the exact 15% price for every global and GCC matrix price', () => {
    for (const offering of canonicalRows()) {
      const globalPrice = resolveScholarshipPrice(offering, 'global', 'US');
      expect(globalPrice, offering.offeringId).not.toBeNull();
      expect(globalPrice!.finalUnitAmount).toBe(exactScholarshipUnitAmount(globalPrice!.baseUnitAmount));
      expect(globalPrice!.finalUsdCents).toBe(exactScholarshipUnitAmount(globalPrice!.baseUsdCents));

      for (const country of GCC_SCHOLARSHIP_COUNTRIES) {
        const gccPrice = resolveScholarshipPrice(offering, 'gcc', country);
        expect(gccPrice, `${offering.offeringId}:${country}`).not.toBeNull();
        expect(gccPrice!.finalUnitAmount).toBe(exactScholarshipUnitAmount(gccPrice!.baseUnitAmount));
        expect(gccPrice!.finalUsdCents).toBe(exactScholarshipUnitAmount(gccPrice!.baseUsdCents));
      }
    }
  });

  it('keeps the PMP Professional example exact and unrounded', () => {
    const offering = getCatalogue().offerings.find((row) => row.offeringId === 'pmp-preparation-professional')!;
    expect(resolveScholarshipPrice(offering, 'global', 'US')).toMatchObject({
      currency: 'usd',
      baseUnitAmount: 89_900,
      finalUnitAmount: 76_415,
      baseDisplay: '$899.00',
      finalDisplay: '$764.15',
    });
  });

  it('rejects wrong levels, noncanonical duplicates, and unknown routes', () => {
    expect(resolveScholarshipRouteIdentity({
      offeringId: 'pmp-preparation-professional',
      siteCertId: 'pmp',
      tierSlug: 'mastery',
      market: 'global',
    })).toBeNull();
    expect(resolveScholarshipRouteIdentity({
      offeringId: 'does-not-exist',
      siteCertId: 'pmp',
      tierSlug: 'professional',
      market: 'global',
    })).toBeNull();
  });
});

describe('scholarship country eligibility', () => {
  it.each(GCC_SCHOLARSHIP_COUNTRIES)('accepts %s only on the GCC market', (country) => {
    expect(scholarshipCountryDecision('gcc', country, country)).toEqual({
      eligible: true,
      countryCode: country,
    });
    expect(scholarshipCountryDecision('global', country, country)).toMatchObject({
      eligible: false,
      reason: 'global_required',
    });
  });

  it('accepts a valid non-GCC global country and rejects GCC use', () => {
    expect(scholarshipCountryDecision('global', 'US', 'US')).toEqual({ eligible: true, countryCode: 'US' });
    expect(scholarshipCountryDecision('gcc', 'US', 'US')).toMatchObject({ eligible: false, reason: 'gcc_required' });
  });

  it.each(['PK', 'IN'])('excludes %s from both markets', (country) => {
    expect(scholarshipCountryDecision('global', country, country)).toMatchObject({
      eligible: false,
      reason: 'south_asia_excluded',
    });
    expect(scholarshipCountryDecision('gcc', country, country)).toMatchObject({
      eligible: false,
      reason: 'south_asia_excluded',
    });
  });

  it('fails closed for mismatched and unknown countries', () => {
    expect(scholarshipCountryDecision('global', 'US', 'CA')).toMatchObject({
      eligible: false,
      reason: 'country_mismatch',
    });
    expect(scholarshipCountryDecision('global', 'ZZ', 'ZZ')).toMatchObject({
      eligible: false,
      reason: 'country_mismatch',
    });
  });
});
