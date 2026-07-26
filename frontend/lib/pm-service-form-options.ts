export const PM_SERVICE_INTEREST_OPTIONS = [
  { value: 'pathway_consultation', label: 'Pathway consultation' },
  { value: 'governance_pmo', label: 'Governance & PMO' },
  { value: 'corporate_training', label: 'Corporate training' },
] as const;

export type PmServiceInterestValue =
  | (typeof PM_SERVICE_INTEREST_OPTIONS)[number]['value']
  | 'other';

export const PM_SERVICE_INDUSTRY_OPTIONS = [
  { value: 'civil_engineering', label: 'Construction' },
  { value: 'oil_gas_energy', label: 'Energy' },
  { value: 'it_digital', label: 'Technology' },
] as const;

export type PmServiceIndustryValue =
  | (typeof PM_SERVICE_INDUSTRY_OPTIONS)[number]['value']
  | 'other'
  | 'engineering'
  | 'it'
  | 'oil_gas';

export function resolvePmServiceInterestLabel(
  interest: PmServiceInterestValue | '',
  otherText: string,
): string {
  if (!interest) return '';
  if (interest === 'other') return otherText.trim();
  return PM_SERVICE_INTEREST_OPTIONS.find((o) => o.value === interest)?.label ?? '';
}

export function resolvePmServiceIndustryLabel(
  industry: PmServiceIndustryValue | '',
  otherText: string,
): string {
  if (!industry) return '';
  if (industry === 'other') return otherText.trim();
  const legacyLabels: Record<string, string> = {
    engineering: 'Engineering',
    it: 'Information Technology (IT)',
    oil_gas: 'Oil & Gas',
  };
  return PM_SERVICE_INDUSTRY_OPTIONS.find((o) => o.value === industry)?.label ?? legacyLabels[industry] ?? '';
}
