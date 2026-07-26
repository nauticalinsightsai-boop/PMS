'use client';

import * as React from 'react';
import Link from 'next/link';
import BrandIconMark from '@/components/BrandIconMark';
import { CertFamilyMark } from '@/components/CertFamilyMark';
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
import { useRegion } from '@/contexts/RegionContext';
import {
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';
import {
  createClientSubmissionId,
  submitPublicInteraction,
} from '@/lib/interactions/submit-public';
import { cn } from '@/lib/utils';

const OBJECTIVES = [
  { value: 'requirements', label: 'Requirements' },
  { value: 'next_cohort', label: 'Next cohort' },
  { value: 'exam_prep', label: 'Exam preparation' },
  { value: 'study_plan', label: 'Study plan' },
  { value: 'fees_schedule', label: 'Fees & schedule' },
  { value: 'exploring', label: 'Still exploring' },
] as const;

type Props = {
  certId?: string;
  certName?: string;
  familyId?: string;
  placement: 'certifications_hub' | 'cert_detail';
  className?: string;
};

function initialDialCode(regionId?: string | null, gccCountry?: string | null): string {
  if (regionId === 'gcc') {
    const gccCodes: Record<string, string> = {
      AE: 'ae',
      SA: 'sa',
      KW: 'kw',
      QA: 'qa',
      BH: 'bh',
      OM: 'om',
    };
    return (gccCountry && gccCodes[gccCountry]) || 'ae';
  }
  if (regionId === 'india') return 'in';
  if (regionId === 'pakistan') return 'pk';
  if (regionId === 'uk') return 'gb';
  return 'us';
}

export function CertificationRoadmapLeadForm({
  certId,
  certName = 'certification',
  familyId,
  placement,
  className,
}: Props) {
  const { regionId, gccCountry } = useRegion();
  const [objective, setObjective] = React.useState('');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const inferredDialCode = React.useMemo(
    () => initialDialCode(regionId, gccCountry),
    [regionId, gccCountry],
  );
  const [dialValue, setDialValue] = React.useState(inferredDialCode);
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const submissionIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!dialValue || dialValue === 'us') setDialValue(inferredDialCode);
  }, [dialValue, inferredDialCode]);

  const dial = resolveDialOption(dialValue);
  const idPrefix = `cert-roadmap-${certId ?? 'hub'}`;
  const displayName =
    certName.toLowerCase() === 'certification' ? 'certification' : certName;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!objective) {
      setError('Choose what you would like help with.');
      return;
    }
    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setError('Add your name, mobile number, and email.');
      return;
    }

    setSubmitting(true);
    setError(null);
    const clientSubmissionId =
      submissionIdRef.current ?? (submissionIdRef.current = createClientSubmissionId());
    const pagePath = typeof window === 'undefined' ? undefined : window.location.pathname;
    const phoneFull = `${dial.code} ${phone.trim()}`.trim();
    const result = await submitPublicInteraction({
      source: 'cert_roadmap_lead',
      subject: `${certName} roadmap request`,
      email: email.trim(),
      clientSubmissionId,
      website: honeypot,
      formContext: {
        formId: 'certification_roadmap',
        formLabel: 'Certification roadmap',
        placement,
        pagePath,
        siteCertId: certId,
        certName,
        certificationInterest: objective,
        regionId,
      },
      payload: {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phoneFull,
        dialCode: dial.code,
        objective,
        siteCertId: certId,
        certName,
        familyId,
        regionId,
        gccCountry: gccCountry ?? undefined,
      },
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? 'Could not submit your request. Please try again.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className={cn(
          'rounded-[2rem] border border-slate-100 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900',
          className,
        )}
      >
        <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
          Your roadmap request is in.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          We&apos;ll review your goal and follow up with the clearest next step for {displayName}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        'overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      aria-labelledby={`${idPrefix}-title`}
    >
      <div className="border-b border-slate-100 bg-gradient-to-br from-brand-purple/5 via-white to-brand-orange/5 px-5 py-5 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 sm:px-6">
        <div className="flex items-start gap-3">
          {familyId ? (
            <div className="flex h-12 min-w-12 items-center justify-center rounded-xl border border-slate-100 bg-white px-2 dark:border-slate-700 dark:bg-slate-800">
              <CertFamilyMark familyId={familyId} imageClassName="h-8 w-auto max-w-[4.5rem] object-contain" />
            </div>
          ) : (
            <BrandIconMark size={48} priority />
          )}
          <div className="min-w-0">
            <h2
              id={`${idPrefix}-title`}
              className="text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl"
            >
              Build your {displayName} roadmap
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Tell us your goal. We&apos;ll suggest the clearest next step.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-5 py-6 sm:px-6">
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
            What would you like help with?
          </legend>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" role="radiogroup">
            {OBJECTIVES.map((item) => {
              const selected = objective === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setObjective(item.value)}
                  className={cn(
                    'min-h-12 rounded-xl border px-3 py-2 text-sm font-semibold leading-snug transition-colors',
                    selected
                      ? 'border-brand-orange bg-brand-orange text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-brand-orange/50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200',
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${idPrefix}-name`} className="text-sm font-semibold">
              Full name
            </Label>
            <Input
              id={`${idPrefix}-name`}
              required
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="min-h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-phone`} className="text-sm font-semibold">
              Mobile number
            </Label>
            <div className="flex gap-2">
              <Select
                value={dialValue}
                onValueChange={(value) => {
                  if (value) setDialValue(value);
                }}
              >
                <SelectTrigger
                  id={`${idPrefix}-dial`}
                  className="min-h-12 w-[7.25rem] shrink-0 px-2"
                  aria-label="Country dial code"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PMP_ROADMAP_DIAL_CODES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {formatDialPrefix(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id={`${idPrefix}-phone`}
                type="tel"
                required
                autoComplete="tel-national"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="min-h-12 min-w-0 flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-email`} className="text-sm font-semibold">
              Email address
            </Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12"
            />
          </div>
        </div>

        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />

        {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          By submitting, you agree to our{' '}
          <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          disabled={submitting}
          className="min-h-12 w-full rounded-full bg-brand-orange text-base font-bold text-white"
        >
          {submitting ? 'Submitting…' : 'Get my roadmap'}
        </Button>
      </div>
    </form>
  );
}
