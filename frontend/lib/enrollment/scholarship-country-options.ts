import { countries } from 'country-flag-icons';
import {
  GCC_SCHOLARSHIP_COUNTRIES,
  type ScholarshipMarket,
} from '@/lib/scholarship';

const ISO_ALPHA_2_REGION_IDENTIFIER = /^[A-Z]{2}$/;
const GLOBAL_SCHOLARSHIP_EXCLUSIONS = new Set<string>([
  'IN',
  'PK',
  ...GCC_SCHOLARSHIP_COUNTRIES,
]);
const englishRegionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export type ScholarshipCountryOption = {
  code: string;
  name: string;
};

export function isIsoAlpha2RegionIdentifier(code: string): boolean {
  return ISO_ALPHA_2_REGION_IDENTIFIER.test(code.trim().toUpperCase());
}

export function scholarshipRegionName(
  code: string,
  displayNames: Pick<Intl.DisplayNames, 'of'> = englishRegionNames,
): string {
  const normalized = code.trim().toUpperCase();
  if (!isIsoAlpha2RegionIdentifier(normalized)) return normalized || code;

  try {
    return displayNames.of(normalized) ?? normalized;
  } catch {
    return normalized;
  }
}

export function scholarshipCountryOptions(
  market: ScholarshipMarket,
  sourceCountries: readonly string[] = countries as readonly string[],
): ScholarshipCountryOption[] {
  const marketCodes = market === 'gcc'
    ? [...GCC_SCHOLARSHIP_COUNTRIES]
    : sourceCountries;
  const uniqueCodes = new Set(
    marketCodes
      .map((code) => code.trim().toUpperCase())
      .filter(isIsoAlpha2RegionIdentifier)
      .filter((code) => market === 'gcc' || !GLOBAL_SCHOLARSHIP_EXCLUSIONS.has(code)),
  );

  return [...uniqueCodes]
    .map((code) => ({ code, name: scholarshipRegionName(code) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
