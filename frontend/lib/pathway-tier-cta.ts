import type { OfferingStatus, TierId } from '@/types/regional-catalogue';
import { canCheckout } from '@/lib/status-normalize';
import { hrefForCtaAction, type CtaAction } from '@/lib/cta-router';
import { enrollPath, enrollTierSlugFromTierId, enrollmentPathForOffering } from '@/lib/enrollment-routes';
import { CTAS } from '@/lib/brand-voice';
import { enrollmentPrimaryLabelForTier, enrollmentProceedLabelForTier } from '@/lib/enrollment/enrollment-copy';

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

const PRO_MASTERY_ENROLL_LABEL = CTAS.pathwayReserveSeat;

export function isPmpFoundationPathway(siteCertId: string, tierId: string): boolean {
  return siteCertId === 'pmp' && tierId === 'foundation';
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
  const waitlistHref = hrefForCtaAction('waitlist', offeringId, siteCertId);
  const globalHref = hrefForCtaAction('global_checkout', offeringId, siteCertId);
  const primaryLabel = enrollmentPrimaryLabelForTier('foundation');
  const enrollLabel = enrollmentProceedLabelForTier('foundation');

  if (status === 'consultation_required') {
    return {
      label: primaryLabel,
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
      label: primaryLabel,
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
    label: primaryLabel,
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
  const isMastery = isMasteryTierId(tierId);
  const primaryEnrollLabel = isMastery ? PRO_MASTERY_ENROLL_LABEL : enrollmentPrimaryLabelForTier('professional');
  const proceedEnrollLabel = isMastery ? PRO_MASTERY_ENROLL_LABEL : enrollmentProceedLabelForTier('professional');
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
      enrollLabel: proceedEnrollLabel,
      ...mentorModalFields(true),
    };
  }
  if (status === 'scholarship_verify') {
    return {
      label: enrollHref ? primaryEnrollLabel : 'View pathway',
      modalMode: 'scholarship',
      proceedHref: scholarshipHref,
      proceedLabel: 'Request scholarship review',
      enrollHref,
      enrollLabel: proceedEnrollLabel,
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
      enrollLabel: proceedEnrollLabel,
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
        enrollLabel: proceedEnrollLabel,
        ...mentorModalFields(true),
      };
    }
  }

  return {
    label: enrollHref ? primaryEnrollLabel : 'View pathway',
    modalMode: enrollHref ? 'enroll' : 'consultation',
    proceedHref: enrollHref ?? consultationHref,
    proceedLabel: enrollHref ? proceedEnrollLabel : CTAS.pathwayMentorCta,
    enrollHref,
    enrollLabel: proceedEnrollLabel,
    ...mentorModalFields(!enrollHref),
  };
}

/** Enrollment button label by pathway tier (Foundation vs Professional / Mastery). */
export function pathwayEnrollLabelForTier(tierId: string, _siteCertId?: string): string {
  if (tierId === 'foundation') {
    return enrollmentProceedLabelForTier('foundation');
  }
  if (tierId === 'professional') return enrollmentProceedLabelForTier('professional');
  if (isMasteryTierId(tierId)) return PRO_MASTERY_ENROLL_LABEL;
  return 'Enroll now';
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
