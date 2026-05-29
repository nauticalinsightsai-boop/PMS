import type { OfferingStatus, TierId } from '@/types/regional-catalogue';
import { canCheckout } from '@/lib/status-normalize';
import { hrefForCtaAction, type CtaAction } from '@/lib/cta-router';
import { enrollPath, enrollTierSlugFromTierId, enrollmentPathForOffering } from '@/lib/enrollment-routes';

export type PathwayModalMode =
  | 'enroll'
  | 'verify'
  | 'consultation'
  | 'scholarship'
  | 'waitlist'
  | 'global';

export interface TierPathwayCta {
  /** Primary label on the pathway tier card. */
  label: string;
  modalMode: PathwayModalMode;
  /** Legacy single-action href (contact / waitlist / enroll). */
  proceedHref: string;
  proceedLabel: string;
  /** Program enrollment page when checkout is available. */
  enrollHref: string | null;
  enrollLabel: string;
  /** Show “Book consultation now” alongside enroll in the preview modal. */
  showConsultationInModal: boolean;
}

const MASTERY_TIERS: TierId[] = ['mastery', 'mastery_corporate', 'mastery_advisory'];

export function isMasteryTierId(tierId: string): boolean {
  return MASTERY_TIERS.includes(tierId as TierId);
}

function enrollHrefForTier(siteCertId: string, tierId: string, offeringId: string): string {
  return enrollmentPathForOffering(offeringId) ?? enrollPath(siteCertId, enrollTierSlugFromTierId(tierId));
}

function foundationCta(
  siteCertId: string,
  tierId: string,
  offeringId: string,
  status: OfferingStatus,
): TierPathwayCta {
  const enrollHref = enrollHrefForTier(siteCertId, tierId, offeringId);
  const consultationHref = hrefForCtaAction('consultation', offeringId, siteCertId);
  const waitlistHref = hrefForCtaAction('waitlist', offeringId, siteCertId);
  const globalHref = hrefForCtaAction('global_checkout', offeringId, siteCertId);

  if (status === 'consultation_required') {
    return {
      label: 'Enroll now',
      modalMode: 'consultation',
      proceedHref: consultationHref,
      proceedLabel: 'Book a consultation',
      enrollHref: null,
      enrollLabel: 'Enroll now',
      showConsultationInModal: true,
    };
  }
  if (status === 'scholarship_unavailable') {
    return {
      label: 'Enroll now',
      modalMode: 'global',
      proceedHref: globalHref,
      proceedLabel: 'Proceed with global pricing',
      enrollHref: enrollHref,
      enrollLabel: 'Enroll now',
      showConsultationInModal: false,
    };
  }
  if (status === 'waitlist') {
    return {
      label: 'Join waitlist',
      modalMode: 'waitlist',
      proceedHref: waitlistHref,
      proceedLabel: 'Join waitlist',
      enrollHref: null,
      enrollLabel: 'Enroll now',
      showConsultationInModal: false,
    };
  }

  return {
    label: 'Enroll now',
    modalMode: status === 'scholarship_verify' ? 'verify' : 'enroll',
    proceedHref: enrollHref,
    proceedLabel: 'Enroll now',
    enrollHref,
    enrollLabel: 'Enroll now',
    showConsultationInModal: false,
  };
}

function professionalOrMasteryCta(
  tierId: string,
  offeringId: string,
  siteCertId: string,
  status: OfferingStatus,
  matrixPrimary: string | null,
): TierPathwayCta {
  const enrollHref = canCheckout(status) || status === 'global_only'
    ? enrollHrefForTier(siteCertId, tierId, offeringId)
    : status === 'scholarship_unavailable'
      ? enrollHrefForTier(siteCertId, tierId, offeringId)
      : null;
  const consultationHref = hrefForCtaAction('consultation', offeringId, siteCertId);
  const scholarshipHref = hrefForCtaAction('scholarship_review', offeringId, siteCertId);
  const waitlistHref = hrefForCtaAction('waitlist', offeringId, siteCertId);
  const globalHref = hrefForCtaAction('global_checkout', offeringId, siteCertId);

  if (status === 'scholarship_verify') {
    return {
      label: 'View pathway',
      modalMode: 'scholarship',
      proceedHref: scholarshipHref,
      proceedLabel: 'Request scholarship review',
      enrollHref,
      enrollLabel: 'Enroll now',
      showConsultationInModal: true,
    };
  }
  if (status === 'waitlist') {
    return {
      label: 'Join waitlist',
      modalMode: 'waitlist',
      proceedHref: waitlistHref,
      proceedLabel: 'Join waitlist',
      enrollHref: null,
      enrollLabel: 'Enroll now',
      showConsultationInModal: false,
    };
  }
  if (status === 'scholarship_unavailable') {
    const lower = (matrixPrimary ?? '').toLowerCase();
    if (lower.includes('global')) {
      return {
        label: 'View pathway',
        modalMode: 'global',
        proceedHref: globalHref,
        proceedLabel: 'Proceed with global pricing',
        enrollHref,
        enrollLabel: 'Enroll now',
        showConsultationInModal: true,
      };
    }
  }

  return {
    label: 'View pathway',
    modalMode: 'consultation',
    proceedHref: consultationHref,
    proceedLabel: 'Book consultation now',
    enrollHref,
    enrollLabel: 'Enroll now',
    showConsultationInModal: true,
  };
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
 * Primary pathway CTA per tier — opens programme preview modal, then enrollment and/or Calendly.
 */
export function resolveTierPathwayCta(
  tierId: string,
  offeringId: string,
  siteCertId: string,
  status: OfferingStatus,
  matrixPrimary: string | null,
): TierPathwayCta {
  if (tierId === 'foundation') {
    return foundationCta(siteCertId, tierId, offeringId, status);
  }

  if (tierId === 'professional' || isMasteryTierId(tierId)) {
    return professionalOrMasteryCta(tierId, offeringId, siteCertId, status, matrixPrimary);
  }

  const fallbackAction: CtaAction = canCheckout(status) ? 'checkout' : 'consultation';
  const enrollHref =
    fallbackAction === 'checkout' ? enrollHrefForTier(siteCertId, tierId, offeringId) : null;
  return {
    label: fallbackAction === 'checkout' ? 'Enroll now' : 'View pathway',
    modalMode: fallbackAction === 'checkout' ? 'enroll' : 'consultation',
    proceedHref: hrefForCtaAction(fallbackAction, offeringId, siteCertId),
    proceedLabel: fallbackAction === 'checkout' ? 'Enroll now' : 'Book consultation now',
    enrollHref,
    enrollLabel: 'Enroll now',
    showConsultationInModal: fallbackAction !== 'checkout',
  };
}
