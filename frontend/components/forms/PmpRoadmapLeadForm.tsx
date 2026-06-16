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
import { CONVERSION_EVENTS, trackConversionEvent } from '@/lib/analytics/conversion-events';
import { CertFamilyMark } from '@/components/CertFamilyMark';
import BrandIconMark from '@/components/BrandIconMark';
import { useLeadRecoveryOptional } from '@/components/conversion-recovery/LeadRecoveryProvider';
import { useFormPartialRecovery } from '@/components/conversion-recovery/useFormPartialRecovery';
import type { LeadRecoveryVariant } from '@/lib/conversion-recovery/types';

export type PmpRoadmapFormPlacement =
  | 'home_hero_mobile'
  | 'home_hero_desktop'
  | 'home_insights'
  | 'cert_pmp_hero'
  | 'cert_pmp_mobile'
  | 'cert_hero'
  | 'cert_mobile';

type PmpRoadmapLeadFormProps = {
  placement: PmpRoadmapFormPlacement;
  variant?: 'hero' | 'insights' | 'cert';
  className?: string;
  /** Certification detail pages: drives headline and submission metadata */
  certId?: string;
  certName?: string;
  familyId?: string;
};

const PLACEMENT_LABELS: Record<PmpRoadmapFormPlacement, string> = {
  home_hero_mobile: 'Home hero (mobile)',
  home_hero_desktop: 'Home hero (desktop)',
  home_insights: 'Home insights band',
  cert_pmp_hero: 'PMP certification hero',
  cert_pmp_mobile: 'PMP certification hero (mobile)',
  cert_hero: 'Certification hero',
  cert_mobile: 'Certification hero (mobile)',
};

function placementLabel(placement: PmpRoadmapFormPlacement, certName?: string): string {
  const base = PLACEMENT_LABELS[placement];
  return certName ? `${certName}: ${base}` : base;
}

function PmsFormHeaderMark({ compact }: { compact: boolean }) {
  return <BrandIconMark size={compact ? 48 : 56} priority />;
}

export function PmpRoadmapLeadForm({
  placement,
  variant = 'hero',
  className,
  certId,
  certName,
  familyId,
}: PmpRoadmapLeadFormProps) {
  const { regionId, gccCountry } = useRegion();
  const idPrefix = [placement, certId].filter(Boolean).join('-').replace(/[^a-z0-9]/gi, '-');
  const isHomeForm =
    placement === 'home_hero_mobile' ||
    placement === 'home_hero_desktop' ||
    placement === 'home_insights';
  const roadmapLabel = isHomeForm ? 'PM certification' : (certName ?? 'PMP®');
  const formTitle = isHomeForm
    ? 'Build your PM certification roadmap'
    : `Build your ${roadmapLabel} roadmap`;
  const formSubtitle = isHomeForm
    ? "Share your experience: we'll map a study plan for you."
    : `Share your experience: we'll map a ${certName ? certName : 'PMP'} study plan for you.`;

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

  const recovery = useLeadRecoveryOptional();
  const partialVariant: LeadRecoveryVariant =
    placement === 'home_insights'
      ? 'home_insights_partial'
      : placement.startsWith('cert')
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
  };

  const shellClass = cn(
    'rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border shadow-2xl overflow-hidden',
    variant === 'insights'
      ? 'bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-700'
      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
    className,
  );

  const isCompact = variant === 'cert';
  const isCertHeroDesktop = placement === 'cert_hero';
  const isCertMobileForm = isCompact && !isCertHeroDesktop;
  const isExpandedForm = !isCompact && !isCertHeroDesktop;
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
  const radioGridClass = cn(
    'grid grid-cols-2',
    isCertHeroDesktop || isCertMobileForm ? 'gap-2.5' : cn('gap-2', !isCompact && 'grid-cols-1 sm:grid-cols-2 sm:gap-2'),
  );
  const radioOptionClass = (selected: boolean) =>
    cn(
      'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 font-medium transition-colors sm:gap-2.5 sm:px-3',
      isCertHeroDesktop
        ? cn(certHeroControlHeight, 'items-center py-0 text-xs sm:text-sm')
        : isCertMobileForm
          ? cn(certHeroControlHeight, 'items-center py-0 text-sm')
          : isCompact
            ? 'py-1.5 text-xs sm:py-2 sm:text-sm'
            : 'py-2.5 text-sm',
      selected
        ? 'border-brand-orange bg-brand-orange/5 text-slate-900 dark:text-white'
        : 'border-input text-slate-600 hover:border-brand-orange/40 dark:text-slate-400',
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
  const certMobileSectionPad = isCertMobileForm ? 'pt-[10px]' : '';
  const legendClass = cn(
    labelClass,
    isExpandedForm ? 'mb-2.5' : isCertMobileForm ? 'mb-2' : isCertHeroDesktop ? 'mb-1.5' : 'mb-1.5',
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
      : HOME_CERT_INTEREST_OPTIONS.find((o) => o.value === certInterest)?.label ?? '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isHomeForm) {
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
      source: certId ? 'cert_roadmap_lead' : 'pmp_roadmap_lead',
      subject: `${roadmapLabel} roadmap: ${placementLabel(placement, certName)}`,
      email,
      website: honeypot,
      formContext: {
        formId: certId ? 'cert_roadmap_lead' : 'pmp_roadmap_lead',
        formLabel: isHomeForm ? 'PM certification roadmap' : `${certName ?? 'PMP'} roadmap`,
        placement: placementLabel(placement, certName),
        pagePath,
        siteCertId: certId,
        certName: isHomeForm ? undefined : (certName ?? 'PMP'),
        certificationInterest: isHomeForm ? resolvedCertInterest : undefined,
        regionId,
      },
      payload: {
        fullName,
        phoneCountryCode: dialCode,
        phoneCountryPrefix: dialOption.prefix,
        phone,
        phoneFull,
        whatsapp: phoneFull,
        role: isHomeForm ? undefined : role || undefined,
        jobExperienceYears: jobExperience,
        dailyStudyTime: isHomeForm ? undefined : dailyStudyTime || undefined,
        certificationInterest: isHomeForm ? resolvedCertInterest : undefined,
        certificationInterestType: isHomeForm ? certInterest : undefined,
        certificationInterestOther:
          isHomeForm && certInterest === 'other' ? certInterestOther.trim() : undefined,
        placement,
        siteCertId: certId,
        certName: certName ?? (isHomeForm ? undefined : 'PMP'),
        gccCountry: gccCountry ?? undefined,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      trackConversionEvent(CONVERSION_EVENTS.CONSULTATION_BOOK, {
        source: placement,
        form: certId ? 'cert_roadmap' : 'pmp_roadmap',
        cert_id: certId,
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
        <p className="text-base font-semibold text-green-700 dark:text-green-400">
          Thanks: we received your details and will follow up with your {roadmapLabel} roadmap.
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Questions?{' '}
          <Link href="/contact" className="font-bold text-brand-orange hover:underline">
            Contact us
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className={cn(shellClass, isCertHeroDesktop && 'flex min-h-[756px] flex-col')}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          'flex flex-col',
          isCertHeroDesktop && 'min-h-0 flex-1',
          isExpandedForm && 'max-lg:max-h-none lg:max-h-[min(90vh,52rem)]',
        )}
        aria-labelledby={`${idPrefix}-title`}
      >
        <div
          className={cn(
            'shrink-0 border-b border-slate-100 bg-gradient-to-br from-brand-purple/5 via-white to-brand-orange/5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800',
            isCertHeroDesktop
              ? 'px-5 py-4 sm:px-6'
              : isCertMobileForm
                ? 'px-5 py-5 sm:px-6'
                : isCompact
                  ? 'px-5 py-4 sm:px-6'
                  : 'px-5 py-5 sm:px-6 sm:py-6',
          )}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            {isHomeForm || !familyId ? (
              <PmsFormHeaderMark compact={isCompact} />
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
            )}
            <div className="min-w-0 flex-1">
              <p
                id={`${idPrefix}-title`}
                className={cn(
                  'font-heading font-bold tracking-tight text-slate-900 dark:text-white',
                  isCompact ? 'text-base sm:text-lg' : 'text-lg sm:text-xl',
                )}
              >
                {formTitle}
              </p>
              <p
                className={cn(
                  'mt-0.5 font-medium text-slate-500 dark:text-slate-400',
                  isCompact ? 'text-xs sm:text-sm' : 'text-sm',
                )}
              >
                {formSubtitle}
              </p>
            </div>
          </div>
        </div>

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
                  : cn(
                    'px-5 py-6 sm:px-6 sm:py-7',
                    'space-y-5 sm:space-y-6',
                    'lg:min-h-0 lg:flex-1 lg:overflow-y-auto',
                  ),
          )}
        >
          <div
            className={cn(
              isCertHeroDesktop && cn('flex w-full shrink-0 flex-col', certHeroContactGap),
              isExpandedForm && isHomeForm && 'flex flex-col gap-5 sm:gap-6',
              !isCertHeroDesktop && !(isExpandedForm && isHomeForm) && 'contents',
            )}
          >
          <div className={fieldGroupClass}>
            <Label htmlFor={`${idPrefix}-name`} className={labelClass}>
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
              placeholder="John Smith"
              className={fieldClass}
            />
          </div>

          <div className={cn(fieldGroupClass, certMobileSectionPad)}>
            <Label htmlFor={`${idPrefix}-phone`} className={labelClass}>
              Mobile Number
            </Label>
            <div
              className={cn(
                'flex overflow-hidden rounded-lg border border-input bg-transparent focus-within:border-brand-orange/50 focus-within:ring-3 focus-within:ring-brand-orange/30 dark:bg-input/30',
                isCertHeroDesktop || isCertMobileForm
                  ? certHeroControlHeight
                  : isCompact
                    ? 'h-9'
                    : 'h-10',
              )}
            >
              <Select value={dialValue} onValueChange={(v) => v && setDialValue(v)}>
                <SelectTrigger
                  id={`${idPrefix}-dial`}
                  aria-label="Country code"
                  className="h-full w-[6.75rem] shrink-0 rounded-none border-0 border-r border-input bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
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
                      <span className="truncate text-slate-500">{d.label}</span>
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
                placeholder="50 123 4567"
                className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className={cn(fieldGroupClass, certMobileSectionPad)}>
            <Label htmlFor={`${idPrefix}-email`} className={labelClass}>
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
              placeholder="john@example.com"
              className={fieldClass}
            />
          </div>

          {!isHomeForm ? (
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

          {isHomeForm ? (
            <fieldset className={cn(isCompact ? 'space-y-2' : isExpandedForm ? 'space-y-3.5' : 'space-y-3')}>
              <legend className={legendClass}>
                Which certification are you interested in?{' '}
                <span className="text-brand-orange">*</span>
              </legend>
              <div className="flex flex-wrap gap-2.5 sm:gap-3" role="group" aria-label="Certification interest">
                {HOME_CERT_INTEREST_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    className={toggleOptionClass(certInterest === o.value)}
                    aria-pressed={certInterest === o.value}
                    onClick={() => {
                      setCertInterest(o.value);
                      setCertInterestOther('');
                    }}
                  >
                    {o.label}
                  </button>
                ))}
                <button
                  type="button"
                  className={toggleOptionClass(certInterest === 'other')}
                  aria-pressed={certInterest === 'other'}
                  aria-expanded={certInterest === 'other'}
                  onClick={() => {
                    setCertInterest('other');
                    requestAnimationFrame(() => {
                      document.getElementById(`${idPrefix}-cert-other`)?.focus();
                    });
                  }}
                >
                  Other
                </button>
              </div>
              <div
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  certInterest === 'other'
                    ? 'mt-3 grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0',
                )}
              >
                <div className="min-h-0 overflow-hidden">
                  <Label htmlFor={`${idPrefix}-cert-other`} className="sr-only">
                    Specify other certification
                  </Label>
                  <Input
                    id={`${idPrefix}-cert-other`}
                    value={certInterestOther}
                    onChange={(e) => setCertInterestOther(e.target.value)}
                    placeholder="Specify another certification"
                    className={fieldClass}
                    required={certInterest === 'other'}
                  />
                </div>
              </div>
            </fieldset>
          ) : null}

          <div
            className={cn(
              isCertHeroDesktop && !isHomeForm && cn('flex w-full flex-col', certHeroChoicesGap),
              !isCertHeroDesktop && 'contents',
            )}
          >
            <fieldset className={cn(choiceFieldsetClass, certMobileSectionPad, isCertHeroDesktop && 'w-full')}>
              <legend className={legendClass}>
                Years of Total Job Experience <span className="text-brand-orange">*</span>
              </legend>
              <div className={radioGridClass} role="radiogroup" aria-required>
                {PMP_JOB_EXPERIENCE_OPTIONS.map((o, index) => (
                  <label key={o.value} className={radioOptionClass(jobExperience === o.value)}>
                    <input
                      type="radio"
                      name={`${idPrefix}-experience`}
                      value={o.value}
                      checked={jobExperience === o.value}
                      onChange={() => setJobExperience(o.value)}
                      required={index === 0}
                      className="h-4 w-4 shrink-0 accent-brand-orange"
                    />
                    {o.label}
                  </label>
                ))}
              </div>
            </fieldset>

            {!isHomeForm ? (
              <fieldset className={cn(choiceFieldsetClass, certMobileSectionPad, isCertHeroDesktop && 'w-full')}>
                <legend className={legendClass}>
                  What is your daily study time?
                </legend>
                <div className={radioGridClass} role="radiogroup">
                  {PMP_DAILY_STUDY_OPTIONS.map((o) => (
                    <label key={o.value} className={radioOptionClass(dailyStudyTime === o.value)}>
                      <input
                        type="radio"
                        name={`${idPrefix}-daily`}
                        value={o.value}
                        checked={dailyStudyTime === o.value}
                        onChange={() => setDailyStudyTime(o.value)}
                        className="h-4 w-4 shrink-0 accent-brand-orange"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </div>

          <label htmlFor={`${idPrefix}-hp`} className="sr-only">
            Leave blank
          </label>
          <input
            id={`${idPrefix}-hp`}
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

          {!isCompact ? (
            <p className="pt-0.5 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              By submitting, you agree to our{' '}
              <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
                Privacy Policy
              </Link>
              . We use your details only to plan your {roadmapLabel} preparation pathway.
            </p>
          ) : null}
        </div>

        <div
          className={cn(
            'shrink-0 border-t border-slate-100 dark:border-slate-800 sm:px-6',
            isCertHeroDesktop
              ? 'mt-auto space-y-2 px-5 py-4 sm:py-5'
              : isCertMobileForm
                ? 'space-y-3 px-5 py-5'
                : isCompact
                  ? 'space-y-2 px-5 py-3'
                  : 'space-y-3 px-5 py-5 sm:px-6',
          )}
        >
          {isCompact ? (
            <p className="text-[10px] leading-snug text-slate-500 dark:text-slate-400">
              By submitting, you agree to our{' '}
              <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          ) : null}
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
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}