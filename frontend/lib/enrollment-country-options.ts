import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';

export type EnrollmentCountryOption = { code: string; name: string };

/** ISO 3166-1 alpha-2 codes for enrollment residence / billing selects. */
export const ENROLLMENT_COUNTRIES: readonly EnrollmentCountryOption[] = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'AU', name: 'Australia' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'QA', name: 'Qatar' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'US', name: 'United States' },
  { code: 'ZA', name: 'South Africa' },
] as const;

export function defaultCountriesForRegion(
  regionId: RegionId,
  gccCountry?: GccCountryCode | null,
): { residence: string; billing: string } {
  switch (regionId) {
    case 'india':
      return { residence: 'IN', billing: 'IN' };
    case 'pakistan':
      return { residence: 'PK', billing: 'PK' };
    case 'gcc': {
      const code = gccCountry ?? 'AE';
      return { residence: code, billing: code };
    }
    case 'uk':
      return { residence: 'GB', billing: 'GB' };
    case 'europe':
      return { residence: 'DE', billing: 'DE' };
    default:
      return { residence: '', billing: '' };
  }
}

export function enrollmentCountryLabel(code: string): string {
  const upper = code.trim().toUpperCase();
  return ENROLLMENT_COUNTRIES.find((c) => c.code === upper)?.name ?? upper;
}
