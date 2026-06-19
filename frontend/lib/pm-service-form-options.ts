export const PM_SERVICE_INTEREST_OPTIONS = [
  { value: 'pathway_consultation', label: 'Pathway consultation' },
  { value: 'governance_pmo', label: 'Governance & PMO' },
  { value: 'corporate_training', label: 'Corporate training' },
] as const;

export type PmServiceInterestValue =
  | (typeof PM_SERVICE_INTEREST_OPTIONS)[number]['value']
  | 'other';

export const PM_SERVICE_INDUSTRY_OPTIONS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'it', label: 'Information Technology (IT)' },
  { value: 'oil_gas', label: 'Oil & Gas' },
] as const;

export type PmServiceIndustryValue =
  | (typeof PM_SERVICE_INDUSTRY_OPTIONS)[number]['value']
  | 'other';

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
  return PM_SERVICE_INDUSTRY_OPTIONS.find((o) => o.value === industry)?.label ?? '';
}
