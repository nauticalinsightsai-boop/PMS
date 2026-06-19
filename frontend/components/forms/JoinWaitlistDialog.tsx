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
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { useRegion } from '@/contexts/RegionContext';
import { useSimpleFormRecovery } from '@/components/conversion-recovery/useSimpleFormRecovery';
import {
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';
import { inferWaitlistType, PMS_EVENTS } from '@/lib/analytics/pms-events';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { CTAS } from '@/lib/brand-voice';

export type JoinWaitlistContext = {
  /** Dialog headline (product or pathway name). */
  headline: string;
  /** Email / sheet subject line. */
  subject: string;
  offeringId?: string;
  siteCertId?: string;
  tierId?: string;
  formId: string;
  formLabel: string;
  placement: string;
};

type JoinWaitlistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: JoinWaitlistContext | null;
};

export function JoinWaitlistDialog({ open, onOpenChange, context }: JoinWaitlistDialogProps) {
  const { regionId } = useRegion();
  const [fullName, setFullName] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { touch, onSuccess } = useSimpleFormRecovery({
    variant: 'waitlist_partial',
    isDone: done,
    hasPartialData: Boolean(
      fullName.trim() || phone.trim() || email.trim() || linkedinUrl.trim(),
    ),
    offeringId: context?.offeringId,
    parentSurface: context?.formId === 'store_product_waitlist' ? 'contact' : 'pathway_modal',
  });

  React.useEffect(() => {
    if (!open) {
      setDone(false);
      setError(null);
      setSubmitting(false);
      setFullName('');
      setDialValue('us');
      setPhone('');
      setEmail('');
      setLinkedinUrl('');
      setHoneypot('');
    }
  }, [open]);

  const labelClass =
    'text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 sm:text-xs';
  const fieldClass = 'h-10 w-full text-sm focus-visible:ring-brand-orange/40';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
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

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();

    const res = await submitPublicInteraction({
      source: 'waitlist',
      subject: context.subject,
      email,
      website: honeypot,
      formContext: {
        formId: context.formId,
        formLabel: context.formLabel,
        placement: context.placement,
        pagePath,
        offeringId: context.offeringId,
        siteCertId: context.siteCertId,
        tierLabel: context.tierId,
        regionId,
      },
      payload: {
        fullName: fullName.trim(),
        phone: phoneFull,
        dialCode,
        linkedinUrl: linkedinUrl.trim() || undefined,
        offeringId: context.offeringId,
        tierId: context.tierId,
        regionId,
      },
    });

    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not join the waitlist. Please try again.');
      return;
    }

    pushAnalyticsEvent(PMS_EVENTS.WAITLIST_JOIN, {
      waitlist_type: inferWaitlistType(context.offeringId, context.headline),
      offer_name: context.headline,
      funnel_stage: 'waitlist',
    });
    onSuccess();
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight pr-6">
            {done ? 'You\u2019re on the waitlist' : CTAS.joinWaitlist}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium leading-relaxed">
            {done
              ? 'Thanks — we received your details and will reach out when this resource or pathway opens.'
              : context
                ? `Join the waitlist for ${context.headline}. Share your details and our team will reach out.`
                : 'Share your details and our team will reach out.'}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <DialogBody className="pb-2">
            <Button
              type="button"
              className="h-11 w-full rounded-2xl font-bold"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </DialogBody>
        ) : (
          <form onSubmit={onSubmit}>
            <DialogBody className="space-y-4 py-1">
              <div className="space-y-2">
                <Label htmlFor="join-waitlist-name" className={labelClass}>
                  Full name
                </Label>
                <Input
                  id="join-waitlist-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    touch();
                  }}
                  placeholder="John Smith"
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="join-waitlist-phone" className={labelClass}>
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
                      id="join-waitlist-dial"
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
                    id="join-waitlist-phone"
                    type="tel"
                    required
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      touch();
                    }}
                    placeholder="555 123 4567"
                    className={cn(fieldClass, 'min-w-0 flex-1')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="join-waitlist-email" className={labelClass}>
                  Email address
                </Label>
                <Input
                  id="join-waitlist-email"
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

              <div className="space-y-2">
                <Label htmlFor="join-waitlist-linkedin" className={labelClass}>
                  LinkedIn{' '}
                  <span className="font-normal normal-case text-slate-400">(optional)</span>
                </Label>
                <Input
                  id="join-waitlist-linkedin"
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
                title="Leave blank"
              />

              {error ? (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
              ) : null}

              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                By joining, you agree to our{' '}
                <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </DialogBody>

            <div className="flex flex-col gap-2 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <Button
                type="submit"
                disabled={submitting || !context}
                variant="brand"
                className="h-11 w-full rounded-2xl font-bold"
              >
                {submitting ? 'Joining…' : CTAS.joinWaitlist}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-full text-slate-500"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
