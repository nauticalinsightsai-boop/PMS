import type { OfferingStatus } from '@/types/regional-catalogue';
import { enrollmentPathForOffering } from '@/lib/enrollment-routes';

export type CtaAction =
  | 'checkout'
  | 'verify_first'
  | 'consultation'
  | 'scholarship_review'
  | 'global_checkout'
  | 'waitlist'
  | 'hidden'
  | 'contact';

export interface CtaRoute {
  primary: CtaAction;
  secondary: CtaAction;
  primaryLabel: string;
  secondaryLabel: string;
}

function actionFromStatus(status: OfferingStatus, label: string): CtaAction {
  const lower = label.toLowerCase();
  if (status === 'hidden') return 'hidden';
  if (status === 'waitlist') return 'waitlist';
  if (status === 'consultation_required' || lower.includes('mastery consultation')) {
    return 'consultation';
  }
  if (status === 'scholarship_unavailable') {
    if (lower.includes('scholarship')) return 'scholarship_review';
    if (lower.includes('global')) return 'global_checkout';
    if (lower.includes('waitlist')) return 'waitlist';
    return 'scholarship_review';
  }
  if (status === 'scholarship_verify') {
    if (lower.includes('enroll')) return 'verify_first';
    if (lower.includes('consultation')) return 'consultation';
    return 'verify_first';
  }
  if (status === 'global_only') return 'global_checkout';
  if (lower.includes('enroll')) return 'checkout';
  if (lower.includes('consultation')) return 'consultation';
  return 'contact';
}

export function routeOfferingCtas(
  status: OfferingStatus,
  primaryCta: string | null,
  secondaryCta: string | null
): CtaRoute {
  const primaryLabel = primaryCta ?? 'Enroll Now';
  const secondaryLabel = secondaryCta ?? 'Book Pathway Consultation';
  return {
    primary: actionFromStatus(status, primaryLabel),
    secondary: actionFromStatus(status, secondaryLabel),
    primaryLabel,
    secondaryLabel,
  };
}

export function hrefForCtaAction(
  action: CtaAction,
  offeringId: string,
  siteCertId?: string
): string {
  const base = siteCertId ? `/certifications/${siteCertId}` : '/certifications';
  switch (action) {
    case 'checkout':
    case 'verify_first':
    case 'global_checkout': {
      const enrollPath = enrollmentPathForOffering(offeringId);
      if (enrollPath) return enrollPath;
      return `/checkout?offering=${encodeURIComponent(offeringId)}`;
    }
    case 'consultation':
      return `/contact?topic=consultation&offering=${encodeURIComponent(offeringId)}`;
    case 'scholarship_review':
      return `/contact?topic=scholarship&offering=${encodeURIComponent(offeringId)}`;
    case 'waitlist':
      return `/contact?topic=waitlist&offering=${encodeURIComponent(offeringId)}`;
    case 'hidden':
      return '#';
    default:
      return `${base}#pathway`;
  }
}
