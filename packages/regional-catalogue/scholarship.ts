/** Fixed shareable mentor-led scholarship: 15% via Stripe coupon SCH15. No SCH10/SCH20 selection. */
export const SCHOLARSHIP_DISCOUNT_BPS = 1_500;
export const SCHOLARSHIP_STRIPE_COUPON_ID = 'SCH15';
export const SCHOLARSHIP_RESERVATION_SECONDS = 15 * 60;

export const GCC_SCHOLARSHIP_COUNTRIES = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM'] as const;
export type GccScholarshipCountry = (typeof GCC_SCHOLARSHIP_COUNTRIES)[number];
export type ScholarshipMarket = 'gcc' | 'global';
export type ScholarshipLevel = 'professional' | 'mastery';

export const MATRIX_COURSE_TO_SITE_ID: Record<string, string> = {
  'CAPM Preparation': 'capm',
  'PMP Preparation': 'pmp',
  'PgMP Preparation': 'pgmp',
  'PfMP Preparation': 'pfmp',
  'PMI-ACP Preparation': 'pmi-acp',
  'PMI-RMP Preparation': 'pmi-rmp',
  'PMI-SP Preparation': 'pmi-sp',
  'PMI-PBA Preparation': 'pmi-pba',
  'PMI-CP Preparation': 'pmi-cp',
  'PMI-PMOCP Preparation': 'pmi-pmocp',
  'PMI-CPMAI Preparation': 'pmi-cpmai',
  'PRINCE2 7 Foundation Preparation': 'prince2',
  'PRINCE2 7 Practitioner Preparation': 'prince2-practitioner',
  'PRINCE2 Agile Foundation Preparation': 'prince2-agile',
  'PRINCE2 Agile Practitioner Preparation': 'prince2-agile-practitioner',
  'MSP Foundation Preparation': 'msp',
  'MSP Practitioner Preparation': 'msp',
  'MoP Foundation Preparation': 'mop',
  'MoP Practitioner Preparation': 'mop',
  'M_o_R Foundation Preparation': 'mor',
  'M_o_R 4 Practitioner Preparation': 'mor',
  'P3O Foundation Preparation': 'p3o',
  'P3O Practitioner Preparation': 'p3o',
  'Six Sigma Champion': 'lss-champion',
  'Six Sigma White Belt': 'lss-white',
  'Six Sigma Yellow Belt': 'lss-yellow',
  'Six Sigma Green Belt': 'lss-green',
  'Six Sigma Black Belt': 'lss-black',
  'Six Sigma Master Black Belt': 'lss-master',
};

export const SITE_CERT_PATHWAY_TIERS: Partial<Record<string, readonly string[]>> = {
  capm: ['professional'],
  'pmi-rmp': ['foundation', 'professional'],
  'pmi-sp': ['professional', 'mastery'],
  'pmi-pba': ['professional', 'mastery'],
  'pmi-pmocp': ['professional', 'mastery'],
  prince2: ['professional'],
  'lss-white': ['foundation'],
  'lss-master': ['mastery_advisory'],
};

export function isScholarshipPathwayTierAllowed(siteCertId: string, tierId: string): boolean {
  const allow = SITE_CERT_PATHWAY_TIERS[siteCertId];
  return !allow || allow.includes(tierId);
}

export function siteIdForScholarshipCourse(courseName: string): string | undefined {
  return MATRIX_COURSE_TO_SITE_ID[courseName];
}

export function normalizeScholarshipMarket(value: string): ScholarshipMarket | null {
  const normalized = value.trim().toLowerCase();
  return normalized === 'gcc' || normalized === 'global' ? normalized : null;
}

export function normalizeScholarshipLevel(value: string): ScholarshipLevel | null {
  const normalized = value.trim().toLowerCase();
  return normalized === 'professional' || normalized === 'mastery' ? normalized : null;
}

export function scholarshipLevelForTierId(tierId: string): ScholarshipLevel | null {
  if (tierId === 'professional') return 'professional';
  return tierId === 'mastery' || tierId === 'mastery_corporate' || tierId === 'mastery_advisory'
    ? 'mastery'
    : null;
}

export function isGccScholarshipCountry(code: string): code is GccScholarshipCountry {
  return (GCC_SCHOLARSHIP_COUNTRIES as readonly string[]).includes(code.trim().toUpperCase());
}

export type ScholarshipCountryDecision =
  | { eligible: true; countryCode: string }
  | {
      eligible: false;
      reason: 'country_mismatch' | 'gcc_required' | 'global_required' | 'south_asia_excluded';
      countryCode: string | null;
    };

export function evaluateScholarshipCountry(
  market: ScholarshipMarket,
  residenceCountry: string,
  billingCountry: string,
  knownCountryCodes?: ReadonlySet<string>,
): ScholarshipCountryDecision {
  const residence = residenceCountry.trim().toUpperCase();
  const billing = billingCountry.trim().toUpperCase();
  if (
    !/^[A-Z]{2}$/.test(residence) ||
    !/^[A-Z]{2}$/.test(billing) ||
    (knownCountryCodes && (!knownCountryCodes.has(residence) || !knownCountryCodes.has(billing))) ||
    residence !== billing
  ) {
    return { eligible: false, reason: 'country_mismatch', countryCode: residence || null };
  }
  if (residence === 'PK' || residence === 'IN') {
    return { eligible: false, reason: 'south_asia_excluded', countryCode: residence };
  }
  if (market === 'gcc' && !isGccScholarshipCountry(residence)) {
    return { eligible: false, reason: 'gcc_required', countryCode: residence };
  }
  if (market === 'global' && isGccScholarshipCountry(residence)) {
    return { eligible: false, reason: 'global_required', countryCode: residence };
  }
  return { eligible: true, countryCode: residence };
}

/** Exact 15% discount. Rejects a price that cannot be represented in the currency's minor unit. */
export function exactScholarshipUnitAmount(baseUnitAmount: number): number {
  if (!Number.isSafeInteger(baseUnitAmount) || baseUnitAmount <= 0) {
    throw new Error('invalid_scholarship_base_amount');
  }
  const numerator = baseUnitAmount * (10_000 - SCHOLARSHIP_DISCOUNT_BPS);
  if (!Number.isSafeInteger(numerator) || numerator % 10_000 !== 0) {
    throw new Error('scholarship_amount_not_exact_in_minor_units');
  }
  return numerator / 10_000;
}

export const THREE_DECIMAL_CURRENCIES = new Set(['bhd', 'jod', 'kwd', 'omr', 'tnd']);
export const ZERO_DECIMAL_CURRENCIES = new Set([
  'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd',
  'vuv', 'xaf', 'xof', 'xpf',
]);

export function currencyMinorUnit(currency: string): 0 | 2 | 3 {
  const normalized = currency.trim().toLowerCase();
  if (ZERO_DECIMAL_CURRENCIES.has(normalized)) return 0;
  if (THREE_DECIMAL_CURRENCIES.has(normalized)) return 3;
  return 2;
}

export function toExactMinorUnits(majorAmount: number, currency: string): number {
  const factor = 10 ** currencyMinorUnit(currency);
  const value = majorAmount * factor;
  if (!Number.isFinite(value) || Math.abs(value - Math.round(value)) > 1e-8) {
    throw new Error('price_not_exact_in_currency_minor_units');
  }
  return Math.round(value);
}

export function formatScholarshipAmount(currency: string, unitAmount: number): string {
  const normalized = currency.trim().toUpperCase();
  const decimals = currencyMinorUnit(normalized);
  const amount = unitAmount / 10 ** decimals;
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals === 0 ? 0 : 2,
    maximumFractionDigits: decimals,
  });
  return normalized === 'USD' ? `$${formatted}` : `${normalized} ${formatted}`;
}
