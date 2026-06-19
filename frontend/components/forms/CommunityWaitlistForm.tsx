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
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { useRegion } from '@/contexts/RegionContext';
import { useSimpleFormRecovery } from '@/components/conversion-recovery/useSimpleFormRecovery';
import {
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';
import { PMS_EVENTS } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { CTAS } from '@/lib/brand-voice';

const COMMUNITY_INTERESTS = [
  'Skool community',
  'Study circles',
  'Mentorship',
  'Live events',
  'Career pathing',
] as const;

type Props = {
  className?: string;
};

export function CommunityWaitlistForm({ className }: Props) {
  const { regionId } = useRegion();
  const [fullName, setFullName] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { touch, onSuccess } = useSimpleFormRecovery({
    variant: 'waitlist_partial',
    isDone: done,
    hasPartialData: Boolean(
      fullName.trim() ||
        phone.trim() ||
        email.trim() ||
        linkedinUrl.trim() ||
        selectedInterests.length > 0,
    ),
    offeringId: 'community',
    parentSurface: 'community',
  });

  const labelClass =
    'text-[10px] font-bold uppercase tracking-wide text-white/85 sm:text-[11px]';
  const fieldClass =
    'h-9 w-full border-white/30 bg-slate-950/50 text-sm text-white placeholder:text-white/55 focus-visible:ring-brand-orange/50 sm:h-10';

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest],
    );
    touch();
  };

  const interestPillClass = (selected: boolean) =>
    cn(
      'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors sm:px-3 sm:py-1.5 sm:text-xs',
      selected
        ? 'border-brand-orange bg-brand-orange text-white shadow-sm'
        : 'border-white/35 bg-slate-950/40 text-white hover:border-brand-orange/60 hover:bg-slate-950/55',
    );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      setError('Please select at least one area you are interested in.');
      return;
    }
    setError(null);
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/community';
    const interestsLabel = selectedInterests.join(', ');
    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();

    const res = await submitPublicInteraction({
      source: 'waitlist',
      subject: `Community waitlist: ${interestsLabel}`,
      email,
      website: honeypot,
      formContext: {
        formId: 'community_waitlist',
        formLabel: 'Community waitlist',
        placement: 'Community mentorship overlay',
        pagePath,
        offeringId: 'community',
        regionId,
      },
      payload: {
        fullName: fullName.trim(),
        phone: phoneFull,
        dialCode,
        role: role.trim() || undefined,
        linkedinUrl: linkedinUrl.trim() || undefined,
        interests: selectedInterests,
        interestsLabel,
        offeringId: 'community',
        regionId,
      },
    });

    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not join the waitlist. Please try again.');
      return;
    }

    pushAnalyticsEvent(PMS_EVENTS.WAITLIST_JOIN, {
      waitlist_type: 'community',
      offer_name: 'community',
      funnel_stage: 'waitlist',
    });
    onSuccess();
    setDone(true);
  };

  if (done) {
    return (
      <div className={cn('flex h-full flex-col justify-center', className)}>
        <p className="text-lg font-semibold text-white sm:text-xl">You&apos;re on the community waitlist.</p>
        <p className="mt-2 text-sm font-medium text-white/75 sm:text-base">
          We&apos;ll reach out when new channels and cohorts open.
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-col', className)}>
      <form onSubmit={onSubmit} aria-labelledby="community-waitlist-title" className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5 sm:space-y-3.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div>
            <p
              id="community-waitlist-title"
              className="font-heading text-lg font-bold tracking-tight text-white sm:text-xl"
            >
              Join the community waitlist
            </p>
            <p className="mt-1 text-xs font-medium text-white/85 sm:text-sm">
              Share your details and interests. We&apos;ll notify you when access opens.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="community-waitlist-name" className={labelClass}>
                Full name <span className="text-brand-orange">*</span>
              </Label>
              <Input
                id="community-waitlist-name"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  touch();
                }}
                placeholder="Your name"
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="community-waitlist-phone" className={labelClass}>
                Phone / WhatsApp <span className="text-brand-orange">*</span>
              </Label>
              <div className="flex h-9 items-stretch overflow-hidden rounded-lg border border-white/30 bg-slate-950/50 focus-within:border-brand-orange/60 focus-within:ring-3 focus-within:ring-brand-orange/30 sm:h-10">
                <Select
                  value={dialValue}
                  onValueChange={(value) => {
                    if (value) setDialValue(value);
                    touch();
                  }}
                >
                  <SelectTrigger
                    id="community-waitlist-dial"
                    aria-label="Country code"
                    className="!h-full min-h-0 w-[6.75rem] shrink-0 self-stretch rounded-none border-0 border-r border-white/20 bg-transparent px-2 py-0 text-white shadow-none focus-visible:ring-0 data-[size=default]:!h-full [&>span]:text-white"
                  >
                    <SelectValue>{formatDialPrefix(dialOption)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent
                    alignItemWithTrigger={false}
                    side="bottom"
                    align="start"
                    className="!w-auto min-w-[18rem] max-h-[min(16rem,50vh)] max-w-[min(22rem,calc(100vw-2rem))] overflow-y-auto"
                  >
                    {PMP_ROADMAP_DIAL_CODES.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-2">
                        <span className="shrink-0 font-semibold tabular-nums">{formatDialPrefix(option)}</span>
                        <span className="truncate text-slate-500">{option.label}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="community-waitlist-phone"
                  type="tel"
                  required
                  autoComplete="tel-national"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    touch();
                  }}
                  placeholder="50 123 4567"
                  className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent text-sm text-white shadow-none placeholder:text-white/45 focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="community-waitlist-email" className={labelClass}>
                Email address <span className="text-brand-orange">*</span>
              </Label>
              <Input
                id="community-waitlist-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  touch();
                }}
                placeholder="you@company.com"
                className={fieldClass}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="community-waitlist-role" className={labelClass}>
                Current role <span className="font-normal normal-case text-white/50">(optional)</span>
              </Label>
              <Input
                id="community-waitlist-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Project Coordinator"
                className={fieldClass}
              />
            </div>
          </div>

          <fieldset className="space-y-2">
            <legend className={cn(labelClass, 'mb-1.5')}>
              What are you interested in? <span className="text-brand-orange">*</span>
            </legend>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {COMMUNITY_INTERESTS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    className={interestPillClass(selected)}
                    aria-pressed={selected}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-1.5">
            <Label htmlFor="community-waitlist-linkedin" className={labelClass}>
              LinkedIn link{' '}
              <span className="font-normal normal-case text-white/50">(optional)</span>
            </Label>
            <Input
              id="community-waitlist-linkedin"
              type="url"
              inputMode="url"
              autoComplete="url"
              value={linkedinUrl}
              onChange={(e) => {
                setLinkedinUrl(e.target.value);
                touch();
              }}
              placeholder="https://linkedin.com/in/your-profile"
              className={fieldClass}
            />
          </div>

          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
          />

          {error ? <p className="text-sm font-medium text-red-300">{error}</p> : null}

          <p className="text-[10px] leading-relaxed text-white/55 sm:text-[11px]">
            By joining, you agree to our{' '}
            <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="shrink-0 pt-3">
          <Button
            type="submit"
            disabled={submitting}
            className="h-10 w-full rounded-full bg-brand-orange text-sm font-bold text-white shadow-lg hover:bg-brand-hover sm:h-11 sm:text-base"
          >
            {submitting ? 'Joining…' : CTAS.joinWaitlist}
          </Button>
        </div>
      </form>
    </div>
  );
}
