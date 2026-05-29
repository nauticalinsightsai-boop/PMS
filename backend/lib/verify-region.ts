import type { RegionId } from './regional-catalogue';

export interface VerifyRegionInput {
  regionId: RegionId;
  residenceCountry: string;
  billingCountry: string;
  gccCountry?: string | null;
  clientIp?: string | null;
}

export interface VerifyRegionResult {
  verified: boolean;
  mismatch: boolean;
  message: string;
  scholarshipEligible: boolean;
}

function norm(c: string) {
  return c.trim().toUpperCase();
}

export function verifyRegion(input: VerifyRegionInput): VerifyRegionResult {
  const residence = norm(input.residenceCountry);
  const billing = norm(input.billingCountry);
  const mismatch = residence !== billing;

  if (input.regionId === 'global' || input.regionId === 'europe' || input.regionId === 'uk') {
    return {
      verified: true,
      mismatch,
      message: mismatch
        ? 'Residence and billing country differ; Global pricing may apply until reviewed.'
        : 'Region confirmed.',
      scholarshipEligible: false,
    };
  }

  if (input.regionId === 'india') {
    const ok = ['IN', 'IND', 'INDIA'].includes(residence) && ['IN', 'IND', 'INDIA'].includes(billing);
    return {
      verified: ok,
      mismatch: !ok || mismatch,
      message: ok
        ? 'India Regional Scholarship eligibility confirmed.'
        : 'India scholarship requires residence and billing in India.',
      scholarshipEligible: ok,
    };
  }

  if (input.regionId === 'pakistan') {
    const ok = ['PK', 'PAK', 'PAKISTAN'].includes(residence) && ['PK', 'PAK', 'PAKISTAN'].includes(billing);
    return {
      verified: ok,
      mismatch: !ok || mismatch,
      message: ok
        ? 'Pakistan Regional Scholarship eligibility confirmed.'
        : 'Pakistan scholarship requires residence and billing in Pakistan.',
      scholarshipEligible: ok,
    };
  }

  if (input.regionId === 'gcc') {
    const gccCodes = ['AE', 'SA', 'QA', 'BH', 'KW', 'OM'];
    const ok = Boolean(
      gccCodes.some((c) => residence.includes(c) || billing.includes(c)) ||
        (input.gccCountry != null && residence.includes(input.gccCountry)),
    );
    return {
      verified: ok,
      mismatch: !ok,
      message: ok ? 'GCC region confirmed.' : 'GCC pricing requires GCC residence and billing.',
      scholarshipEligible: false,
    };
  }

  return {
    verified: false,
    mismatch: true,
    message: 'Unknown region.',
    scholarshipEligible: false,
  };
}
