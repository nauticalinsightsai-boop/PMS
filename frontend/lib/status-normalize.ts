import type { OfferingStatus } from '@/types/regional-catalogue';

const STATUS_ALIASES: [string, OfferingStatus][] = [
  ['available — direct checkout', 'direct_checkout'],
  ['available - direct checkout', 'direct_checkout'],
  ['regional scholarship available — verify eligibility', 'scholarship_verify'],
  ['regional scholarship available - verify eligibility', 'scholarship_verify'],
  ['available — consultation required', 'consultation_required'],
  ['available - consultation required', 'consultation_required'],
  ['regional scholarship unavailable', 'scholarship_unavailable'],
  ['global only', 'global_only'],
  ['waitlist', 'waitlist'],
  ['hidden', 'hidden'],
];

export function normalizeStatusKey(raw: string): string {
  return String(raw ?? '')
    .toLowerCase()
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeOfferingStatus(raw: string): OfferingStatus {
  const key = normalizeStatusKey(raw);
  for (const [alias, status] of STATUS_ALIASES) {
    if (key === alias || key.includes(alias.replace(/-/g, ' '))) return status;
  }
  if (key.includes('direct checkout')) return 'direct_checkout';
  if (key.includes('scholarship available')) return 'scholarship_verify';
  if (key.includes('consultation required')) return 'consultation_required';
  if (key.includes('scholarship unavailable')) return 'scholarship_unavailable';
  if (key.includes('global only')) return 'global_only';
  if (key.includes('waitlist')) return 'waitlist';
  if (key === 'hidden') return 'hidden';
  throw new Error(`Unknown offering status: ${raw}`);
}

export function canCheckout(status: OfferingStatus): boolean {
  return status === 'direct_checkout' || status === 'scholarship_verify';
}

export function isOfferingVisible(status: OfferingStatus): boolean {
  return status !== 'hidden';
}
