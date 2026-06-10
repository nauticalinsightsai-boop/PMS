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
import { ENROLLMENT_COUNTRIES, defaultCountriesForRegion } from '@/lib/enrollment-country-options';
import {
  PMP_DAILY_STUDY_OPTIONS,
  PMP_HOURS_PER_DAY_OPTIONS,
  PMP_JOB_EXPERIENCE_OPTIONS,
  PMP_ROADMAP_DIAL_CODES,
} from '@/lib/pmp-roadmap-form-options';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { CONVERSION_EVENTS, trackConversionEvent } from '@/lib/analytics/conversion-events';

export type PmpRoadmapFormPlacement =
  | 'home_hero_mobile'
  | 'home_hero_desktop'
  | 'home_insights'
  | 'cert_pmp_hero'
  | 'cert_pmp_mobile';

type PmpRoadmapLeadFormProps = {
  placement: PmpRoadmapFormPlacement;
  variant?: 'hero' | 'insights' | 'cert';
  className?: string;
};

const PLACEMENT_LABELS: Record<PmpRoadmapFormPlacement, string> = {
  home_hero_mobile: 'Home hero (mobile)',
  home_hero_desktop: 'Home hero (desktop)',
  home_insights: 'Home insights band',
  cert_pmp_hero: 'PMP certification hero',
  cert_pmp_mobile: 'PMP certification hero (mobile)',
};

export function PmpRoadmapLeadForm({
  placement,
  variant = 'hero',
  className,
}: PmpRoadmapLeadFormProps) {
  const { regionId, gccCountry, isReady } = useRegion();
  const idPrefix = placement.replace(/[^a-z0-9]/gi, '-');

  const [fullName, setFullName] = React.useState('');
  const [dialCode, setDialCode] = React.useState('+1');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [jobExperience, setJobExperience] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [dailyStudyTime, setDailyStudyTime] = React.useState('');
  const [hoursPerDay, setHoursPerDay] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!isReady) return;
    const defaults = defaultCountriesForRegion(regionId, gccCountry);
    if (defaults.residence) {
      setCountry((prev) => prev || defaults.residence);
    }
  }, [isReady, regionId, gccCountry]);

  const shellClass = cn(
    'rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border shadow-2xl overflow-hidden',
    variant === 'insights'
      ? 'bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:text-white dark:border-slate-700'
      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
    className,
  );

  const labelClass = 'text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide';
  const fieldClass = 'h-10 text-sm focus-visible:ring-brand-orange/40';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobExperience || !country) {
      setError('Please complete required fields.');
      return;
    }
    setError(null);
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();
    const res = await submitPublicInteraction({
      source: 'pmp_roadmap_lead',
      subject: `PMP roadmap — ${PLACEMENT_LABELS[placement]}`,
      email,
      website: honeypot,
      payload: {
        fullName,
        phoneCountryCode: dialCode,
        phone,
        phoneFull,
        whatsapp: phoneFull,
        role,
        jobExperienceYears: jobExperience,
        country,
        dailyStudyTime: dailyStudyTime || undefined,
        hoursPerDay: hoursPerDay || undefined,
        placement,
        pagePath,
        regionId,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      trackConversionEvent(CONVERSION_EVENTS.CONSULTATION_BOOK, {
        source: placement,
        form: 'pmp_roadmap',
      });
      setSubmitted(true);
    } else {
      setError(res.error ?? 'Submission failed. Try again.');
    }
  };

  if (submitted) {
    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p className="text-base font-semibold text-green-700 dark:text-green-400">
          Thanks — we received your details and will follow up with your PMP roadmap.
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
        className="flex max-h-[min(90vh,52rem)] flex-col"
        aria-labelledby={`${idPrefix}-title`}
      >
        <div className="shrink-0 border-b border-slate-100 bg-gradient-to-br from-brand-purple/5 via-white to-brand-orange/5 px-5 py-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:px-6 sm:py-6">
          <p
            id={`${idPrefix}-title`}
            className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl"
          >
            Build your PMP® roadmap
          </p>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Share your experience — we&apos;ll map a study plan for you.
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-name`} className={labelClass}>
              Full Name
            </Label>
            <Input
              id={`${idPrefix}-name`}
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={fieldClass}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-phone`} className={labelClass}>
              Phone / WhatsApp
            </Label>
            <div className="flex h-10 overflow-hidden rounded-lg border border-input bg-transparent focus-within:border-brand-orange/50 focus-within:ring-3 focus-within:ring-brand-orange/30 dark:bg-input/30">
              <Select value={dialCode} onValueChange={(v) => v && setDialCode(v)}>
                <SelectTrigger
                  id={`${idPrefix}-dial`}
                  aria-label="Country code"
                  className="h-full w-[5.75rem] shrink-0 rounded-none border-0 border-r border-input bg-transparent px-2 shadow-none focus-visible:ring-0 dark:bg-transparent"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PMP_ROADMAP_DIAL_CODES.map((d) => (
                    <SelectItem key={`${d.code}-${d.label}`} value={d.code}>
                      {d.label}
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
                placeholder="Mobile number for calls & WhatsApp"
                className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-email`} className={labelClass}>
                Email Address
              </Label>
              <Input
                id={`${idPrefix}-email`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-role`} className={labelClass}>
                Role / Job Title
              </Label>
              <Input
                id={`${idPrefix}-role`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-experience`} className={labelClass}>
                Years of Total Job Experience <span className="text-brand-orange">*</span>
              </Label>
              <Select value={jobExperience} onValueChange={(v) => v && setJobExperience(v)}>
                <SelectTrigger id={`${idPrefix}-experience`} className={fieldClass} aria-required>
                  <SelectValue placeholder="Select job experience" />
                </SelectTrigger>
                <SelectContent>
                  {PMP_JOB_EXPERIENCE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}-country`} className={labelClass}>
                Country <span className="text-brand-orange">*</span>
              </Label>
              <Select value={country} onValueChange={(v) => v && setCountry(v)}>
                <SelectTrigger id={`${idPrefix}-country`} className={fieldClass} aria-required>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {ENROLLMENT_COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-daily`} className={labelClass}>
              What is your daily study time?
            </Label>
            <Select value={dailyStudyTime} onValueChange={(v) => v && setDailyStudyTime(v)}>
              <SelectTrigger id={`${idPrefix}-daily`} className={fieldClass}>
                <SelectValue placeholder="Select daily study time" />
              </SelectTrigger>
              <SelectContent>
                {PMP_DAILY_STUDY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-hours-day`} className={labelClass}>
              Hours per day
            </Label>
            <Select value={hoursPerDay} onValueChange={(v) => v && setHoursPerDay(v)}>
              <SelectTrigger id={`${idPrefix}-hours-day`} className={fieldClass}>
                <SelectValue placeholder="How many hours per day?" />
              </SelectTrigger>
              <SelectContent>
                {PMP_HOURS_PER_DAY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            By submitting, you agree to our{' '}
            <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
              Privacy Policy
            </Link>
            . We use your details only to plan your PMP preparation pathway.
          </p>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full bg-brand-orange text-base font-bold text-white shadow-lg shadow-brand-orange/20 hover:bg-brand-hover"
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      </form>
    </div>
  );
}
