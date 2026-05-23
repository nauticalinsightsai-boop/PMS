import type { OfferingStatus, TierId } from '@/types/regional-catalogue';
import { canCheckout } from '@/lib/status-normalize';
import { hrefForCtaAction, type CtaAction } from '@/lib/cta-router';

export type PathwayModalMode =
  | 'enroll'
  | 'verify'
  | 'consultation'
  | 'scholarship'
  | 'waitlist'
  | 'global';

export interface TierPathwayCta {
  label: string;
  modalMode: PathwayModalMode;
  proceedHref: string;
  proceedLabel: string;
}

const MASTERY_TIERS: TierId[] = ['mastery', 'mastery_corporate', 'mastery_advisory'];

export function isMasteryTierId(tierId: string): boolean {
  return MASTERY_TIERS.includes(tierId as TierId);
}

/** Human-readable pathway blurb (not raw matrix delivery string). */
export function tierPathwaySummary(tierId: string): string {
  if (tierId === 'foundation') {
    return 'Digital-only pathway: on-demand lessons, templates, and exam-style practice in the LMS.';
  }
  if (tierId === 'professional') {
    return 'Blended pathway: self-paced LMS plus live weekend sessions and cohort support.';
  }
  if (isMasteryTierId(tierId)) {
    return 'Mentor-led pathway with readiness review and structured accountability before you begin.';
  }
  return 'Structured preparation aligned to your certification goals.';
}

/** Full delivery line for pathway cards (matrix clauses joined like Professional tier). */
export function tierDeliveryLine(deliveryMode: string | null | undefined): string {
  if (!deliveryMode?.trim()) return '';
  const parts = deliveryMode
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length <= 1) return parts[0] ?? deliveryMode.trim();
  return parts.join(' + ');
}

/**
 * One primary action per tier — opens programme preview modal, then checkout or contact.
 * Professional / mastery never use direct “Enroll now” on the card (consultation-first).
 */
export function resolveTierPathwayCta(
  tierId: string,
  offeringId: string,
  siteCertId: string,
  status: OfferingStatus,
  matrixPrimary: string | null,
): TierPathwayCta {
  const checkoutHref = hrefForCtaAction('checkout', offeringId, siteCertId);
  const verifyHref = hrefForCtaAction('verify_first', offeringId, siteCertId);
  const consultationHref = hrefForCtaAction('consultation', offeringId, siteCertId);
  const scholarshipHref = hrefForCtaAction('scholarship_review', offeringId, siteCertId);
  const waitlistHref = hrefForCtaAction('waitlist', offeringId, siteCertId);
  const globalHref = hrefForCtaAction('global_checkout', offeringId, siteCertId);

  if (tierId === 'foundation') {
    if (status === 'scholarship_verify') {
      return {
        label: 'View programme & verify eligibility',
        modalMode: 'verify',
        proceedHref: verifyHref,
        proceedLabel: 'Continue to eligibility check',
      };
    }
    if (status === 'consultation_required') {
      return {
        label: 'View programme details',
        modalMode: 'consultation',
        proceedHref: consultationHref,
        proceedLabel: 'Book a consultation',
      };
    }
    if (status === 'scholarship_unavailable') {
      return {
        label: 'View programme details',
        modalMode: 'global',
        proceedHref: globalHref,
        proceedLabel: 'Proceed with global pricing',
      };
    }
    if (status === 'waitlist') {
      return {
        label: 'View programme details',
        modalMode: 'waitlist',
        proceedHref: waitlistHref,
        proceedLabel: 'Join waitlist',
      };
    }
    return {
      label: 'View programme & enroll',
      modalMode: 'enroll',
      proceedHref: checkoutHref,
      proceedLabel: 'Proceed to checkout',
    };
  }

  if (tierId === 'professional') {
    if (status === 'scholarship_verify') {
      return {
        label: 'View programme & request scholarship review',
        modalMode: 'scholarship',
        proceedHref: scholarshipHref,
        proceedLabel: 'Request scholarship review',
      };
    }
    if (status === 'waitlist') {
      return {
        label: 'View programme details',
        modalMode: 'waitlist',
        proceedHref: waitlistHref,
        proceedLabel: 'Join waitlist',
      };
    }
    if (status === 'scholarship_unavailable') {
      const lower = (matrixPrimary ?? '').toLowerCase();
      if (lower.includes('global')) {
        return {
          label: 'View programme details',
          modalMode: 'global',
          proceedHref: globalHref,
          proceedLabel: 'Proceed with global pricing',
        };
      }
    }
    return {
      label: 'Book consultation',
      modalMode: 'consultation',
      proceedHref: consultationHref,
      proceedLabel: 'Book a consultation call',
    };
  }

  if (isMasteryTierId(tierId)) {
    if (status === 'scholarship_verify') {
      return {
        label: 'View programme & request scholarship review',
        modalMode: 'scholarship',
        proceedHref: scholarshipHref,
        proceedLabel: 'Request scholarship review',
      };
    }
    if (status === 'waitlist') {
      return {
        label: 'View mastery programme',
        modalMode: 'waitlist',
        proceedHref: waitlistHref,
        proceedLabel: 'Join waitlist',
      };
    }
    const label =
      (matrixPrimary ?? '').toLowerCase().includes('mastery consultation')
        ? 'Book mastery consultation'
        : 'Book consultation';
    return {
      label,
      modalMode: 'consultation',
      proceedHref: consultationHref,
      proceedLabel: 'Book a consultation call',
    };
  }

  const fallbackAction: CtaAction = canCheckout(status) ? 'checkout' : 'consultation';
  return {
    label: matrixPrimary ?? 'View programme',
    modalMode: fallbackAction === 'checkout' ? 'enroll' : 'consultation',
    proceedHref: hrefForCtaAction(fallbackAction, offeringId, siteCertId),
    proceedLabel: fallbackAction === 'checkout' ? 'Proceed to checkout' : 'Book a consultation',
  };
}
