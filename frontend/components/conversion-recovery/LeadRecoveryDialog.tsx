'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { resolveRecoveryCopy } from '@/lib/conversion-recovery/copy';
import type { LeadRecoveryContext, RecoveryTierId } from '@/lib/conversion-recovery/types';
import { useLeadRecovery } from '@/components/conversion-recovery/LeadRecoveryProvider';
import { trackFunnelEvent, FUNNEL_EVENTS, trackGenerateLead } from '@/lib/analytics/funnel';
import { isLeadRecoveryEnabled } from '@/lib/conversion-recovery/enabled';
import { isExcludedPath } from '@/lib/conversion-recovery/anti-annoyance';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';

const TIER_PILLS: { id: RecoveryTierId; label: string }[] = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'professional', label: 'Professional' },
  { id: 'mastery', label: 'Mastery' },
];

export function LeadRecoveryDialog() {
  const pathname = usePathname() ?? '/';
  const enabled = isLeadRecoveryEnabled();
  const { regionId } = useRegion();
  const { dialogOpen, dialogContext, dismissDialog, notifyConverted } = useLeadRecovery();

  const [fullName, setFullName] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [preferredTier, setPreferredTier] = React.useState<RecoveryTierId | ''>('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!dialogOpen) {
      setSubmitted(false);
      setError(null);
      setFullName('');
      setPhone('');
      setEmail('');
      setPreferredTier('');
      setHoneypot('');
    }
  }, [dialogOpen]);

  if (!enabled || !dialogContext || isExcludedPath(pathname)) return null;

  const copy = resolveRecoveryCopy({
    ...dialogContext,
    preferredTier: preferredTier || dialogContext.preferredTier,
  });

  const handleScheduleCall = () => {
    dismissDialog('schedule_call');
    void openCalendlyThemedPopup(getWebsiteCalendlyUrl('discovery'), {
      funnelLabel: 'lead_recovery_schedule_call',
      utm: {
        utm_source: 'pmstructure',
        utm_medium: 'lead_recovery',
        utm_campaign: dialogContext.variant ?? 'pathway_exit',
        ...(dialogContext.siteCertId ? { utm_content: dialogContext.siteCertId } : {}),
      },
      channelId: 'website',
      useProxy: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setError('Please enter your name and mobile number.');
      return;
    }
    setError(null);
    setSubmitting(true);
    const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();
    const ctx = dialogContext;

    const res = await submitPublicInteraction({
      source: 'lead_recovery',
      subject: `Lead recovery: ${ctx.variant}`,
      email: email.trim() || `${phoneFull.replace(/\D/g, '')}@whatsapp.lead`,
      website: honeypot,
      formContext: {
        formId: 'lead_recovery',
        formLabel: 'Lead recovery',
        pagePath,
        siteCertId: ctx.siteCertId,
        certName: ctx.certName,
        regionId,
        placement: ctx.variant,
        tierId: ctx.tierId,
        offeringId: ctx.offeringId,
        channelId: ctx.channelId,
      },
      payload: {
        fullName: fullName.trim(),
        phoneCountryCode: dialCode,
        phoneCountryPrefix: dialOption.prefix,
        phone: phone.trim(),
        phoneFull,
        whatsapp: phoneFull,
        email: email.trim() || undefined,
        variant: ctx.variant,
        tierId: (ctx.tierId ?? preferredTier) || undefined,
        offeringId: ctx.offeringId,
        channelId: ctx.channelId,
        parentSurface: ctx.parentSurface,
        preferredTier: preferredTier || ctx.preferredTier,
        regionId,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
      notifyConverted();
      trackFunnelEvent(FUNNEL_EVENTS.RECOVERY_SUBMITTED, {
        variant: ctx.variant,
        page_path: pagePath,
      });
      trackGenerateLead({
        source: 'lead_recovery',
        variant: ctx.variant,
        page_path: pagePath,
        tier_id: ctx.tierId,
        cert_id: ctx.siteCertId,
        offering_id: ctx.offeringId,
      });
    } else {
      setError(res.error ?? 'Submission failed. Try again.');
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => !open && dismissDialog('backdrop')}>
      <DialogContent
        className="sm:max-w-md z-[131]"
        overlayClassName="z-[130]"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">{copy.headline}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">{copy.body}</DialogDescription>
        </DialogHeader>
        {submitted ? (
          <DialogBody>
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              Thanks: we received your details and will follow up within 24 hours.
            </p>
            <Button type="button" className="mt-4 w-full" onClick={() => dismissDialog('success')}>
              Close
            </Button>
          </DialogBody>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogBody className="space-y-4 py-2">
              {copy.showTierPills ? (
                <div className="flex flex-wrap gap-2">
                  {TIER_PILLS.map((pill) => (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setPreferredTier(pill.id)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-bold transition-colors',
                        preferredTier === pill.id
                          ? 'border-brand-orange bg-brand-orange text-white'
                          : 'border-input text-slate-600 hover:border-brand-orange/40',
                      )}
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="lr-name">Full name</Label>
                <Input
                  id="lr-name"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Smith"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lr-phone">Mobile Number</Label>
                <div className="flex gap-2">
                  <Select value={dialValue} onValueChange={(v) => v && setDialValue(v)}>
                    <SelectTrigger className="w-[7.5rem] h-11">
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
                    id="lr-phone"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="50 123 4567"
                    className="h-11 flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lr-email">Email (optional)</Label>
                <Input
                  id="lr-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="h-11"
                />
              </div>
              <input
                type="text"
                name="company"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
              {error ? (
                <p className="text-sm text-destructive font-medium" role="alert">
                  {error}
                </p>
              ) : null}
              <p className="text-xs text-slate-500">
                By submitting, you agree to our{' '}
                <Link href="/legal/privacy" className="text-brand-orange font-semibold hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </DialogBody>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              {copy.showScheduleCall ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-bold border-brand-orange/30 text-brand-orange hover:bg-brand-orange/5"
                  onClick={handleScheduleCall}
                >
                  {copy.scheduleCallLabel ?? 'Schedule a call at your convenience'}
                </Button>
              ) : null}
              <Button type="submit" variant="brand" className="w-full h-11 font-bold" disabled={submitting}>
                {submitting ? 'Sending…' : copy.submitLabel}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => dismissDialog('no_thanks')}>
                No thanks
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}