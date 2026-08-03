import type { OfferingStatus, TierId } from '@/types/regional-catalogue';
import { canCheckout } from '@/lib/status-normalize';
import { hrefForCtaAction, type CtaAction } from '@/lib/cta-router';
import { enrollPath, enrollTierSlugFromTierId, enrollmentPathForOffering } from '@/lib/enrollment-routes';
import { CTAS } from '@/lib/brand-voice';

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
  /** Show mentor scheduling alongside enroll in the preview modal. */
  showConsultationInModal: boolean;
  /** Label for mentor scheduling in modal (Professional / Mastery). */
  consultationLabel?: string;
}

const MASTERY_TIERS: TierId[] = ['mastery', 'mastery_corporate', 'mastery_advisory'];

function mentorModalFields(showConsultation: boolean): Pick<TierPathwayCta, 'showConsultationInModal' | 'consultationLabel'> {
  return showConsultation
    ? { showConsultationInModal: true, consultationLabel: CTAS.pathwayMentorCta }
    : { showConsultationInModal: false };
}

const PMP_FOUNDATION_ENROLL_LABEL = 'Enroll now';
const PRO_MASTERY_ENROLL_LABEL = CTAS.pathwayReserveSeat;

export function isPmpFoundationPathway(siteCertId: string, tierId: string): boolean {
  return siteCertId === 'pmp' && tierId === 'foundation';
}

function foundationEnrollLabel(siteCertId: string): string {
  return isPmpFoundationPathway(siteCertId, 'foundation')
    ? PMP_FOUNDATION_ENROLL_LABEL
    : PRO_MASTERY_ENROLL_LABEL;
}

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
  const enrollLabel = foundationEnrollLabel(siteCertId);

  if (status === 'consultation_required') {
    return {
      label: enrollLabel,
      modalMode: 'enroll',
      proceedHref: enrollHref,
      proceedLabel: enrollLabel,
      enrollHref,
      enrollLabel,
      showConsultationInModal: false,
    };
  }
  if (status === 'scholarship_unavailable') {
    return {
      label: enrollLabel,
      modalMode: 'global',
      proceedHref: globalHref,
      proceedLabel: 'Proceed with global pricing',
      enrollHref: enrollHref,
      enrollLabel,
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
      enrollLabel,
      showConsultationInModal: false,
    };
  }

  return {
    label: enrollLabel,
    modalMode: status === 'scholarship_verify' ? 'verify' : 'enroll',
    proceedHref: enrollHref,
    proceedLabel: enrollLabel,
    enrollHref,
    enrollLabel,
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
  const enrollHref =
    status === 'waitlist'
      ? null
      : canCheckout(status) ||
          status === 'global_only' ||
          status === 'scholarship_unavailable'
        ? enrollHrefForTier(siteCertId, tierId, offeringId)
        : null;
  const consultationHref = hrefForCtaAction('consultation', offeringId, siteCertId);
  const scholarshipHref = hrefForCtaAction('scholarship_review', offeringId, siteCertId);
  const waitlistHref = hrefForCtaAction('waitlist', offeringId, siteCertId);
  const globalHref = hrefForCtaAction('global_checkout', offeringId, siteCertId);

  if (status === 'consultation_required') {
    return {
      label: 'View pathway',
      modalMode: 'consultation',
      proceedHref: consultationHref,
      proceedLabel: CTAS.pathwayMentorCta,
      enrollHref: null,
      enrollLabel: PRO_MASTERY_ENROLL_LABEL,
      ...mentorModalFields(true),
    };
  }
  if (status === 'scholarship_verify') {
    return {
      label: enrollHref ? PRO_MASTERY_ENROLL_LABEL : 'View pathway',
      modalMode: 'scholarship',
      proceedHref: scholarshipHref,
      proceedLabel: 'Request scholarship review',
      enrollHref,
      enrollLabel: PRO_MASTERY_ENROLL_LABEL,
      ...mentorModalFields(!enrollHref),
    };
  }
  if (status === 'waitlist') {
    return {
      label: 'Join waitlist',
      modalMode: 'waitlist',
      proceedHref: waitlistHref,
      proceedLabel: 'Join waitlist',
      enrollHref: null,
      enrollLabel: PRO_MASTERY_ENROLL_LABEL,
      ...mentorModalFields(false),
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
        enrollLabel: PRO_MASTERY_ENROLL_LABEL,
        ...mentorModalFields(true),
      };
    }
  }

  return {
    label: enrollHref ? PRO_MASTERY_ENROLL_LABEL : 'View pathway',
    modalMode: enrollHref ? 'enroll' : 'consultation',
    proceedHref: enrollHref ?? consultationHref,
    proceedLabel: enrollHref ? PRO_MASTERY_ENROLL_LABEL : CTAS.pathwayMentorCta,
    enrollHref,
    enrollLabel: PRO_MASTERY_ENROLL_LABEL,
    ...mentorModalFields(!enrollHref),
  };
}

/** Enrollment button label by pathway tier (Foundation vs Professional / Mastery). */
export function pathwayEnrollLabelForTier(tierId: string, siteCertId?: string): string {
  if (tierId === 'foundation') {
    return siteCertId ? foundationEnrollLabel(siteCertId) : PRO_MASTERY_ENROLL_LABEL;
  }
  if (tierId === 'professional' || isMasteryTierId(tierId)) return PRO_MASTERY_ENROLL_LABEL;
  return siteCertId ? foundationEnrollLabel(siteCertId) : PMP_FOUNDATION_ENROLL_LABEL;
}

/** Human-readable pathway blurb (not raw matrix delivery string). */
export function tierPathwaySummary(tierId: string): string {
  if (tierId === 'foundation') {
    return 'Self-paced LMS pathway with one mentor guidance meeting after course completion, before certification.';
  }
  if (tierId === 'professional') {
    return 'Mentor-led weekly sessions, or self-paced online with two one-hour mentor meetings (start and end).';
  }
  if (isMasteryTierId(tierId)) {
    return 'Mentor-led pathway with two mentor meetings (start and end), readiness review, and structured accountability.';
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
 * Primary pathway CTA per tier: opens programme preview modal, then enrollment and/or Calendly.
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
    proceedLabel: fallbackAction === 'checkout' ? 'Enroll now' : CTAS.pathwayMentorCta,
    enrollHref,
    enrollLabel: 'Enroll now',
    ...(fallbackAction !== 'checkout' ? mentorModalFields(true) : mentorModalFields(false)),
  };
}
