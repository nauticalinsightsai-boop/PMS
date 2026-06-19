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
import { offeringFormContext } from '@/lib/interactions/offering-form-context';
import { useRegion } from '@/contexts/RegionContext';
import { useSimpleFormRecovery } from '@/components/conversion-recovery/useSimpleFormRecovery';
import { inferWaitlistType, PMS_EVENTS } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import {
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';

export function WaitlistForm({ offeringId }: { offeringId?: string }) {
  const { regionId } = useRegion();
  const [fullName, setFullName] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const { touch, onSuccess } = useSimpleFormRecovery({
    variant: 'waitlist_partial',
    isDone: done,
    hasPartialData: Boolean(
      fullName.trim() || phone.trim() || email.trim() || linkedinUrl.trim(),
    ),
    offeringId,
    parentSurface: 'contact',
  });

  const labelClass = 'text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400';
  const fieldClass = 'h-10 w-full text-sm focus-visible:ring-brand-orange/40';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile number.');
      return;
    }
    setError(null);
    setSubmitting(true);

    const ctx = offeringFormContext('waitlist', 'Waitlist', offeringId, regionId);
    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();

    const res = await submitPublicInteraction({
      source: 'waitlist',
      subject: `Waitlist: ${ctx.certName ?? offeringId ?? 'general'}`,
      email,
      formContext: ctx,
      payload: {
        fullName: fullName.trim(),
        phone: phoneFull,
        dialCode,
        linkedinUrl: linkedinUrl.trim() || undefined,
        offeringId,
        regionId,
      },
    });

    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not join the waitlist. Please try again.');
      return;
    }

    pushAnalyticsEvent(PMS_EVENTS.WAITLIST_JOIN, {
      waitlist_type: inferWaitlistType(offeringId, ctx.certName),
      offer_name: ctx.certName ?? offeringId ?? 'waitlist',
      funnel_stage: 'waitlist',
    });
    onSuccess();
    setDone(true);
  };

  if (done) {
    return (
      <p className="text-sm font-medium text-green-700 dark:text-green-400">
        You&apos;re on the waitlist. We&apos;ll reach out when this pathway opens.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="wl-name" className={labelClass}>
          Full name
        </Label>
        <Input
          id="wl-name"
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            touch();
          }}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wl-phone" className={labelClass}>
          Mobile number
        </Label>
        <div className="flex gap-2">
          <Select
            value={dialValue}
            onValueChange={(value) => {
              setDialValue(value);
              touch();
            }}
          >
            <SelectTrigger
              id="wl-dial"
              className={cn(fieldClass, 'w-[7.25rem] shrink-0 px-2')}
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
            id="wl-phone"
            type="tel"
            required
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              touch();
            }}
            className={cn(fieldClass, 'min-w-0 flex-1')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="wl-email" className={labelClass}>
          Email address
        </Label>
        <Input
          id="wl-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            touch();
          }}
          className={fieldClass}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="wl-linkedin" className={labelClass}>
          LinkedIn <span className="font-normal normal-case text-slate-400">(optional)</span>
        </Label>
        <Input
          id="wl-linkedin"
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

      {error ? <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p> : null}

      <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
        By joining, you agree to our{' '}
        <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <Button type="submit" disabled={submitting} className="rounded-full bg-brand-orange">
        {submitting ? 'Joining…' : 'Join waitlist'}
      </Button>
    </form>
  );
}
