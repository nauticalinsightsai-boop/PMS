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
  HOME_CERT_INTEREST_OPTIONS,
  type HomeCertInterestValue,
  PMP_DAILY_STUDY_OPTIONS,
  PMP_JOB_EXPERIENCE_OPTIONS,
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { mapRegionIdToAnalyticsRegion } from '@/lib/analytics/pms-events';
import { trackRoadmapFormStart, trackRoadmapLeadSubmit } from '@/lib/analytics/track-roadmap-lead';
import { CertFamilyMark } from '@/components/CertFamilyMark';
import BrandIconMark from '@/components/BrandIconMark';
import { useLeadRecoveryOptional } from '@/components/conversion-recovery/LeadRecoveryProvider';
import { useFormPartialRecovery } from '@/components/conversion-recovery/useFormPartialRecovery';
import { resolveHomeHeroForm, type HomeHeroForm } from '@pms/site-content';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing';
import { resolvePortalQuoteSurface } from '@/lib/channel-landing-pages/portalQuoteSurface';
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

const portalChoiceRowClass = 'grid grid-cols-4 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3';
const portalCertChoiceRowClass =
  'grid grid-cols-3 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3';
const portalExperienceChoiceRowClass =
  'grid grid-cols-3 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3';
const portalChoiceChipClass =
  'flex h-10 min-w-0 w-full cursor-pointer items-center justify-center rounded-lg border-none border-0 text-body-sm font-bold leading-none shadow-none transition-colors max-sm:px-2 max-sm:text-xs max-sm:whitespace-nowrap sm:flex-1 sm:px-3';

/** Portal mobile: merge under-3 and 3-5 into one chip to fit one row. */
const PORTAL_MOBILE_EXPERIENCE_OPTIONS = [
  { value: 'under-5', label: '<3-5 yrs' },
  { value: '5-10', label: '5-10 yrs' },
  { value: '10-plus', label: '10+ yrs' },
] as const;

const PORTAL_EXPERIENCE_MOBILE_LABELS: Record<string, string> = {
  '5-10': '5-10 yrs',
  '10-plus': '10+ yrs',
};

function isPortalMergedExperience(value: string) {
  return value === 'under-3' || value === '3-5' || value === 'under-5';
}

function portalExperienceChipSelected(chipValue: string, jobExperience: string) {
  if (chipValue === 'under-5') return isPortalMergedExperience(jobExperience);
  return jobExperience === chipValue;
}

/** Tailwind `sm` — portal experience chips switch layout at this breakpoint. */
function useIsSmUp() {
  const [isSmUp, setIsSmUp] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)');
    const sync = () => setIsSmUp(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isSmUp;
}

function ExperienceChipLabel({
  value,
  label,
  portalCompact,
}: {
  value: string;
  label: string;
  portalCompact: boolean;
}) {
  if (!portalCompact) return label;
  const short = PORTAL_EXPERIENCE_MOBILE_LABELS[value] ?? label;
  return (
    <>
      <span className="sm:hidden">{short}</span>
      <span className="hidden sm:inline">{label}</span>
    </>
  );
}

function PortalChoiceSectionLabel({
  id,
  mobileLabel,
  desktopLabel,
  portalTheme,
  labelClass,
}: {
  id: string;
  mobileLabel: string;
  desktopLabel: string;
  portalTheme?: PlatformPortalTheme;
  labelClass: string;
}) {
  return (
    <span
      id={id}
      className={cn(
        labelClass,
        'mb-0 block w-full pb-0 leading-none max-sm:text-[10px] max-sm:whitespace-nowrap',
      )}
      style={portalTheme ? { color: portalTheme.textMuted } : undefined}
    >
      <span className="sm:hidden">{mobileLabel}</span>
      <span className="hidden sm:inline">{desktopLabel}</span>{' '}
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
  ...aria
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  portalTheme?: PlatformPortalTheme;
  className?: string;
  useCompactRow?: boolean;
  'aria-pressed': boolean;
  'aria-expanded'?: boolean;
}) {
  const compact = useCompactRow || Boolean(portalTheme);
  return (
    <button
      type="button"
      className={compact ? cn(portalChoiceChipClass, className) : className}
      style={portalTheme ? portalChipStyle(portalTheme, selected) : undefined}
      onClick={onClick}
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
  const isSmUp = useIsSmUp();
  const portalQuoteSurface = portalTheme ? resolvePortalQuoteSurface(portalTheme) : null;
  const usesHomeRoadmapUi = isHomeForm || isPortalCertRoadmap;
  const showsCertInterest = usesHomeRoadmapUi;
  const homeFormCopy =
    isHomeForm && (placement === 'home_hero_mobile' || placement === 'home_hero_desktop') && heroCopy
      ? resolveHomeHeroForm(heroCopy)
      : null;
  const certInterestOptions = homeFormCopy?.certOptions ?? HOME_CERT_INTEREST_OPTIONS;
  const portalExperienceOptions =
    isPortalCertRoadmap && !isSmUp ? PORTAL_MOBILE_EXPERIENCE_OPTIONS : PMP_JOB_EXPERIENCE_OPTIONS;
  const roadmapLabel = showsCertInterest ? 'PM certification' : (certName ?? 'PMP®');
  const formTitle = homeFormCopy?.title
    ?? (showsCertInterest
      ? 'Build your PM roadmap'
      : `Build your ${roadmapLabel} roadmap`);
  const formSubtitle = homeFormCopy?.subtitle
    ?? (showsCertInterest
      ? "Share your experience: we'll map a study plan for you."
      : `Share your experience: we'll map a ${certName ? certName : 'PMP'} study plan for you.`);
  const portalCertInterestLabelDesktop =
    homeFormCopy?.certInterestLabel ?? 'Which certification are you interested in?';
  const portalCertInterestLabelMobile = 'Certification interest';
  const portalExperienceLabelDesktop =
    homeFormCopy?.experienceLabel ?? 'Years of Total Job Experience';
  const portalExperienceLabelMobile = 'Years of experience';

  const [fullName, setFullName] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [jobExperience, setJobExperience] = React.useState('');
  const [dailyStudyTime, setDailyStudyTime] = React.useState('');
  const [certInterest, setCertInterest] = React.useState<HomeCertInterestValue | ''>('');
  const [certInterestOther, setCertInterestOther] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const formStartedRef = React.useRef(false);

  React.useEffect(() => {
    if (isPortalCertRoadmap && isSmUp && jobExperience === 'under-5') {
      setJobExperience('');
    }
  }, [isPortalCertRoadmap, isSmUp, jobExperience]);

  const recovery = useLeadRecoveryOptional();
  const partialVariant: LeadRecoveryVariant =
    placement === 'home_insights'
      ? 'home_insights_partial'
      : placement.startsWith('cert') && certId
        ? 'cert_roadmap_partial'
        : 'home_roadmap_partial';

  const hasPartialData = Boolean(fullName.trim() || phone.trim() || email.trim());

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
      trackRoadmapFormStart({
        formPlacement: placement,
        regionGroup: mapRegionIdToAnalyticsRegion(regionId),
        certification: showsCertInterest
          ? resolvedCertInterest || 'unknown'
          : certId === 'pmp' || certName?.includes('PMP')
            ? 'PMP'
            : certName,
        buyerType: 'unknown',
        examRoute: 'unknown',
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
  const choiceGridClass = cn(
    'grid grid-cols-2',
    isCertHeroDesktop || isCertMobileForm ? 'gap-2.5' : cn('gap-2', !isCompact && 'grid-cols-1 sm:grid-cols-2 sm:gap-2'),
  );
  const certChoiceButtonClass = (selected: boolean) =>
    cn(
      'flex w-full cursor-pointer items-center justify-center rounded-lg border font-bold transition-colors',
      isCertHeroDesktop
        ? cn(certHeroControlHeight, 'px-2.5 text-xs sm:px-3 sm:text-sm')
        : isCertMobileForm
          ? cn(certHeroControlHeight, 'px-3 text-sm')
          : cn('px-3 py-2.5 text-sm'),
      selected
        ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-orange/40 dark:bg-slate-900 dark:text-slate-300',
    );
  const choiceFieldsetClass = cn(
    isCertHeroDesktop
      ? 'space-y-2.5'
      : isCertMobileForm
        ? 'space-y-3.5'
        : isCompact
          ? 'space-y-2'
          : isExpandedForm
            ? 'space-y-3.5'
            : 'space-y-3',
  );
  const experienceFieldsetPad = 'px-0 pt-1 pb-1';
  const certMobileSectionPad = isCertMobileForm ? 'pt-[10px]' : '';
  const legendClass = cn(
    labelClass,
    isPortalThemed ? 'mb-0' : isExpandedForm ? 'mb-2.5' : isCertMobileForm ? 'mb-2' : 'mb-1.5',
  );
  const certHeroBodyGap = 'gap-5';
  const certHeroContactGap = 'gap-4';
  const certHeroChoicesGap = 'gap-4';
  const toggleOptionClass = (selected: boolean) =>
    cn(
      'flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-3 font-bold transition-colors',
      isCompact ? 'py-2 text-xs sm:text-sm' : 'py-2.5 text-sm',
      selected
        ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-orange/40 dark:bg-slate-900 dark:text-slate-300',
    );

  const resolvedCertInterest =
    certInterest === 'other'
      ? certInterestOther.trim()
      : certInterestOptions.find((o) => o.value === certInterest)?.label ?? '';

  const toggleCertInterest = (value: HomeCertInterestValue) => {
    if (certInterest === value) {
      setCertInterest('');
      setCertInterestOther('');
      setJobExperience('');
      return;
    }
    setCertInterest(value);
    if (value !== 'other') {
      setCertInterestOther('');
    } else {
      requestAnimationFrame(() => {
        document.getElementById(`${idPrefix}-cert-other`)?.focus();
      });
    }
  };

  const toggleJobExperience = (value: string) => {
    const selected =
      isPortalCertRoadmap && value === 'under-5'
        ? isPortalMergedExperience(jobExperience)
        : jobExperience === value;
    if (selected) {
      setJobExperience('');
      setDailyStudyTime('');
      touchField();
      return;
    }
    setJobExperience(value);
    touchField();
  };

  const toggleDailyStudyTime = (value: string) => {
    if (dailyStudyTime === value) {
      setDailyStudyTime('');
    } else {
      setDailyStudyTime(value);
    }
    touchField();
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showsCertInterest) {
      if (!certInterest) {
        setError('Please select a certification or enter Other.');
        return;
      }
      if (certInterest === 'other' && !certInterestOther.trim()) {
        setError('Please specify your certification interest under Other.');
        return;
      }
    }
    if (!jobExperience) {
      setError('Please select your years of job experience.');
      return;
    }
    setError(null);
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();
    const res = await submitPublicInteraction({
      source: showsCertInterest && !certId ? 'pmp_roadmap_lead' : certId ? 'cert_roadmap_lead' : 'pmp_roadmap_lead',
      subject: `${roadmapLabel} roadmap: ${placementLabel(placement, certName)}`,
      email,
      website: honeypot,
      formContext: {
        formId: showsCertInterest && !certId ? 'pmp_roadmap_lead' : certId ? 'cert_roadmap_lead' : 'pmp_roadmap_lead',
        formLabel: showsCertInterest ? 'PM certification roadmap' : `${certName ?? 'PMP'} roadmap`,
        placement: placementLabel(placement, certName),
        pagePath,
        siteCertId: certId,
        certName: showsCertInterest ? undefined : (certName ?? 'PMP'),
        certificationInterest: showsCertInterest ? resolvedCertInterest : undefined,
        regionId,
        channelId: portalChannelId,
        landingSlug: portalLandingSlug,
      },
      payload: {
        fullName,
        phoneCountryCode: dialCode,
        phoneCountryPrefix: dialOption.prefix,
        phone,
        phoneFull,
        whatsapp: phoneFull,
        role: usesHomeRoadmapUi ? undefined : role || undefined,
        jobExperienceYears: jobExperience,
        dailyStudyTime: usesHomeRoadmapUi ? undefined : dailyStudyTime || undefined,
        certificationInterest: showsCertInterest ? resolvedCertInterest : undefined,
        certificationInterestType: showsCertInterest ? certInterest : undefined,
        certificationInterestOther:
          showsCertInterest && certInterest === 'other' ? certInterestOther.trim() : undefined,
        placement,
        siteCertId: certId,
        certName: certName ?? (showsCertInterest ? undefined : 'PMP'),
        gccCountry: gccCountry ?? undefined,
        channelId: portalChannelId,
        landingSlug: portalLandingSlug,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      trackRoadmapLeadSubmit({
        formPlacement: placement,
        regionGroup: mapRegionIdToAnalyticsRegion(regionId),
        certification: showsCertInterest
          ? resolvedCertInterest || 'unknown'
          : certId === 'pmp' || certName?.includes('PMP')
            ? 'PMP'
            : certName,
        buyerType: role?.toLowerCase().includes('corporate') ? 'corporate' : 'individual',
        examRoute: 'unknown',
      });
      recovery?.notifyConverted();
      setSubmitted(true);
    } else {
      setError(res.error ?? 'Submission failed. Try again.');
    }
  };

  if (submitted) {
    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p
          className={cn('text-base font-semibold', !isPortalThemed && 'text-green-700 dark:text-green-400')}
          style={isPortalThemed && portalTheme ? { color: portalTheme.primary } : undefined}
        >
          {homeFormCopy?.successMessage ??
            `Thanks: we received your details and will follow up with your ${roadmapLabel} roadmap.`}
        </p>
        <p
          className={cn('mt-3 text-sm', !isPortalThemed && 'text-slate-500 dark:text-slate-400')}
          style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
        >
          Questions?{' '}
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

  return (
    <div className={cn(shellClass, isCertHeroDesktop && 'flex min-h-[756px] flex-col')} data-portal-form={isPortalThemed || undefined}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex flex-col',
          isCertHeroDesktop && 'min-h-0 flex-1',
          isExpandedForm && !isPortalThemed && 'max-lg:max-h-none lg:max-h-[min(90vh,52rem)]',
        )}
        aria-labelledby={`${idPrefix}-title`}
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
              showsCertInterest || !familyId ? (
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
                  subtitle={
                    isPortalCertRoadmap ? (
                      <>
                        <span className="sm:hidden">we&apos;ll map a study plan for you.</span>
                        <span className="hidden sm:inline">{formSubtitle}</span>
                      </>
                    ) : (
                      formSubtitle
                    )
                  }
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
            </div>
          </div>
        </div>
        ) : null}

        <div
          className={cn(
            isCertHeroDesktop
              ? cn(
                  'flex min-h-0 flex-1 flex-col px-5 py-6 sm:px-6 sm:py-7',
                  certHeroBodyGap,
                )
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
          <div
            className={cn(
              isCertHeroDesktop && cn('flex w-full shrink-0 flex-col', certHeroContactGap),
              isExpandedForm && usesHomeRoadmapUi && 'flex flex-col gap-5 sm:gap-6',
              !isCertHeroDesktop && !(isExpandedForm && usesHomeRoadmapUi) && 'contents',
            )}
          >
          <div className={fieldGroupClass}>
            <Label
              htmlFor={`${idPrefix}-name`}
              className={labelClass}
              style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
            >
              {homeFormCopy?.fullNameLabel ?? 'Full Name'}
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

          <div className={cn(fieldGroupClass, certMobileSectionPad)}>
            <Label
              htmlFor={`${idPrefix}-phone`}
              className={labelClass}
              style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
            >
              {homeFormCopy?.mobileLabel ?? 'Mobile Number'}
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
                  className="!w-auto min-w-[18rem] max-h-[min(16rem,50vh)] max-w-[min(22rem,calc(100vw-2rem))] overflow-y-auto"
                >
                  {PMP_ROADMAP_DIAL_CODES.map((d) => (
                    <SelectItem key={d.value} value={d.value} className="py-2">
                      <span className="shrink-0 font-semibold tabular-nums">{formatDialPrefix(d)}</span>
                      <span className={cn('truncate', !isPortalThemed && 'text-slate-500')}>{d.label}</span>
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

          <div className={cn(fieldGroupClass, certMobileSectionPad)}>
            <Label
              htmlFor={`${idPrefix}-email`}
              className={labelClass}
              style={isPortalThemed && portalTheme ? { color: portalTheme.textMuted } : undefined}
            >
              {homeFormCopy?.emailLabel ?? 'Email Address'}
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

          {!usesHomeRoadmapUi ? (
            <div className={cn(fieldGroupClass, certMobileSectionPad)}>
              <Label htmlFor={`${idPrefix}-role`} className={labelClass}>
                Role / Job Title
              </Label>
              <Input
                id={`${idPrefix}-role`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Project Manager"
                className={fieldClass}
              />
            </div>
          ) : null}
          </div>

          {usesHomeRoadmapUi ? (
            <div className={cn(isPortalThemed ? 'flex flex-col gap-5 sm:gap-6' : 'space-y-0')}>
              {isPortalThemed ? (
                <PortalChoiceSectionLabel
                  id={`${idPrefix}-cert-interest-label`}
                  mobileLabel={portalCertInterestLabelMobile}
                  desktopLabel={portalCertInterestLabelDesktop}
                  portalTheme={portalTheme}
                  labelClass={labelClass}
                />
              ) : null}
              <fieldset
                className={cn(
                  'm-0 min-w-0 border-0 p-0',
                  isPortalThemed && 'flex flex-col gap-2.5',
                )}
                aria-labelledby={isPortalThemed ? `${idPrefix}-cert-interest-label` : undefined}
              >
                {!isPortalThemed ? (
                  <legend className={legendClass}>
                    {portalCertInterestLabelDesktop}{' '}
                    <span className="text-brand-orange">*</span>
                  </legend>
                ) : null}
                <div
                  className={cn(
                    isPortalCertRoadmap ? portalCertChoiceRowClass : 'flex flex-wrap gap-2.5 sm:gap-3',
                  )}
                  role="group"
                  aria-label="Certification interest"
                >
                  {certInterestOptions.map((o) => (
                    <RoadmapChoiceChip
                      key={o.value}
                      selected={certInterest === o.value}
                      portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                      useCompactRow={isPortalCertRoadmap}
                      className={
                        isPortalCertRoadmap && o.value === 'six-sigma' ? 'hidden sm:flex' : undefined
                      }
                      aria-pressed={certInterest === o.value}
                      onClick={() => toggleCertInterest(o.value as HomeCertInterestValue)}
                    >
                      {o.label}
                    </RoadmapChoiceChip>
                  ))}
                  <RoadmapChoiceChip
                    selected={certInterest === 'other'}
                    portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                    useCompactRow={isPortalCertRoadmap}
                    aria-pressed={certInterest === 'other'}
                    aria-expanded={certInterest === 'other'}
                    onClick={() => toggleCertInterest('other')}
                  >
                    {homeFormCopy?.otherCertLabel ?? 'Other'}
                  </RoadmapChoiceChip>
                </div>
                {certInterest === 'other' ? (
                  <div className="mt-3">
                    <Label htmlFor={`${idPrefix}-cert-other`} className="sr-only">
                      Specify other certification
                    </Label>
                    <Input
                      id={`${idPrefix}-cert-other`}
                      value={certInterestOther}
                      onChange={(e) => setCertInterestOther(e.target.value)}
                      placeholder={homeFormCopy?.otherCertPlaceholder ?? 'Specify another certification'}
                      className={cn(fieldClass, isPortalThemed && 'text-body-sm shadow-none focus-visible:ring-1')}
                      style={isPortalThemed && portalTheme ? portalFieldStyle(portalTheme) : undefined}
                      required
                    />
                  </div>
                ) : null}
              </fieldset>

              {certInterest ? (
                <>
                  {isPortalThemed ? (
                    <PortalChoiceSectionLabel
                      id={`${idPrefix}-experience-label`}
                      mobileLabel={portalExperienceLabelMobile}
                      desktopLabel={portalExperienceLabelDesktop}
                      portalTheme={portalTheme}
                      labelClass={labelClass}
                    />
                  ) : null}
                  <fieldset
                    className={cn(
                      'm-0 mb-0 min-w-0 space-y-0 border-0 p-0 pb-0',
                      !isPortalThemed && 'mt-6 sm:mt-8',
                      !isPortalThemed && experienceFieldsetPad,
                      isPortalThemed && 'flex flex-col gap-2.5',
                    )}
                    aria-labelledby={isPortalThemed ? `${idPrefix}-experience-label` : undefined}
                  >
                    {!isPortalThemed ? (
                      <legend className={cn(labelClass, 'mb-2.5')}>
                        {portalExperienceLabelDesktop}{' '}
                        <span className="text-brand-orange">*</span>
                      </legend>
                    ) : null}
                    <div
                    className={cn(
                      isPortalCertRoadmap
                        ? isSmUp
                          ? portalChoiceRowClass
                          : portalExperienceChoiceRowClass
                        : 'flex flex-wrap gap-2.5 sm:gap-3',
                    )}
                    role="group"
                    aria-label="Years of total job experience"
                  >
                    {portalExperienceOptions.map((o) => {
                      const selected = isPortalCertRoadmap
                        ? portalExperienceChipSelected(o.value, jobExperience)
                        : jobExperience === o.value;
                      return (
                        <RoadmapChoiceChip
                          key={o.value}
                          selected={selected}
                          portalTheme={isPortalCertRoadmap ? portalTheme : undefined}
                          useCompactRow={isPortalCertRoadmap}
                          aria-pressed={selected}
                          onClick={() => toggleJobExperience(o.value)}
                        >
                          {isPortalCertRoadmap ? (
                            isSmUp ? (
                              <ExperienceChipLabel
                                value={o.value}
                                label={o.label}
                                portalCompact
                              />
                            ) : (
                              o.label
                            )
                          ) : (
                            o.label
                          )}
                        </RoadmapChoiceChip>
                      );
                    })}
                  </div>
                </fieldset>
                </>
              ) : null}
            </div>
          ) : (
            <div
              className={cn(
                isCertHeroDesktop && cn('flex w-full flex-col', certHeroChoicesGap),
                !isCertHeroDesktop && 'contents',
              )}
            >
              <fieldset className={cn(choiceFieldsetClass, experienceFieldsetPad, certMobileSectionPad, isCertHeroDesktop && 'w-full')}>
                <legend className={legendClass}>
                  Years of Total Job Experience <span className="text-brand-orange">*</span>
                </legend>
                <div className={choiceGridClass} role="group" aria-label="Years of total job experience">
                  {PMP_JOB_EXPERIENCE_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={certChoiceButtonClass(jobExperience === o.value)}
                      aria-pressed={jobExperience === o.value}
                      onClick={() => toggleJobExperience(o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className={cn(choiceFieldsetClass, certMobileSectionPad, isCertHeroDesktop && 'w-full')}>
                <legend className={legendClass}>
                  What is your daily study time?
                </legend>
                <div className={choiceGridClass} role="group" aria-label="Daily study time">
                  {PMP_DAILY_STUDY_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={certChoiceButtonClass(dailyStudyTime === o.value)}
                      aria-pressed={dailyStudyTime === o.value}
                      onClick={() => toggleDailyStudyTime(o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
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
              className={cn('text-sm font-medium', !isPortalThemed && 'text-red-600 dark:text-red-400')}
              style={isPortalThemed && portalTheme ? { color: portalTheme.primary } : undefined}
            >
              {error}
            </p>
          ) : null}

          <FormPrivacyNotice
            compact={isCompact}
            privacyPrefix={homeFormCopy?.privacyPrefix}
            privacyLinkLabel={homeFormCopy?.privacyLinkLabel}
            portalTheme={isPortalThemed ? portalTheme : undefined}
          />
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
          {isPortalThemed && portalTheme ? (
            <PortalButton
              type="submit"
              theme={portalTheme}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting…' : homeFormCopy?.submitLabel ?? 'Get My PM Roadmap'}
            </PortalButton>
          ) : (
          <Button
            type="submit"
            disabled={submitting}
            className={cn(
              'w-full rounded-full bg-brand-orange font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-hover',
              isCertHeroDesktop
                ? cn(certHeroControlHeight, 'text-sm')
                : isCertMobileForm
                  ? 'h-12 text-base'
                  : isCompact
                    ? 'h-10 text-sm'
                    : 'h-12 text-base',
            )}
          >
            {submitting ? 'Submitting…' : homeFormCopy?.submitLabel ?? (usesHomeRoadmapUi ? 'Get My PM Roadmap' : 'Submit')}
          </Button>
          )}
        </div>
      </form>
    </div>
  );
}