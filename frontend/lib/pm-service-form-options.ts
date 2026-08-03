import { WORK_FIELD_OPTIONS } from '@/lib/pmp-qualification-options';

export const PM_SERVICE_INTEREST_OPTIONS = [
  { value: 'pathway_consultation', label: 'Pathway consultation' },
  { value: 'governance_pmo', label: 'Governance & PMO' },
  { value: 'corporate_training', label: 'Corporate training' },
] as const;

export type PmServiceInterestValue =
  | (typeof PM_SERVICE_INTEREST_OPTIONS)[number]['value']
  | 'other';

/**
 * Shared visible industry taxonomy with roadmap Step 1 (Construction / Energy /
 * Technology). Other is selected via the advisory form's dedicated Other control;
 * legacy engineering/it/oil_gas values remain readable only.
 */
export const PM_SERVICE_INDUSTRY_OPTIONS = WORK_FIELD_OPTIONS.filter(
  (option) => option.value !== 'other',
) as ReadonlyArray<{
  value: Exclude<(typeof WORK_FIELD_OPTIONS)[number]['value'], 'other'>;
  label: string;
}>;

export type PmServiceIndustryValue =
  | (typeof WORK_FIELD_OPTIONS)[number]['value']
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
