'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import {
  formChoiceChipLayoutClass,
  formChoiceGroupClass,
} from '@/lib/form-choice-group-layout';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import BrandIconMark from '@/components/BrandIconMark';

export const PM_SERVICE_ADVISORY_FORM_ANCHOR = 'pm-service-advisory-form';

export type PmServiceAdvisoryFormPlacement =
  | 'pm_service_hero'
  | 'pm_service_hero_mobile'
  | 'pm_service_hero_desktop';

const PLACEMENT_LABELS: Record<PmServiceAdvisoryFormPlacement, string> = {
  pm_service_hero: 'PM Service hero',
  pm_service_hero_mobile: 'PM Service hero (mobile)',
  pm_service_hero_desktop: 'PM Service hero (desktop)',
};

const PM_SERVICE_INTEREST_CHOICES = [
  ...PM_SERVICE_INTEREST_OPTIONS,
  { value: 'other', label: 'Other' },
] as const;

const PM_SERVICE_INDUSTRY_CHOICES = [
  ...PM_SERVICE_INDUSTRY_OPTIONS,
  { value: 'other', label: 'Other' },
] as const;

type Props = {
  placement: PmServiceAdvisoryFormPlacement;
  className?: string;
};

export function PmServiceAdvisoryLeadForm({ placement, className }: Props) {
  const { regionId } = useRegion();
  const idPrefix = placement.replace(/[^a-z0-9]/gi, '-');
  const isMobile = placement === 'pm_service_hero_mobile';

  const [fullName, setFullName] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [serviceInterest, setServiceInterest] = React.useState<PmServiceInterestValue | ''>('');
  const [serviceInterestOther, setServiceInterestOther] = React.useState('');
  const [industry, setIndustry] = React.useState<PmServiceIndustryValue | ''>('');
  const [industryOther, setIndustryOther] = React.useState('');
  const [question, setQuestion] = React.useState('');
  const [profileUrl, setProfileUrl] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errorTarget, setErrorTarget] = React.useState<
    'interest' | 'interest_other' | 'industry_other' | 'submit' | null
  >(null);
  const interestRef = React.useRef<HTMLFieldSetElement>(null);
  const interestOtherRef = React.useRef<HTMLInputElement>(null);
  const industryOtherRef = React.useRef<HTMLInputElement>(null);
  const errorRef = React.useRef<HTMLParagraphElement>(null);
  const successRef = React.useRef<HTMLParagraphElement>(null);
  React.useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);
  React.useEffect(() => {
    if (errorTarget === 'interest') interestRef.current?.focus();
    if (errorTarget === 'interest_other') interestOtherRef.current?.focus();
    if (errorTarget === 'industry_other') industryOtherRef.current?.focus();
    if (errorTarget === 'submit') errorRef.current?.focus();
  }, [errorTarget, error]);

  const shellClass = cn(
    'relative left-1/2 w-[calc(100%+0.5rem)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 sm:w-[calc(100%+2rem)] sm:max-w-[calc(100vw-3rem)]',
    'rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border shadow-2xl overflow-hidden',
    'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
    className,
  );

  const labelClass =
    'font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-[11px] sm:text-xs';
  const fieldClass = 'h-10 w-full text-sm focus-visible:ring-brand-orange/40';
  const legendClass = cn(labelClass, 'mb-2.5');
  const choiceButtonClass = (selected: boolean) =>
    cn(
      'flex min-h-11 w-full cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors',
      selected
        ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-orange/40 dark:bg-slate-900 dark:text-slate-300',
    );

  const resolvedInterest = resolvePmServiceInterestLabel(serviceInterest, serviceInterestOther);

  const clearIndustrySelection = () => {
    setIndustry('');
    setIndustryOther('');
    if (errorTarget === 'industry_other') {
      setError(null);
      setErrorTarget(null);
    }
  };

  const toggleServiceInterest = (value: Exclude<PmServiceInterestValue, 'other'>) => {
    if (serviceInterest === value) {
      setServiceInterest('');
      setServiceInterestOther('');
      return;
    }
    setServiceInterest(value);
    setServiceInterestOther('');
    if (errorTarget === 'interest' || errorTarget === 'interest_other') {
      setError(null);
      setErrorTarget(null);
    }
  };

  const toggleServiceInterestOther = () => {
    if (serviceInterest === 'other') {
      setServiceInterest('');
      setServiceInterestOther('');
      return;
    }
    setServiceInterest('other');
    if (errorTarget === 'interest') {
      setError(null);
      setErrorTarget(null);
    }
  };

  const toggleIndustry = (value: Exclude<PmServiceIndustryValue, 'other'>) => {
    if (industry === value) {
      clearIndustrySelection();
      return;
    }
    setIndustry(value);
    setIndustryOther('');
    if (errorTarget === 'industry_other') {
      setError(null);
      setErrorTarget(null);
    }
  };

  const toggleIndustryOther = () => {
    if (industry === 'other') {
      clearIndustrySelection();
      return;
    }
    setIndustry('other');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceInterest) {
      setError('Please select what you are interested in.');
      setErrorTarget('interest');
      return;
    }
    if (serviceInterest === 'other' && !serviceInterestOther.trim()) {
      setError('Please specify your interest under Other.');
      setErrorTarget('interest_other');
      return;
    }
    if (industry === 'other' && !industryOther.trim()) {
      setError('Please specify your industry under Other.');
      setErrorTarget('industry_other');
      return;
    }
    setError(null);
    setErrorTarget(null);
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
        question: question.trim() || undefined,
        profileUrl: profileUrl.trim() || undefined,
        placement,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      setError(res.error ?? 'Submission failed. Try again.');
      setErrorTarget('submit');
    }
  };

  if (submitted) {
    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p ref={successRef} id={`${idPrefix}-success`} role="status" aria-live="polite" aria-atomic="true" tabIndex={-1} className="text-base font-semibold text-green-700 dark:text-green-400">
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
        onSubmit={handleSubmit}
        className="flex max-lg:max-h-none flex-col lg:max-h-[min(90vh,52rem)]"
        aria-labelledby={`${idPrefix}-title`}
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
                Tell us your interest and background. We&apos;ll route you to the right advisor.
              </p>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'scrollbar-none space-y-5 px-5 py-6 sm:space-y-6 sm:px-6 sm:py-7 lg:min-h-0 lg:flex-1 lg:overflow-y-auto',
          )}
        >
          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-name`} className={labelClass}>
              Full Name
            </Label>
            <Input
              id={`${idPrefix}-name`}
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Smith"
              className={fieldClass}
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-phone`} className={labelClass}>
              Mobile Number
            </Label>
            <div className="flex h-10 overflow-hidden rounded-lg border border-input bg-transparent focus-within:border-brand-orange/50 focus-within:ring-3 focus-within:ring-brand-orange/30 dark:bg-input/30">
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
                onChange={(e) => setPhone(e.target.value)}
                placeholder="50 123 4567"
                className="h-full rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-email`} className={labelClass}>
              Email Address
            </Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className={fieldClass}
            />
          </div>

          <fieldset
            ref={interestRef}
            tabIndex={-1}
            className="space-y-3.5"
            aria-labelledby={`${idPrefix}-interest-legend`}
            aria-invalid={errorTarget === 'interest' ? true : undefined}
            aria-describedby={errorTarget === 'interest' ? `${idPrefix}-form-error` : undefined}
          >
            <legend id={`${idPrefix}-interest-legend`} className={legendClass}>
              You are interested in. <span className="text-brand-orange">*</span>
            </legend>
            <div
              className={cn(
                formChoiceGroupClass(PM_SERVICE_INTEREST_CHOICES.length, 'site'),
                '-mx-2.5 sm:-mx-6',
              )}
              role="group"
              aria-labelledby={`${idPrefix}-interest-legend`}
            >
              {PM_SERVICE_INTEREST_CHOICES.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={cn(
                    choiceButtonClass(serviceInterest === o.value),
                    formChoiceChipLayoutClass(PM_SERVICE_INTEREST_CHOICES.length),
                    'tracking-[-0.02em] sm:tracking-[-0.045em] md:tracking-[-0.045em]',
                  )}
                  aria-pressed={serviceInterest === o.value}
                  onClick={() => {
                    if (o.value === 'other') {
                      toggleServiceInterestOther();
                    } else {
                      toggleServiceInterest(o.value);
                    }
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {serviceInterest === 'other' ? (
              <div>
                <Input
                  ref={interestOtherRef}
                  id={`${idPrefix}-interest-other`}
                  value={serviceInterestOther}
                  onChange={(e) => {
                    const next = e.target.value;
                    setServiceInterestOther(next);
                    if (
                      next.trim() &&
                      (errorTarget === 'interest' || errorTarget === 'interest_other')
                    ) {
                      setError(null);
                      setErrorTarget(null);
                    }
                  }}
                  onFocus={() => {
                    if (errorTarget === 'interest') {
                      setError(null);
                      setErrorTarget(null);
                    }
                  }}
                  onInvalid={() => {
                    setError('Please specify your interest under Other.');
                    setErrorTarget('interest_other');
                  }}
                  placeholder="Specify"
                  className="h-10 w-full min-w-0 border-input text-sm"
                  required
                  aria-label="Specify other interest"
                  aria-invalid={errorTarget === 'interest_other' ? true : undefined}
                  aria-describedby={
                    errorTarget === 'interest_other' ? `${idPrefix}-form-error` : undefined
                  }
                />
              </div>
            ) : null}
          </fieldset>

          <fieldset
            tabIndex={-1}
            className="space-y-3.5"
            aria-labelledby={`${idPrefix}-industry-legend`}
          >
            <legend id={`${idPrefix}-industry-legend`} className={legendClass}>
              Industry or professional field best describes your background.{' '}
              <span className="font-normal normal-case text-slate-400">(optional)</span>
            </legend>
            <div
              className={cn(
                formChoiceGroupClass(PM_SERVICE_INDUSTRY_CHOICES.length, 'site'),
                '-mx-2.5 sm:-mx-6',
              )}
              role="group"
              aria-labelledby={`${idPrefix}-industry-legend`}
            >
              {PM_SERVICE_INDUSTRY_CHOICES.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={cn(
                    choiceButtonClass(industry === o.value),
                    formChoiceChipLayoutClass(PM_SERVICE_INDUSTRY_CHOICES.length),
                    'tracking-[-0.02em] sm:tracking-[-0.045em] md:tracking-[-0.045em]',
                  )}
                  aria-pressed={industry === o.value}
                  onClick={() => {
                    if (o.value === 'other') {
                      toggleIndustryOther();
                    } else {
                      toggleIndustry(o.value);
                    }
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {industry === 'other' ? (
              <div>
                <Input
                  ref={industryOtherRef}
                  id={`${idPrefix}-industry-other`}
                  value={industryOther}
                  onChange={(e) => {
                    const next = e.target.value;
                    setIndustryOther(next);
                    if (next.trim() && errorTarget === 'industry_other') {
                      setError(null);
                      setErrorTarget(null);
                    }
                  }}
                  onInvalid={() => {
                    setError('Please specify your industry under Other.');
                    setErrorTarget('industry_other');
                  }}
                  placeholder="Specify"
                  className="h-10 w-full min-w-0 border-input text-sm"
                  required
                  aria-label="Specify other industry"
                  aria-invalid={errorTarget === 'industry_other' ? true : undefined}
                  aria-describedby={
                    errorTarget === 'industry_other' ? `${idPrefix}-form-error` : undefined
                  }
                />
              </div>
            ) : null}
          </fieldset>

          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-question`} className={labelClass}>
              Please describe your specific question or concern. (Optional)
            </Label>
            <Textarea
              id={`${idPrefix}-question`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Share context on team size, timeline, or delivery challenge."
              className="min-h-[7rem] resize-y text-sm focus-visible:ring-brand-orange/40"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-profile`} className={labelClass}>
              Website or LinkedIn URL (Optional)
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
              ref={errorRef}
              id={`${idPrefix}-form-error`}
              role="alert"
              tabIndex={-1}
              className="text-sm font-medium text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          ) : null}

          <p className="!mt-0 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            By submitting, you agree to our{' '}
            <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
              Privacy Policy
            </Link>
            . We use your details only to respond to your advisory inquiry.
          </p>
        </div>

        <div className="shrink-0 space-y-3 border-t border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full bg-brand-orange text-base font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-hover"
          >
            {submitting ? 'Submitting…' : 'Submit request'}
          </Button>
        </div>
      </form>
    </div>
  );
}
