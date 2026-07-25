'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useRegion } from '@/contexts/RegionContext';
import {
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';
import {
  WORK_FIELD_OPTIONS,
  NEEDS_OBJECTIVE_OPTIONS,
  EDUCATION_OPTIONS,
  PM_EXPERIENCE_OPTIONS,
  TRAINING_STATUS_OPTIONS,
  EXAM_TIMELINE_OPTIONS,
  resolveQualificationOutcome,
  getOutcomeMessage,
  type WorkFieldValue,
  type NeedsObjectiveValue,
  type EducationValue,
  type PmExperienceValue,
  type TrainingStatusValue,
  type ExamTimelineValue,
} from '@/lib/pmp-qualification-options';
import {
  createClientSubmissionId,
  submitPublicInteraction,
} from '@/lib/interactions/submit-public';
import {
  buildPmpQualificationSubmissionPayload,
  getPmpChoiceTabIndex,
  getOrCreatePmpSubmissionId,
  hasPmpQualificationPartialData,
  nextPmpQualificationStep,
  previousPmpQualificationStep,
  validatePmpQualificationStep,
  type PmpQualificationFormStep,
  type PmpQualificationFormValues,
  type PmpQualificationValidationIssue,
} from '@/lib/pmp-qualification-form';
import { mapRegionIdToAnalyticsRegion } from '@/lib/analytics/pms-events';
import {
  trackPmpQualificationFormStart,
  trackPmpQualificationFitComplete,
  trackPmpQualificationEligibilityComplete,
} from '@/lib/analytics/track-pmp-qualification';
import { CertFamilyMark } from '@/components/CertFamilyMark';
import BrandIconMark from '@/components/BrandIconMark';
import { useLeadRecoveryOptional } from '@/components/conversion-recovery/LeadRecoveryProvider';
import type { LeadRecoveryVariant } from '@/lib/conversion-recovery/types';
import { useFormPartialRecovery } from '@/components/conversion-recovery/useFormPartialRecovery';
import { resolveHomeHeroForm, type HomeHeroForm } from '@pms/site-content';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing';
import { resolvePortalQuoteSurface } from '@/lib/channel-landing-pages/portalQuoteSurface';
import { portalThemeToCssVars } from '@/lib/channel-landing-pages/resolvePortalTheme';
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils';
import PortalButton from '@/components/channel-landing/portal/primitives/PortalButton';
import PortalSectionHead from '@/components/channel-landing/portal/primitives/PortalSectionHead';

export type PmpRoadmapFormPlacement =
  | 'home_hero_mobile'
  | 'home_hero_desktop'
  | 'home_insights'
  | 'certifications_hub_mobile'
  | 'certifications_hub_desktop'
  | 'cert_pmp_hero'
  | 'cert_pmp_mobile'
  | 'cert_hero'
  | 'cert_mobile'
  | 'channel_portal';

type PmpRoadmapLeadFormProps = {
  placement: PmpRoadmapFormPlacement;
  variant?: 'hero' | 'insights' | 'cert';
  className?: string;
  /** Certification detail pages: drives headline and submission metadata */
  certId?: string;
  certName?: string;
  familyId?: string;
  /** Channel portal (/go/*): attribution on lead payload */
  portalChannelId?: string;
  portalLandingSlug?: string;
  /** Portal page theme: styles the form to match /go/{slug} chrome */
  portalTheme?: PlatformPortalTheme;
  /** Homepage hero / insights placements: CMS copy overrides */
  heroCopy?: HomeHeroForm | null;
  /** Channel portal: title/subtitle rendered outside the card by {@link ChannelPortalRoadmapForm} */
  omitPortalSectionHead?: boolean;
};

const PLACEMENT_LABELS: Record<PmpRoadmapFormPlacement, string> = {
  home_hero_mobile: 'Home hero (mobile)',
  home_hero_desktop: 'Home hero (desktop)',
  home_insights: 'Home insights band',
  certifications_hub_mobile: 'Certifications hub hero (mobile)',
  certifications_hub_desktop: 'Certifications hub hero (desktop)',
  cert_pmp_hero: 'PMP certification hero',
  cert_pmp_mobile: 'PMP certification hero (mobile)',
  cert_hero: 'Certification hero',
  cert_mobile: 'Certification hero (mobile)',
  channel_portal: 'Channel portal (/go)',
};

function placementLabel(placement: PmpRoadmapFormPlacement, certName?: string): string {
  const base = PLACEMENT_LABELS[placement];
  return certName ? `${certName}: ${base}` : base;
}

function PmsFormHeaderMark({ compact }: { compact: boolean }) {
  return <BrandIconMark size={compact ? 48 : 56} priority />;
}

function portalFieldStyle(theme: PlatformPortalTheme): React.CSSProperties {
  return {
    borderRadius: theme.radius,
    border: `1px solid ${theme.cardBorder}`,
    backgroundColor: theme.surface,
    color: theme.text,
  };
}

/** Dial-code listbox: portaled outside .portal-root, so carry full portal tokens on the popup. */
function portalSelectContentStyle(theme: PlatformPortalTheme): React.CSSProperties {
  return {
    ...portalThemeToCssVars(theme),
    backgroundColor: theme.surface,
    color: theme.text,
    border: `1px solid ${theme.cardBorder}`,
    borderRadius: theme.radius,
    boxShadow: '0 12px 40px rgb(0 0 0 / 0.45)',
  };
}

const PORTAL_SELECT_CONTENT_CLASS =
  'border shadow-xl ring-0 bg-[var(--portal-surface)] text-[var(--portal-text)] ' +
  '[&_[data-slot=select-item]:focus]:bg-[var(--portal-surface-muted)] ' +
  '[&_[data-slot=select-item]:focus]:text-[var(--portal-text)] ' +
  '[&_[data-slot=select-item][data-highlighted]]:bg-[var(--portal-surface-muted)] ' +
  '[&_[data-slot=select-item][data-highlighted]]:text-[var(--portal-text)] ' +
  '[&_[data-slot=select-scroll-up-button]]:bg-[var(--portal-surface)] ' +
  '[&_[data-slot=select-scroll-down-button]]:bg-[var(--portal-surface)] ' +
  '[&_[data-slot=select-item]_svg]:text-[var(--portal-primary)]';

function portalCtaBackground(theme: PlatformPortalTheme): string {
  const bg =
    typeof theme.recommendedBg === 'string' && !theme.recommendedBg.includes('gradient')
      ? theme.recommendedBg
      : theme.primary;
  return bg;
}

function portalChipStyle(theme: PlatformPortalTheme, selected: boolean): React.CSSProperties {
  const accentBg = portalCtaBackground(theme);
  const accentFg = theme.recommendedText ?? pickReadableForeground(accentBg);
  const base = { borderRadius: theme.radius };
  if (selected) {
    return {
      ...base,
      backgroundColor: accentBg,
      color: accentFg,
      borderWidth: 0,
      borderStyle: 'none',
    };
  }
  return {
    ...base,
    backgroundColor: theme.surface,
    color: theme.text,
    borderWidth: 0,
    borderStyle: 'none',
  };
}

const portalChoiceRowClass = 'grid grid-cols-2 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3';
const portalChoiceChipClass =
  'flex h-10 min-w-0 w-full cursor-pointer items-center justify-center rounded-lg border-none border-0 text-body-sm font-bold leading-none shadow-none transition-colors max-sm:px-2 max-sm:text-xs sm:flex-1 sm:px-3';

function PortalChoiceSectionLabel({
  id,
  children,
  portalTheme,
  labelClass,
}: {
  id: string;
  children: React.ReactNode;
  portalTheme?: PlatformPortalTheme;
  labelClass: string;
}) {
  return (
    <span
      id={id}
      className={cn(labelClass, 'mb-0 block w-full pb-0 leading-none')}
      style={portalTheme ? { color: portalTheme.textMuted } : undefined}
    >
      {children}{' '}
      <span style={portalTheme ? { color: portalTheme.primary } : undefined}>*</span>
    </span>
  );
}

function RoadmapChoiceChip({
  selected,
  onClick,
  children,
  portalTheme,
  className,
  useCompactRow,
  tabIndex,
  ...aria
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  portalTheme?: PlatformPortalTheme;
  className?: string;
  useCompactRow?: boolean;
  tabIndex: 0 | -1;
  'aria-checked': boolean;
  'aria-expanded'?: boolean;
}) {
  const compact = useCompactRow || Boolean(portalTheme);
  const handleArrowKey = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
      return;
    }
    const group = event.currentTarget.closest<HTMLElement>('[role="radiogroup"]');
    const choices = group
      ? Array.from(group.querySelectorAll<HTMLButtonElement>('[role="radio"]'))
      : [];
    if (choices.length === 0) return;
    event.preventDefault();
    const currentIndex = Math.max(0, choices.indexOf(event.currentTarget));
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? choices.length - 1
          : event.key === 'ArrowRight' || event.key === 'ArrowDown'
            ? (currentIndex + 1) % choices.length
            : (currentIndex - 1 + choices.length) % choices.length;
    choices[nextIndex]?.focus();
    choices[nextIndex]?.click();
  };
  return (
    <button
      type="button"
      role="radio"
      className={cn(compact && portalChoiceChipClass, className)}
      style={portalTheme ? portalChipStyle(portalTheme, selected) : undefined}
      onClick={onClick}
      onKeyDown={handleArrowKey}
      tabIndex={tabIndex}
      {...aria}
    >
      {children}
    </button>
  );
}

function FormPrivacyNotice({
  compact,
  privacyPrefix,
  privacyLinkLabel,
  portalTheme,
}: {
  compact: boolean;
  privacyPrefix?: string;
  privacyLinkLabel?: string;
  portalTheme?: PlatformPortalTheme;
}) {
  const prefix = privacyPrefix ?? 'By submitting, you agree to our';
  const linkLabel = privacyLinkLabel ?? 'Privacy Policy';
  return (
    <p
      className={cn(
        '!mt-0',
        !portalTheme && 'text-slate-500 dark:text-slate-400',
        compact ? 'text-[10px] leading-snug' : 'text-[11px] leading-relaxed',
      )}
      style={portalTheme ? { color: portalTheme.textMuted } : undefined}
    >
      {prefix}{' '}
      <Link
        href="/legal/privacy"
        className={cn('font-semibold hover:underline', !portalTheme && 'text-brand-orange')}
        style={portalTheme ? { color: portalTheme.linkColor } : undefined}
      >
        {linkLabel}
      </Link>
      .
    </p>
  );
}

/** Infer initial dial code from user's region context (prefer region over blind US default). */
function inferInitialDialCode(regionId?: string | null, gccCountry?: string | null): string {
  if (regionId === 'gcc') {
    // Map GCC countries to dial codes
    const gccDialMap: Record<string, string> = {
      AE: 'ae',
      SA: 'sa',
      KW: 'kw',
      QA: 'qa',
      BH: 'bh',
      OM: 'om',
    };
    if (gccCountry && gccDialMap[gccCountry]) {
      return gccDialMap[gccCountry];
    }
    return 'ae'; // Default to UAE for GCC
  }
  if (regionId === 'india') return 'in';
  if (regionId === 'pakistan') return 'pk';
  if (regionId === 'uk') return 'gb';
  // Default to global (US) only if no region hint
  return 'us';
}

export function PmpRoadmapLeadForm({
  placement,
  variant = 'hero',
  className,
  certId,
  certName,
  familyId,
  portalChannelId,
  portalLandingSlug,
  portalTheme,
  heroCopy,
  omitPortalSectionHead = false,
}: PmpRoadmapLeadFormProps) {
  const { regionId, gccCountry } = useRegion();
  const idPrefix = [placement, certId].filter(Boolean).join('-').replace(/[^a-z0-9]/gi, '-');
  const isHomeForm =
    placement === 'home_hero_mobile' ||
    placement === 'home_hero_desktop' ||
    placement === 'home_insights' ||
    placement === 'certifications_hub_mobile' ||
    placement === 'certifications_hub_desktop';
  const isPortalCertRoadmap = placement === 'channel_portal';
  const isPortalThemed = isPortalCertRoadmap && Boolean(portalTheme);
  const showPortalSectionHead = isPortalThemed && !omitPortalSectionHead;
  const portalQuoteSurface = portalTheme ? resolvePortalQuoteSurface(portalTheme) : null;
  const homeFormCopy =
    isHomeForm && (placement === 'home_hero_mobile' || placement === 'home_hero_desktop') && heroCopy
      ? resolveHomeHeroForm(heroCopy)
      : null;
  const roadmapLabel = certName ?? 'PMP®';
  const formTitle = homeFormCopy?.title ?? `Build your ${roadmapLabel} roadmap`;
  const formSubtitle =
    homeFormCopy?.subtitle ?? `Share your background: we'll map a ${roadmapLabel} study plan for you.`;

  // Step management
  const [currentStep, setCurrentStep] = React.useState<PmpQualificationFormStep>('fit');

  // Step 1: Fit (work field + needs)
  const [workField, setWorkField] = React.useState<WorkFieldValue | ''>('');
  const [needsObjective, setNeedsObjective] = React.useState<NeedsObjectiveValue | ''>('');

  // Step 2: Eligibility (education, experience, training, timing)
  const [education, setEducation] = React.useState<EducationValue | ''>('');
  const [pmExperience, setPmExperience] = React.useState<PmExperienceValue | ''>('');
  const [trainingStatus, setTrainingStatus] = React.useState<TrainingStatusValue | ''>('');
  const [examTimeline, setExamTimeline] = React.useState<ExamTimelineValue | ''>('');

  // Step 3: Contact
  const [fullName, setFullName] = React.useState('');
  const inferredDialCode = React.useMemo(() => inferInitialDialCode(regionId, gccCountry), [regionId, gccCountry]);
  const [dialValue, setDialValue] = React.useState(inferredDialCode);
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');

  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const formStartedRef = React.useRef(false);
  const clientSubmissionIdRef = React.useRef<string | null>(null);
  const ensureFormSessionId = () => {
    const id = getOrCreatePmpSubmissionId(
      clientSubmissionIdRef.current,
      createClientSubmissionId,
    );
    clientSubmissionIdRef.current = id;
    return id;
  };

  // Sync dial code when region changes
  React.useEffect(() => {
    if (!dialValue || dialValue === 'us') {
      setDialValue(inferredDialCode);
    }
  }, [inferredDialCode, dialValue]);

  const recovery = useLeadRecoveryOptional();
  const partialVariant: LeadRecoveryVariant = placement === 'home_insights'
    ? 'home_insights_partial'
    : placement.startsWith('cert') && certId
      ? 'cert_roadmap_partial'
      : 'home_roadmap_partial';

  const formValues: PmpQualificationFormValues = {
    workField,
    needsObjective,
    education,
    pmExperience,
    trainingStatus,
    examTimeline,
    fullName,
    phone,
    email,
  };
  const hasPartialData = hasPmpQualificationPartialData(formValues);

  const { markTouched } = useFormPartialRecovery({
    variant: partialVariant,
    isSubmitted: submitted,
    hasPartialData,
    extraContext: {
      siteCertId: certId,
      certName,
      parentSurface: 'roadmap_form',
    },
    onRequestRecovery: (ctx) => recovery?.requestRecovery(ctx, { requireIntent: true }),
  });

  const touchField = () => {
    recovery?.markFormTouched();
    markTouched();
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackPmpQualificationFormStart({
        formSessionId: ensureFormSessionId(),
        formPlacement: placement,
        regionGroup: mapRegionIdToAnalyticsRegion(regionId),
        channel: portalChannelId,
        goSlug: portalLandingSlug ?? portalChannelId,
      });
    }
  };

  const shellClass = cn(
    !isPortalThemed &&
      cn(
        'rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border shadow-2xl overflow-hidden',
        (placement === 'home_hero_mobile' || placement === 'home_hero_desktop') &&
          'min-h-[420px] sm:min-h-[440px]',
        variant === 'cert'
          ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-slate-900/10 dark:shadow-black/30',
      ),
    className,
  );

  const formHeaderClass = cn(
    'shrink-0 border-b border-slate-100 bg-gradient-to-br from-brand-purple/5 via-white to-brand-orange/5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800',
  );

  const isCompact = variant === 'cert';
  const isCertHeroDesktop = placement === 'cert_hero';
  const isCertMobileForm = isCompact && !isCertHeroDesktop;
  const isMobilePlacement =
    placement === 'home_hero_mobile' ||
    placement === 'certifications_hub_mobile' ||
    placement === 'cert_pmp_mobile' ||
    placement === 'cert_mobile';
  const isExpandedForm = !isCompact && !isCertHeroDesktop;
  const useHeroFormHeader = isExpandedForm || isPortalCertRoadmap;

  const labelClass = cn(
    'font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide',
    isCertHeroDesktop || isCertMobileForm ? 'text-[11px]' : 'text-[11px] sm:text-xs',
  );
  const fieldGroupClass = cn(
    isCertHeroDesktop
      ? 'space-y-2'
      : isCertMobileForm
        ? 'space-y-3'
        : isCompact
          ? 'space-y-1.5'
          : isExpandedForm
            ? 'space-y-2.5'
            : 'space-y-2',
  );
  const fieldClass = cn(
    'w-full text-sm focus-visible:ring-brand-orange/40',
    isCertHeroDesktop || isCertMobileForm ? 'h-[40px]' : isCompact ? 'h-9' : 'h-10',
  );
  const certHeroControlHeight = 'h-[40px]';
  const toggleOptionClass = (selected: boolean) =>
    cn(
      'flex min-w-0 w-full cursor-pointer items-center justify-center break-words rounded-lg border px-2 text-center font-bold leading-snug transition-colors sm:w-auto sm:flex-[1_1_7rem] sm:px-3',
      isCompact ? 'py-2 text-xs sm:text-sm' : 'py-2.5 text-sm',
      selected
        ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-orange/40 dark:bg-slate-900 dark:text-slate-300',
    );
  const choiceGroupClass = isPortalCertRoadmap
    ? portalChoiceRowClass
    : 'grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3';

  const focusValidationIssue = (issue: PmpQualificationValidationIssue) => {
    const targetSuffix: Record<PmpQualificationValidationIssue['field'], string> = {
      workField: 'work-field-options',
      needsObjective: 'needs-options',
      education: 'education-options',
      pmExperience: 'experience-options',
      trainingStatus: 'training-options',
      examTimeline: 'timeline-options',
      fullName: 'name',
      phone: 'phone',
      email: 'email',
    };
    requestAnimationFrame(() => {
      const target = document.getElementById(`${idPrefix}-${targetSuffix[issue.field]}`);
      const focusTarget =
        target?.matches('input,button,[tabindex]') === true
          ? target
          : target?.querySelector<HTMLElement>('input,button,[tabindex]');
      (focusTarget as HTMLElement | null)?.focus();
    });
  };

  const moveToStep = (nextStep: PmpQualificationFormStep) => {
    setCurrentStep(nextStep);
    requestAnimationFrame(() => {
      const firstInput = formRef.current?.querySelector<HTMLElement>(
        `[data-step="${nextStep}"] input, [data-step="${nextStep}"] button`,
      );
      firstInput?.focus();
    });
  };

  const handleStepNext = (nextStep: PmpQualificationFormStep) => {
    setError(null);
    const issue = validatePmpQualificationStep(currentStep, formValues);
    if (issue) {
      setError(issue.message);
      focusValidationIssue(issue);
      return;
    }

    if (currentStep === 'fit') {
      trackPmpQualificationFitComplete({
        formSessionId: ensureFormSessionId(),
        formPlacement: placement,
        regionGroup: mapRegionIdToAnalyticsRegion(regionId),
        leadField: workField as WorkFieldValue,
        leadObjective: needsObjective as NeedsObjectiveValue,
        channel: portalChannelId,
        goSlug: portalLandingSlug ?? portalChannelId,
      });
    } else if (currentStep === 'eligibility') {
      trackPmpQualificationEligibilityComplete({
        formSessionId: ensureFormSessionId(),
        formPlacement: placement,
        regionGroup: mapRegionIdToAnalyticsRegion(regionId),
        leadField: workField as WorkFieldValue,
        leadObjective: needsObjective as NeedsObjectiveValue,
        educationBand: education as EducationValue,
        experienceBand: pmExperience as PmExperienceValue,
        trainingStatus: trainingStatus as TrainingStatusValue,
        examTimeline: examTimeline as ExamTimelineValue,
        channel: portalChannelId,
        goSlug: portalLandingSlug ?? portalChannelId,
      });
    }

    moveToStep(nextStep);
  };

  const handleStepBack = () => {
    setError(null);
    moveToStep(previousPmpQualificationStep(currentStep));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== 'contact') {
      return; // Should not happen but safety check
    }

    const issue = validatePmpQualificationStep('contact', formValues);
    if (issue) {
      setError(issue.message);
      focusValidationIssue(issue);
      return;
    }

    setError(null);
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const dialCode = dialOption.code;

    // Resolve qualification outcome (never claims formal eligibility)
    const outcome = resolveQualificationOutcome({
      workField: workField as WorkFieldValue,
      needsObjective: needsObjective as NeedsObjectiveValue,
      education: education as EducationValue,
      pmExperience: pmExperience as PmExperienceValue,
      trainingStatus: trainingStatus as TrainingStatusValue,
      examTimeline: examTimeline as ExamTimelineValue,
    });

    const clientSubmissionId = ensureFormSessionId();
    const res = await submitPublicInteraction({
      source: 'pmp_roadmap_lead',
      subject: `PMP Qualification Roadmap: ${placementLabel(placement, certName)}`,
      email,
      clientSubmissionId,
      website: honeypot,
      formContext: {
        formId: 'pmp_qualification_roadmap',
        formLabel: 'PMP Qualification Roadmap (P0.4)',
        placement: placementLabel(placement, certName),
        pagePath,
        siteCertId: certId,
        certName: certName ?? 'PMP',
        regionId,
        channelKey: portalChannelId,
        landingSlug: portalLandingSlug,
      },
      payload: buildPmpQualificationSubmissionPayload({
        values: formValues,
        dialCode,
        dialPrefix: dialOption.prefix,
        qualificationOutcome: outcome,
        placement,
        siteCertId: certId,
        certName: certName ?? 'PMP',
        gccCountry: gccCountry ?? undefined,
        channelId: portalChannelId,
        landingSlug: portalLandingSlug,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      recovery?.notifyConverted();
      setSubmitted(true);
    } else {
      setError(res.error ?? 'Submission failed. Try again.');
    }
  };

  if (submitted) {
    const outcome = resolveQualificationOutcome({
      workField: workField as WorkFieldValue,
      needsObjective: needsObjective as NeedsObjectiveValue,
      education: education as EducationValue,
      pmExperience: pmExperience as PmExperienceValue,
      trainingStatus: trainingStatus as TrainingStatusValue,
      examTimeline: examTimeline as ExamTimelineValue,
    });
    const outcomeMessage = getOutcomeMessage(outcome);

    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p
          className={cn('text-base font-semibold', !isPortalThemed && 'text-green-700 dark:text-green-400')}
          style={isPortalThemed && portalTheme ? { color: portalTheme.primary } : undefined}
        >
          Thank you! We've received your details.
        </p>
        <p
          className={cn('mt-3 text-sm', !isPortalThemed && 'text-slate-600 dark:text-slate-300')}
          style={isPortalThemed && portalTheme ? { color: portalTheme.text } : undefined}
        >
          {outcomeMessage}
        </p>
        <p
          className={cn('mt-3 text-sm', !isPortalThemed && 'text-slate-500 dark:text-slate-400')}
          style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
        >
          We'll follow up soon. Questions?{' '}
          <Link
            href="/contact"
            className={cn('font-bold hover:underline', !isPortalThemed && 'text-brand-orange')}
            style={isPortalThemed && portalTheme ? { color: portalTheme.linkColor } : undefined}
          >
            Contact us
          </Link>
        </p>
      </div>
    );
  }

  // Progress indicator
  const stepNumber = currentStep === 'fit' ? 1 : currentStep === 'eligibility' ? 2 : 3;
  const progressPercent = (stepNumber / 3) * 100;

  return (
    <div className={cn(shellClass, isCertHeroDesktop && 'flex min-h-[756px] flex-col')} data-portal-form={isPortalThemed || undefined}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={cn(
          'flex flex-col',
          isCertHeroDesktop && 'min-h-0 flex-1',
          isExpandedForm && !isPortalThemed && 'max-lg:max-h-none lg:max-h-[min(90vh,52rem)]',
        )}
        aria-labelledby={`${idPrefix}-title`}
        aria-describedby={error ? `${idPrefix}-form-error` : undefined}
      >
        {!omitPortalSectionHead ? (
        <div
          className={cn(
            'shrink-0 border-b',
            !isPortalThemed && formHeaderClass,
            isPortalThemed
              ? 'px-5 sm:px-6 pt-0 pb-4 sm:pb-5'
              : isCertHeroDesktop
                ? 'px-5 py-4 sm:px-6'
                : useHeroFormHeader
                  ? 'px-5 py-5 sm:px-6 sm:py-6'
                  : isCertMobileForm
                    ? 'px-5 py-5 sm:px-6'
                    : isCompact
                      ? 'px-5 py-4 sm:px-6'
                      : 'px-5 py-5 sm:px-6 sm:py-6',
          )}
          style={
            isPortalThemed && portalQuoteSurface
              ? {
                  backgroundColor: portalQuoteSurface.backgroundColor,
                  borderColor: portalQuoteSurface.borderColor,
                }
              : undefined
          }
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {!isMobilePlacement && !isPortalThemed ? (
              !familyId ? (
                <PmsFormHeaderMark compact={!useHeroFormHeader} />
              ) : (
                <div
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-white/90 px-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800/90',
                    isCompact ? 'h-12' : 'h-14',
                    familyId === 'PRINCE2' ? 'min-w-[5rem] sm:min-w-[5.5rem]' : 'w-12 sm:w-14',
                  )}
                  aria-hidden
                >
                  <CertFamilyMark
                    familyId={familyId}
                    imageClassName={
                      familyId === 'PRINCE2'
                        ? 'h-7 w-auto max-w-[5.25rem] object-contain'
                        : 'h-9 w-9 object-contain'
                    }
                  />
                </div>
              )
            ) : null}
            <div className="min-w-0 flex-1">
              {showPortalSectionHead && portalTheme ? (
                <PortalSectionHead
                  theme={portalTheme}
                  titleId={`${idPrefix}-title`}
                  titleAs="p"
                  title={formTitle}
                  subtitle={formSubtitle}
                  className="mb-0"
                />
              ) : !isPortalThemed ? (
                <>
                  <p
                    id={`${idPrefix}-title`}
                    className={cn(
                      'font-heading font-bold tracking-tight',
                      'text-slate-900 dark:text-white',
                      useHeroFormHeader
                        ? 'text-lg sm:text-xl'
                        : isCompact
                          ? 'text-base sm:text-lg'
                          : 'text-lg sm:text-xl',
                    )}
                  >
                    {formTitle}
                  </p>
                  <p
                    className={cn(
                      'font-medium mt-0.5 text-slate-500 dark:text-slate-400',
                      useHeroFormHeader ? 'text-sm' : isCompact ? 'text-xs sm:text-sm' : 'text-sm',
                      placement === 'home_hero_mobile' ? 'hidden sm:block' : undefined,
                    )}
                  >
                    {formSubtitle}
                  </p>
                </>
              ) : null}

              {/* Progress indicator */}
              <div className="mt-3" role="progressbar" aria-valuenow={stepNumber} aria-valuemin={1} aria-valuemax={3} aria-label={`Step ${stepNumber} of 3`}>
                <div className="flex gap-1.5">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all',
                        step <= stepNumber
                          ? isPortalThemed
                            ? 'opacity-100'
                            : 'bg-brand-orange'
                          : isPortalThemed
                            ? 'opacity-30'
                            : 'bg-slate-200 dark:bg-slate-700'
                      )}
                      style={
                        isPortalThemed && portalTheme && step <= stepNumber
                          ? { backgroundColor: portalTheme.primary }
                          : isPortalThemed && portalTheme
                            ? { backgroundColor: portalTheme.textMuted }
                            : undefined
                      }
                    />
                  ))}
                </div>
                <p
                  className={cn(
                    'mt-2 text-xs font-medium',
                    !isPortalThemed && 'text-slate-500 dark:text-slate-400'
                  )}
                  style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
                >
                  Step {stepNumber} of 3
                </p>
              </div>
            </div>
          </div>
        </div>
        ) : null}

        <div
          className={cn(
            isCertHeroDesktop
              ? 'flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-6 sm:py-7 gap-5'
              : isCertMobileForm
                ? 'space-y-4 px-5 py-6 sm:px-6'
                : isCompact
                  ? 'space-y-2.5 px-5 py-4 sm:px-6'
                  : isPortalThemed
                    ? `${portalSpacing.portalFormInset} pt-4 sm:pt-5 pb-0 space-y-5 sm:space-y-6`
                    : cn(
                      'px-5 py-6 sm:px-6 sm:py-7 space-y-5 sm:space-y-6',
                      'lg:min-h-0 lg:flex-1 lg:overflow-y-auto',
                    ),
          )}
        >
          {/* Step 1: Fit (work field + needs) */}
          {currentStep === 'fit' && (
            <div data-step="fit" className="space-y-5 sm:space-y-6">
              <fieldset
                className={cn(
                  'm-0 min-w-0 border-0 p-0',
                  isPortalThemed && 'flex flex-col gap-2.5',
                )}
              >
                {isPortalThemed ? (
                  <PortalChoiceSectionLabel
                    id={`${idPrefix}-work-field-label`}
                    portalTheme={portalTheme}
                    labelClass={labelClass}
                  >
                    Industry
                  </PortalChoiceSectionLabel>
                ) : (
                  <legend id={`${idPrefix}-work-field-label`} className={cn(labelClass, 'mb-2.5')}>
                    Industry <span className="text-brand-orange">*</span>
                  </legend>
                )}
                <div
                  id={`${idPrefix}-work-field-options`}
                  className={choiceGroupClass}
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-work-field-label`}
                  aria-required="true"
                >
                  {WORK_FIELD_OPTIONS.map((opt, optionIndex) => (
                    <RoadmapChoiceChip
                      key={opt.value}
                      selected={workField === opt.value}
                      portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                      useCompactRow={isPortalCertRoadmap}
                      className={!isPortalCertRoadmap ? toggleOptionClass(workField === opt.value) : undefined}
                      aria-checked={workField === opt.value}
                      tabIndex={getPmpChoiceTabIndex(
                        workField === opt.value,
                        Boolean(workField),
                        optionIndex,
                      )}
                      onClick={() => {
                        setWorkField(opt.value);
                        touchField();
                      }}
                    >
                      {opt.label}
                    </RoadmapChoiceChip>
                  ))}
                </div>
              </fieldset>

              <fieldset
                className={cn(
                  'm-0 min-w-0 border-0 p-0',
                  isPortalThemed && 'flex flex-col gap-2.5',
                )}
              >
                {isPortalThemed ? (
                  <PortalChoiceSectionLabel
                    id={`${idPrefix}-needs-label`}
                    portalTheme={portalTheme}
                    labelClass={labelClass}
                  >
                    What do you need help with now?
                  </PortalChoiceSectionLabel>
                ) : (
                  <legend id={`${idPrefix}-needs-label`} className={cn(labelClass, 'mb-2.5')}>
                    What do you need help with now? <span className="text-brand-orange">*</span>
                  </legend>
                )}
                <div
                  id={`${idPrefix}-needs-options`}
                  className={choiceGroupClass}
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-needs-label`}
                  aria-required="true"
                >
                  {NEEDS_OBJECTIVE_OPTIONS.map((opt, optionIndex) => (
                    <RoadmapChoiceChip
                      key={opt.value}
                      selected={needsObjective === opt.value}
                      portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                      useCompactRow={isPortalCertRoadmap}
                      className={!isPortalCertRoadmap ? toggleOptionClass(needsObjective === opt.value) : undefined}
                      aria-checked={needsObjective === opt.value}
                      tabIndex={getPmpChoiceTabIndex(
                        needsObjective === opt.value,
                        Boolean(needsObjective),
                        optionIndex,
                      )}
                      onClick={() => {
                        setNeedsObjective(opt.value);
                        touchField();
                      }}
                    >
                      {opt.label}
                    </RoadmapChoiceChip>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* Step 2: Eligibility (education, experience, training, timing) */}
          {currentStep === 'eligibility' && (
            <div data-step="eligibility" className="space-y-5 sm:space-y-6">
              <fieldset
                className={cn(
                  'm-0 min-w-0 border-0 p-0',
                  isPortalThemed && 'flex flex-col gap-2.5',
                )}
              >
                {isPortalThemed ? (
                  <PortalChoiceSectionLabel
                    id={`${idPrefix}-education-label`}
                    portalTheme={portalTheme}
                    labelClass={labelClass}
                  >
                    Highest completed education
                  </PortalChoiceSectionLabel>
                ) : (
                  <legend id={`${idPrefix}-education-label`} className={cn(labelClass, 'mb-2.5')}>
                    Highest completed education <span className="text-brand-orange">*</span>
                  </legend>
                )}
                <div
                  id={`${idPrefix}-education-options`}
                  className={choiceGroupClass}
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-education-label`}
                  aria-required="true"
                >
                  {EDUCATION_OPTIONS.map((opt, optionIndex) => (
                    <RoadmapChoiceChip
                      key={opt.value}
                      selected={education === opt.value}
                      portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                      useCompactRow={isPortalCertRoadmap}
                      className={!isPortalCertRoadmap ? toggleOptionClass(education === opt.value) : undefined}
                      aria-checked={education === opt.value}
                      tabIndex={getPmpChoiceTabIndex(
                        education === opt.value,
                        Boolean(education),
                        optionIndex,
                      )}
                      onClick={() => {
                        setEducation(opt.value);
                        touchField();
                      }}
                    >
                      {opt.label}
                    </RoadmapChoiceChip>
                  ))}
                </div>
              </fieldset>

              <fieldset
                className={cn(
                  'm-0 min-w-0 border-0 p-0',
                  isPortalThemed && 'flex flex-col gap-2.5',
                )}
              >
                {isPortalThemed ? (
                  <PortalChoiceSectionLabel
                    id={`${idPrefix}-experience-label`}
                    portalTheme={portalTheme}
                    labelClass={labelClass}
                  >
                    Non-overlapping experience leading projects (last 10 years)
                  </PortalChoiceSectionLabel>
                ) : (
                  <legend id={`${idPrefix}-experience-label`} className={cn(labelClass, 'mb-2.5')}>
                    Non-overlapping experience leading projects (last 10 years) <span className="text-brand-orange">*</span>
                  </legend>
                )}
                <div
                  id={`${idPrefix}-experience-options`}
                  className={choiceGroupClass}
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-experience-label`}
                  aria-required="true"
                >
                  {PM_EXPERIENCE_OPTIONS.map((opt, optionIndex) => (
                    <RoadmapChoiceChip
                      key={opt.value}
                      selected={pmExperience === opt.value}
                      portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                      useCompactRow={isPortalCertRoadmap}
                      className={!isPortalCertRoadmap ? toggleOptionClass(pmExperience === opt.value) : undefined}
                      aria-checked={pmExperience === opt.value}
                      tabIndex={getPmpChoiceTabIndex(
                        pmExperience === opt.value,
                        Boolean(pmExperience),
                        optionIndex,
                      )}
                      onClick={() => {
                        setPmExperience(opt.value);
                        touchField();
                      }}
                    >
                      {opt.label}
                    </RoadmapChoiceChip>
                  ))}
                </div>
              </fieldset>

              <fieldset
                className={cn(
                  'm-0 min-w-0 border-0 p-0',
                  isPortalThemed && 'flex flex-col gap-2.5',
                )}
              >
                {isPortalThemed ? (
                  <PortalChoiceSectionLabel
                    id={`${idPrefix}-training-label`}
                    portalTheme={portalTheme}
                    labelClass={labelClass}
                  >
                    35 hours of PM education/training or CAPM
                  </PortalChoiceSectionLabel>
                ) : (
                  <legend id={`${idPrefix}-training-label`} className={cn(labelClass, 'mb-2.5')}>
                    35 hours of PM education/training or CAPM <span className="text-brand-orange">*</span>
                  </legend>
                )}
                <div
                  id={`${idPrefix}-training-options`}
                  className={choiceGroupClass}
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-training-label`}
                  aria-required="true"
                >
                  {TRAINING_STATUS_OPTIONS.map((opt, optionIndex) => (
                    <RoadmapChoiceChip
                      key={opt.value}
                      selected={trainingStatus === opt.value}
                      portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                      useCompactRow={isPortalCertRoadmap}
                      className={!isPortalCertRoadmap ? toggleOptionClass(trainingStatus === opt.value) : undefined}
                      aria-checked={trainingStatus === opt.value}
                      tabIndex={getPmpChoiceTabIndex(
                        trainingStatus === opt.value,
                        Boolean(trainingStatus),
                        optionIndex,
                      )}
                      onClick={() => {
                        setTrainingStatus(opt.value);
                        touchField();
                      }}
                    >
                      {opt.label}
                    </RoadmapChoiceChip>
                  ))}
                </div>
              </fieldset>

              <fieldset
                className={cn(
                  'm-0 min-w-0 border-0 p-0',
                  isPortalThemed && 'flex flex-col gap-2.5',
                )}
              >
                {isPortalThemed ? (
                  <PortalChoiceSectionLabel
                    id={`${idPrefix}-timeline-label`}
                    portalTheme={portalTheme}
                    labelClass={labelClass}
                  >
                    Exam timeline
                  </PortalChoiceSectionLabel>
                ) : (
                  <legend id={`${idPrefix}-timeline-label`} className={cn(labelClass, 'mb-2.5')}>
                    Exam timeline <span className="text-brand-orange">*</span>
                  </legend>
                )}
                <div
                  id={`${idPrefix}-timeline-options`}
                  className={choiceGroupClass}
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-timeline-label`}
                  aria-required="true"
                >
                  {EXAM_TIMELINE_OPTIONS.map((opt, optionIndex) => (
                    <RoadmapChoiceChip
                      key={opt.value}
                      selected={examTimeline === opt.value}
                      portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                      useCompactRow={isPortalCertRoadmap}
                      className={!isPortalCertRoadmap ? toggleOptionClass(examTimeline === opt.value) : undefined}
                      aria-checked={examTimeline === opt.value}
                      tabIndex={getPmpChoiceTabIndex(
                        examTimeline === opt.value,
                        Boolean(examTimeline),
                        optionIndex,
                      )}
                      onClick={() => {
                        setExamTimeline(opt.value);
                        touchField();
                      }}
                    >
                      {opt.label}
                    </RoadmapChoiceChip>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* Step 3: Contact */}
          {currentStep === 'contact' && (
            <div data-step="contact" className="space-y-5 sm:space-y-6">
              <div className={fieldGroupClass}>
                <Label
                  htmlFor={`${idPrefix}-name`}
                  className={labelClass}
                  style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
                >
                  Full Name
                </Label>
                <Input
                  id={`${idPrefix}-name`}
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    touchField();
                  }}
                  placeholder={homeFormCopy?.fullNamePlaceholder ?? 'John Smith'}
                  className={cn(fieldClass, isPortalThemed && 'text-body-sm shadow-none focus-visible:ring-1')}
                  style={isPortalThemed && portalTheme ? portalFieldStyle(portalTheme) : undefined}
                />
              </div>

              <div className={fieldGroupClass}>
                <Label
                  htmlFor={`${idPrefix}-phone`}
                  className={labelClass}
                  style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
                >
                  Mobile Number
                </Label>
                <div
                  className={cn(
                    'flex items-stretch overflow-hidden rounded-lg border bg-transparent',
                    !isPortalThemed &&
                      'border-input focus-within:border-brand-orange/50 focus-within:ring-3 focus-within:ring-brand-orange/30 dark:bg-input/30',
                    isCertHeroDesktop || isCertMobileForm
                      ? certHeroControlHeight
                      : isCompact
                        ? 'h-9'
                        : 'h-10',
                  )}
                  style={isPortalThemed && portalTheme ? portalFieldStyle(portalTheme) : undefined}
                >
                  <Select value={dialValue} onValueChange={(v) => v && setDialValue(v)}>
                    <SelectTrigger
                      id={`${idPrefix}-dial`}
                      aria-label="Country code"
                      className={cn(
                        '!h-full min-h-0 w-[6.75rem] shrink-0 self-stretch rounded-none border-0 border-r bg-transparent px-2 py-0 shadow-none focus-visible:ring-0 data-[size=default]:!h-full items-center *:data-[slot=select-value]:justify-center *:data-[slot=select-value]:text-center',
                        !isPortalThemed && 'border-input dark:bg-transparent',
                        isPortalThemed && '[&_svg]:text-[var(--portal-text-muted)]',
                      )}
                      style={
                        isPortalThemed && portalTheme
                          ? { borderColor: portalTheme.cardBorder, color: portalTheme.text }
                          : undefined
                      }
                    >
                      <SelectValue>{formatDialPrefix(dialOption)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      alignItemWithTrigger={false}
                      side="bottom"
                      align="start"
                      className={cn(
                        '!w-auto min-w-[18rem] max-h-[min(16rem,50vh)] max-w-[min(22rem,calc(100vw-2rem))] overflow-y-auto',
                        isPortalThemed && PORTAL_SELECT_CONTENT_CLASS,
                      )}
                      style={
                        isPortalThemed && portalTheme ? portalSelectContentStyle(portalTheme) : undefined
                      }
                    >
                      {PMP_ROADMAP_DIAL_CODES.map((d) => (
                        <SelectItem key={d.value} value={d.value} className="py-2">
                          <span className="shrink-0 font-semibold tabular-nums">{formatDialPrefix(d)}</span>
                          <span
                            className={cn('truncate', !isPortalThemed && 'text-slate-500')}
                            style={
                              isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined
                            }
                          >
                            {d.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id={`${idPrefix}-phone`}
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      touchField();
                    }}
                    placeholder={homeFormCopy?.mobilePlaceholder ?? '50 123 4567'}
                    className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent text-body-sm shadow-none focus-visible:ring-0"
                    style={isPortalThemed && portalTheme ? { color: portalTheme.text } : undefined}
                  />
                </div>
              </div>

              <div className={fieldGroupClass}>
                <Label
                  htmlFor={`${idPrefix}-email`}
                  className={labelClass}
                  style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
                >
                  Email Address
                </Label>
                <Input
                  id={`${idPrefix}-email`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    touchField();
                  }}
                  placeholder={homeFormCopy?.emailPlaceholder ?? 'john@example.com'}
                  className={cn(fieldClass, isPortalThemed && 'text-body-sm shadow-none focus-visible:ring-1')}
                  style={isPortalThemed && portalTheme ? portalFieldStyle(portalTheme) : undefined}
                />
              </div>

            </div>
          )}

          <div hidden aria-hidden>
            <label htmlFor={`${idPrefix}-hp`} className="sr-only">
              Leave blank
            </label>
            <input
              id={`${idPrefix}-hp`}
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {error ? (
            <p
              id={`${idPrefix}-form-error`}
              className={cn('text-sm font-medium', !isPortalThemed && 'text-red-600 dark:text-red-400')}
              style={isPortalThemed && portalTheme ? { color: portalTheme.primary } : undefined}
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          ) : null}

          {currentStep === 'contact' && (
            <FormPrivacyNotice
              compact={isCompact}
              privacyPrefix={homeFormCopy?.privacyPrefix}
              privacyLinkLabel={homeFormCopy?.privacyLinkLabel}
              portalTheme={isPortalThemed ? portalTheme : undefined}
            />
          )}
        </div>

        <div
          className={cn(
            'shrink-0 border-t',
            !isPortalThemed && 'border-slate-100 dark:border-slate-800',
            isPortalThemed
              ? `${portalSpacing.portalFormInset} py-4 sm:py-5`
              : isCertHeroDesktop
                ? 'mt-auto px-5 py-4 sm:px-6 sm:py-5'
                : isCertMobileForm
                  ? 'px-5 py-5 sm:px-6'
                  : isCompact
                    ? 'px-5 py-3 sm:px-6'
                    : 'px-5 py-5 sm:px-6',
          )}
          style={isPortalThemed && portalTheme ? { borderColor: portalTheme.cardBorder } : undefined}
        >
          <div className="flex gap-3">
            {currentStep !== 'fit' && (
              <Button
                type="button"
                onClick={handleStepBack}
                disabled={submitting}
                variant="outline"
                className={cn(
                  'rounded-full font-bold',
                  isPortalThemed && 'border-2',
                  isCertHeroDesktop
                    ? cn(certHeroControlHeight, 'text-sm px-5')
                    : isCertMobileForm
                      ? 'h-12 text-base px-6'
                      : isCompact
                        ? 'h-10 text-sm px-5'
                        : 'h-12 text-base px-6',
                )}
                style={
                  isPortalThemed && portalTheme
                    ? {
                        borderColor: portalTheme.cardBorder,
                        color: portalTheme.text,
                        backgroundColor: portalTheme.surface,
                      }
                    : undefined
                }
              >
                Back
              </Button>
            )}

            {currentStep === 'contact' ? (
              isPortalThemed && portalTheme ? (
                <PortalButton
                  type="submit"
                  theme={portalTheme}
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? 'Submitting…' : homeFormCopy?.submitLabel ?? 'Submit'}
                </PortalButton>
              ) : (
                <Button
                  type="submit"
                  disabled={submitting}
                  className={cn(
                    'flex-1 rounded-full bg-brand-orange font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-hover',
                    isCertHeroDesktop
                      ? cn(certHeroControlHeight, 'text-sm')
                      : isCertMobileForm
                        ? 'h-12 text-base'
                        : isCompact
                          ? 'h-10 text-sm'
                          : 'h-12 text-base',
                  )}
                >
                  {submitting ? 'Submitting…' : homeFormCopy?.submitLabel ?? 'Submit'}
                </Button>
              )
            ) : (
              <Button
                type="button"
                onClick={() => handleStepNext(nextPmpQualificationStep(currentStep))}
                disabled={submitting}
                className={cn(
                  'flex-1 rounded-full bg-brand-orange font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-hover',
                  isCertHeroDesktop
                    ? cn(certHeroControlHeight, 'text-sm')
                    : isCertMobileForm
                      ? 'h-12 text-base'
                      : isCompact
                        ? 'h-10 text-sm'
                        : 'h-12 text-base',
                )}
                style={
                  isPortalThemed && portalTheme
                    ? {
                        backgroundColor: portalCtaBackground(portalTheme),
                        color: portalTheme.recommendedText ?? pickReadableForeground(portalCtaBackground(portalTheme)),
                      }
                    : undefined
                }
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
