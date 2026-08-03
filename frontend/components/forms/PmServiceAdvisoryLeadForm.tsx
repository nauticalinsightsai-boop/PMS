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
  PM_SERVICE_INDUSTRY_OPTIONS,
  PM_SERVICE_INTEREST_OPTIONS,
  resolvePmServiceIndustryLabel,
  resolvePmServiceInterestLabel,
  type PmServiceIndustryValue,
  type PmServiceInterestValue,
} from '@/lib/pm-service-form-options';
import { formChoiceChipLayoutClass, formChoiceGroupClass } from '@/lib/form-choice-group-layout';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import BrandIconMark from '@/components/BrandIconMark';

export const PM_SERVICE_ADVISORY_FORM_ANCHOR = 'pm-service-advisory-form';

export type PmServiceAdvisoryFormPlacement =
  | 'pm_service_hero'
  | 'pm_service_hero_mobile'
  | 'pm_service_hero_desktop';

type AdvisoryStep = 'interest' | 'contact';

const PLACEMENT_LABELS: Record<PmServiceAdvisoryFormPlacement, string> = {
  pm_service_hero: 'PM Service hero',
  pm_service_hero_mobile: 'PM Service hero (mobile)',
  pm_service_hero_desktop: 'PM Service hero (desktop)',
};

const INTEREST_CHOICES = [
  ...PM_SERVICE_INTEREST_OPTIONS,
  { value: 'other' as const, label: 'Other' },
];

type Props = {
  placement: PmServiceAdvisoryFormPlacement;
  className?: string;
};

export function PmServiceAdvisoryLeadForm({ placement, className }: Props) {
  const { regionId } = useRegion();
  const idPrefix = placement.replace(/[^a-z0-9]/gi, '-');
  const isMobile = placement === 'pm_service_hero_mobile';
  const formRef = React.useRef<HTMLFormElement>(null);

  const [currentStep, setCurrentStep] = React.useState<AdvisoryStep>('interest');
  const [fullName, setFullName] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [serviceInterest, setServiceInterest] = React.useState<PmServiceInterestValue | ''>('');
  const [serviceInterestOther, setServiceInterestOther] = React.useState('');
  const [industry, setIndustry] = React.useState<PmServiceIndustryValue | ''>('');
  const [industryOther, setIndustryOther] = React.useState('');
  const [profileUrl, setProfileUrl] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const shellClass = cn(
    'rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border shadow-2xl overflow-hidden',
    'min-h-[420px] sm:min-h-[440px] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
    'shadow-slate-900/10 dark:shadow-black/30',
    className,
  );

  const labelClass =
    'font-semibold normal-case tracking-normal text-[13px] sm:text-sm text-slate-600 dark:text-slate-300';
  const fieldClass =
    'min-h-12 h-12 w-full text-sm focus-visible:ring-brand-orange/40';
  const chipClass = (selected: boolean) =>
    cn(
      'flex min-h-12 cursor-pointer items-center justify-center rounded-lg border py-2.5 text-sm font-bold transition-colors',
      formChoiceChipLayoutClass(4),
      selected
        ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-orange/40 dark:bg-slate-900 dark:text-slate-300',
    );

  const stepNumber = currentStep === 'interest' ? 1 : 2;
  const progressPercent = (stepNumber / 2) * 100;
  const resolvedInterest = resolvePmServiceInterestLabel(serviceInterest, serviceInterestOther);

  const clearError = () => setError(null);

  const moveToStep = (next: AdvisoryStep) => {
    setCurrentStep(next);
    requestAnimationFrame(() => {
      const firstInput = formRef.current?.querySelector<HTMLElement>(
        `[data-step="${next}"] input, [data-step="${next}"] button`,
      );
      firstInput?.focus();
    });
  };

  const validateInterestStep = (): string | null => {
    if (!serviceInterest) return 'Please select what you are interested in.';
    if (serviceInterest === 'other' && !serviceInterestOther.trim()) {
      return 'Please specify your interest under Other.';
    }
    if (industry === 'other' && !industryOther.trim()) {
      return 'Please specify your industry under Other.';
    }
    return null;
  };

  const validateContactStep = (): string | null => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!phone.trim()) return 'Please enter your mobile number.';
    if (!email.trim()) return 'Please enter your email address.';
    return null;
  };

  const handleContinue = () => {
    const issue = validateInterestStep();
    if (issue) {
      setError(issue);
      return;
    }
    clearError();
    moveToStep('contact');
  };

  const handleBack = () => {
    clearError();
    moveToStep('interest');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 'contact') return;

    const interestIssue = validateInterestStep();
    if (interestIssue) {
      setError(interestIssue);
      moveToStep('interest');
      return;
    }
    const contactIssue = validateContactStep();
    if (contactIssue) {
      setError(contactIssue);
      return;
    }

    clearError();
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();

    const res = await submitPublicInteraction({
      source: 'consultation',
      subject: `PM Service advisory: ${resolvedInterest}`,
      email,
      website: honeypot,
      formContext: {
        formId: 'pm_service_advisory',
        formLabel: 'PM Service advisory',
        placement: PLACEMENT_LABELS[placement],
        pagePath,
        regionId,
      },
      payload: {
        fullName,
        phoneCountryCode: dialCode,
        phoneCountryPrefix: dialOption.prefix,
        phone,
        phoneFull,
        whatsapp: phoneFull,
        serviceInterest: resolvedInterest,
        serviceInterestType: serviceInterest,
        serviceInterestOther: serviceInterest === 'other' ? serviceInterestOther.trim() : undefined,
        industry: resolvePmServiceIndustryLabel(industry, industryOther),
        industryType: industry,
        industryOther: industry === 'other' ? industryOther.trim() : undefined,
        profileUrl: profileUrl.trim() || undefined,
        placement,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(res.error ?? 'Submission failed. Try again.');
    }
  };

  if (submitted) {
    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p className="text-base font-semibold text-green-700 dark:text-green-400">
          Thanks. We received your request and will follow up on your advisory inquiry.
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
    <div className={shellClass}>
      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col"
        aria-labelledby={`${idPrefix}-title`}
        aria-describedby={error ? `${idPrefix}-form-error` : undefined}
      >
        <div className="shrink-0 border-b border-slate-100 bg-gradient-to-br from-brand-purple/5 via-white to-brand-orange/5 px-5 py-5 sm:px-6 sm:py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="flex items-start gap-3 sm:gap-4">
            {!isMobile ? (
              <div className="hidden sm:block">
                <BrandIconMark size={56} priority={placement === 'pm_service_hero_desktop'} />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p
                id={`${idPrefix}-title`}
                className="font-heading text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white"
              >
                Request advisory support
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                Tell us your interest, we&apos;ll route you to the right advisor.
              </p>
              <div
                className="mt-3"
                role="progressbar"
                aria-valuenow={stepNumber}
                aria-valuemin={1}
                aria-valuemax={2}
                aria-label={`Step ${stepNumber} of 2`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Step {stepNumber} of 2
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-orange transition-[width] duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 py-6 sm:gap-6 sm:px-8 sm:py-7">
          {currentStep === 'interest' ? (
            <div data-step="interest" className="flex flex-col gap-5 sm:gap-6">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend id={`${idPrefix}-interest-label`} className={cn(labelClass, 'mb-2.5')}>
                  You are interested in <span className="text-brand-orange">*</span>
                </legend>
                <div
                  id={`${idPrefix}-interest-options`}
                  className="grid grid-cols-1 gap-2.5 sm:grid-cols-2"
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-interest-label`}
                  aria-required="true"
                >
                  {INTEREST_CHOICES.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={serviceInterest === opt.value}
                      className={cn(
                        'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors',
                        serviceInterest === opt.value
                          ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
                          : 'border-input bg-white text-slate-700 hover:border-brand-orange/40 dark:bg-slate-900 dark:text-slate-300',
                      )}
                      onClick={() => {
                        clearError();
                        setServiceInterest(opt.value);
                        if (opt.value !== 'other') setServiceInterestOther('');
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {serviceInterest === 'other' ? (
                  <div className="mt-2.5 space-y-1.5">
                    <Label htmlFor={`${idPrefix}-interest-other`}>Specify other interest</Label>
                    <Input
                      id={`${idPrefix}-interest-other`}
                      value={serviceInterestOther}
                      onChange={(e) => {
                        clearError();
                        setServiceInterestOther(e.target.value);
                      }}
                      placeholder="Please specify"
                      className={fieldClass}
                      required
                    />
                  </div>
                ) : null}
              </fieldset>

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend id={`${idPrefix}-industry-label`} className={cn(labelClass, 'mb-2.5')}>
                  Industry{' '}
                  <span className="font-normal text-slate-400">(optional)</span>
                </legend>
                <div
                  id={`${idPrefix}-industry-options`}
                  className={formChoiceGroupClass(4, 'site')}
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-industry-label`}
                >
                  {PM_SERVICE_INDUSTRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={industry === opt.value}
                      className={chipClass(industry === opt.value)}
                      onClick={() => {
                        clearError();
                        if (industry === opt.value) {
                          setIndustry('');
                          setIndustryOther('');
                          return;
                        }
                        setIndustry(opt.value);
                        setIndustryOther('');
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={industry === 'other'}
                    className={chipClass(industry === 'other')}
                    onClick={() => {
                      clearError();
                      if (industry === 'other') {
                        setIndustry('');
                        setIndustryOther('');
                        return;
                      }
                      setIndustry('other');
                    }}
                  >
                    Other
                  </button>
                </div>
                {industry === 'other' ? (
                  <div className="mt-2.5 space-y-1.5">
                    <Label htmlFor={`${idPrefix}-industry-other`}>Specify other industry</Label>
                    <Input
                      id={`${idPrefix}-industry-other`}
                      value={industryOther}
                      onChange={(e) => {
                        clearError();
                        setIndustryOther(e.target.value);
                      }}
                      placeholder="Please specify"
                      className={fieldClass}
                      required
                    />
                  </div>
                ) : null}
              </fieldset>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-profile`} className={labelClass}>
                  Website or LinkedIn{' '}
                  <span className="font-normal text-slate-400">(optional)</span>
                </Label>
                <Input
                  id={`${idPrefix}-profile`}
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/your-profile"
                  className={fieldClass}
                />
              </div>
            </div>
          ) : null}

          {currentStep === 'contact' ? (
            <div data-step="contact" className="flex flex-col gap-5 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-name`} className={labelClass}>
                  Full name <span className="text-brand-orange">*</span>
                </Label>
                <Input
                  id={`${idPrefix}-name`}
                  required
                  value={fullName}
                  onChange={(e) => {
                    clearError();
                    setFullName(e.target.value);
                  }}
                  placeholder="John Smith"
                  className={fieldClass}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-phone`} className={labelClass}>
                  Mobile number <span className="text-brand-orange">*</span>
                </Label>
                <div className="flex h-12 overflow-hidden rounded-lg border border-input bg-transparent focus-within:border-brand-orange/50 focus-within:ring-3 focus-within:ring-brand-orange/30 dark:bg-input/30">
                  <Select value={dialValue} onValueChange={(v) => v && setDialValue(v)}>
                    <SelectTrigger
                      id={`${idPrefix}-dial`}
                      aria-label="Country code"
                      className="h-full w-[6.75rem] shrink-0 rounded-none border-0 border-r border-input bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
                    >
                      <SelectValue>{formatDialPrefix(dialOption)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PMP_ROADMAP_DIAL_CODES.map((d) => (
                        <SelectItem key={d.code} value={d.code}>
                          {formatDialPrefix(d)} {d.label}
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
                      clearError();
                      setPhone(e.target.value);
                    }}
                    placeholder="50 123 4567"
                    className="h-full rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
                    autoComplete="tel-national"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-email`} className={labelClass}>
                  Email address <span className="text-brand-orange">*</span>
                </Label>
                <Input
                  id={`${idPrefix}-email`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="john@example.com"
                  className={fieldClass}
                  autoComplete="email"
                />
              </div>

              <p className="!mt-0 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                By submitting, you agree to our{' '}
                <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
                  Privacy Policy
                </Link>
                . We use your details only to respond to your advisory inquiry.
              </p>
            </div>
          ) : null}

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

          {error ? (
            <p
              id={`${idPrefix}-form-error`}
              role="alert"
              className="text-sm font-medium text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <div className="flex gap-3">
            {currentStep === 'contact' ? (
              <Button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                variant="outline"
                className="h-12 rounded-full px-6 font-bold"
              >
                Back
              </Button>
            ) : null}
            {currentStep === 'interest' ? (
              <Button
                type="button"
                onClick={handleContinue}
                className="h-12 w-full rounded-full bg-brand-orange text-base font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-hover"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="h-12 flex-1 rounded-full bg-brand-orange text-base font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-hover"
              >
                {submitting ? 'Submitting…' : 'Submit request'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
