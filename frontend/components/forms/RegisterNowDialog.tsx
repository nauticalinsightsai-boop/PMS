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
import { trackGenerateLead } from '@/lib/analytics/funnel';

export type RegisterNowContext = {
  headline: string;
  subject: string;
  eventType?: string;
  eventDate?: string;
  host?: string;
  formId: string;
  formLabel: string;
  placement: string;
};

type RegisterNowDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context: RegisterNowContext | null;
};

export function RegisterNowDialog({ open, onOpenChange, context }: RegisterNowDialogProps) {
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
    parentSurface: 'register_modal',
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

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/community';
    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();

    const res = await submitPublicInteraction({
      source: 'register_modal',
      subject: context.subject,
      email,
      website: honeypot,
      formContext: {
        formId: context.formId,
        formLabel: context.formLabel,
        placement: context.placement,
        pagePath,
        regionId,
      },
      payload: {
        fullName: fullName.trim(),
        phone: phoneFull,
        dialCode,
        linkedinUrl: linkedinUrl.trim() || undefined,
        eventTitle: context.headline,
        eventType: context.eventType,
        eventDate: context.eventDate,
        host: context.host,
        regionId,
      },
    });

    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? 'Could not complete registration. Please try again.');
      return;
    }

    trackGenerateLead({
      source: 'register_modal',
      surface: 'community_event',
      event_title: context.headline,
      page_path: pagePath,
    });
    onSuccess();
    setDone(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight pr-6">
            {done ? 'Registration received' : 'Register now'}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium leading-relaxed">
            {done
              ? 'Thanks — we received your details and will reach out with session information.'
              : context
                ? `Register for ${context.headline}. Share your details and our team will reach out.`
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
                <Label htmlFor="register-now-name" className={labelClass}>
                  Full name
                </Label>
                <Input
                  id="register-now-name"
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
                <Label htmlFor="register-now-phone" className={labelClass}>
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
                      id="register-now-dial"
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
                    id="register-now-phone"
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
                <Label htmlFor="register-now-email" className={labelClass}>
                  Email address
                </Label>
                <Input
                  id="register-now-email"
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
                <Label htmlFor="register-now-linkedin" className={labelClass}>
                  LinkedIn{' '}
                  <span className="font-normal normal-case text-slate-400">(optional)</span>
                </Label>
                <Input
                  id="register-now-linkedin"
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
                By registering, you agree to our{' '}
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
                {submitting ? 'Submitting…' : 'Register now'}
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
