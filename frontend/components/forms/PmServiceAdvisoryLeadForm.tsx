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

  const shellClass = cn(
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
      'flex w-full cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors',
      selected
        ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-orange/40 dark:bg-slate-900 dark:text-slate-300',
    );

  const resolvedInterest = resolvePmServiceInterestLabel(serviceInterest, serviceInterestOther);

  const hasInterestSelection = serviceInterest !== '';

  const revealClass = (show: boolean) =>
    cn(
      'grid transition-all duration-300 ease-out motion-reduce:transition-none',
      show ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
    );

  const revealInnerClass = (show: boolean) =>
    cn('min-h-0 overflow-hidden', !show && 'pointer-events-none');

  const clearIndustrySelection = () => {
    setIndustry('');
    setIndustryOther('');
  };

  const toggleServiceInterest = (value: Exclude<PmServiceInterestValue, 'other'>) => {
    if (serviceInterest === value) {
      setServiceInterest('');
      setServiceInterestOther('');
      clearIndustrySelection();
      return;
    }
    setServiceInterest(value);
    setServiceInterestOther('');
  };

  const toggleServiceInterestOther = () => {
    if (serviceInterest === 'other') {
      setServiceInterest('');
      setServiceInterestOther('');
      clearIndustrySelection();
      return;
    }
    setServiceInterest('other');
  };

  const toggleIndustry = (value: Exclude<PmServiceIndustryValue, 'other'>) => {
    if (industry === value) {
      clearIndustrySelection();
      return;
    }
    setIndustry(value);
    setIndustryOther('');
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
      return;
    }
    if (serviceInterest === 'other' && !serviceInterestOther.trim()) {
      setError('Please specify your interest under Other.');
      return;
    }
    if (industry === 'other' && !industryOther.trim()) {
      setError('Please specify your industry under Other.');
      return;
    }
    setError(null);
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

          <fieldset className="space-y-3.5">
            <legend className={legendClass}>
              You are interested in. <span className="text-brand-orange">*</span>
            </legend>
            <div className="space-y-2.5" role="group" aria-label="You are interested in">
              {PM_SERVICE_INTEREST_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={choiceButtonClass(serviceInterest === o.value)}
                  aria-pressed={serviceInterest === o.value}
                  onClick={() => toggleServiceInterest(o.value)}
                >
                  {o.label}
                </button>
              ))}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className={cn(choiceButtonClass(serviceInterest === 'other'), 'w-auto shrink-0 px-4')}
                  aria-pressed={serviceInterest === 'other'}
                  onClick={toggleServiceInterestOther}
                >
                  Other
                </button>
                <Input
                  value={serviceInterestOther}
                  onChange={(e) => {
                    setServiceInterestOther(e.target.value);
                    if (serviceInterest !== 'other') setServiceInterest('other');
                  }}
                  onFocus={() => {
                    if (serviceInterest !== 'other') setServiceInterest('other');
                  }}
                  placeholder="Specify"
                  className="h-10 min-w-0 flex-1 border-input text-sm"
                  required={serviceInterest === 'other'}
                  aria-label="Specify other interest"
                />
              </div>
            </div>
          </fieldset>

          <div className={revealClass(hasInterestSelection)} aria-hidden={!hasInterestSelection}>
            <div className={revealInnerClass(hasInterestSelection)}>
              <fieldset className="space-y-3.5">
                <legend className={legendClass}>
                  Industry or professional field best describes your background.{' '}
                  <span className="font-normal normal-case text-slate-400">(optional)</span>
                </legend>
                <div className="space-y-2.5" role="group" aria-label="Industry or professional field">
                  {PM_SERVICE_INDUSTRY_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      className={choiceButtonClass(industry === o.value)}
                      aria-pressed={industry === o.value}
                      onClick={() => toggleIndustry(o.value)}
                    >
                      {o.label}
                    </button>
                  ))}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      className={cn(choiceButtonClass(industry === 'other'), 'w-auto shrink-0 px-4')}
                      aria-pressed={industry === 'other'}
                      onClick={toggleIndustryOther}
                    >
                      Other
                    </button>
                    <Input
                      value={industryOther}
                      onChange={(e) => {
                        setIndustryOther(e.target.value);
                        if (industry !== 'other') setIndustry('other');
                      }}
                      onFocus={() => {
                        if (industry !== 'other') setIndustry('other');
                      }}
                      placeholder="Specify"
                      className="h-10 min-w-0 flex-1 border-input text-sm"
                      required={industry === 'other'}
                      aria-label="Specify other industry"
                    />
                  </div>
                </div>
              </fieldset>
            </div>
          </div>

          <div className={revealClass(hasInterestSelection)} aria-hidden={!hasInterestSelection}>
            <div className={cn(revealInnerClass(hasInterestSelection), 'space-y-5 sm:space-y-6')}>
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
            </div>
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

          {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

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
