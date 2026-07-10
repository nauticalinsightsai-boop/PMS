'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getKeywordRedirectRowByFromSlug,
  isKeywordLeadHubPath,
} from '@/content/seo/keyword-redirect-map';
import { resolveKeywordLeadPopupCopy } from '@/lib/seo/keyword-lead-popup-copy';
import {
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { trackFunnelEvent, FUNNEL_EVENTS, trackGenerateLead } from '@/lib/analytics/funnel';
import { trackEvent } from '@/lib/analytics/gtag';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';
import { getPmsWhatsAppChatUrl } from '@/config/pms-site';
import { useRegion } from '@/contexts/RegionContext';

const STORAGE_KEY = 'pms_keyword_lead_popup_dismissed_at';
const SESSION_SHOWN_KEY = 'pms_keyword_lead_popup_shown';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OPEN_DELAY_MS = 700;

function wasRecentlyDismissed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function markSessionShown(): void {
  try {
    sessionStorage.setItem(SESSION_SHOWN_KEY, '1');
  } catch {
    /* ignore */
  }
}

function wasShownThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_SHOWN_KEY) === '1';
  } catch {
    return false;
  }
}

export function KeywordLeadPopup() {
  const pathname = usePathname() ?? '/';
  const searchParams = useSearchParams();
  const { regionId } = useRegion();

  const fromSlug = (searchParams.get('from') ?? '').trim();
  const row = fromSlug ? getKeywordRedirectRowByFromSlug(fromSlug) : undefined;
  const onHub = isKeywordLeadHubPath(pathname);
  const isMockExamDirect = pathname === '/pmp-mock-exam' && !fromSlug;

  const shouldConsider =
    onHub && (Boolean(row) || isMockExamDirect);

  const [open, setOpen] = React.useState(false);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [dialValue, setDialValue] = React.useState('us');
  const dialOption = resolveDialOption(dialValue);
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const trackedView = React.useRef(false);

  const copy = resolveKeywordLeadPopupCopy({
    intent: row?.intent ?? (isMockExamDirect ? 'Lead Magnet' : 'Commercial'),
    keyword: row?.keyword ?? (isMockExamDirect ? 'pmp mock exam' : undefined),
  });

  React.useEffect(() => {
    if (!shouldConsider) return;
    if (wasRecentlyDismissed() || wasShownThisSession()) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      markSessionShown();
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [shouldConsider, fromSlug, pathname]);

  React.useEffect(() => {
    if (!open || trackedView.current) return;
    trackedView.current = true;
    trackFunnelEvent(FUNNEL_EVENTS.RECOVERY_SHOWN, {
      surface: 'keyword_lead_popup',
      from_slug: fromSlug || null,
      keyword: row?.keyword ?? null,
      intent: row?.intent ?? (isMockExamDirect ? 'Lead Magnet' : null),
      page_path: pathname,
    });
    trackEvent('popup_view', {
      surface: 'keyword_lead_popup',
      from_slug: fromSlug || null,
      keyword: row?.keyword ?? null,
    });
  }, [open, fromSlug, row?.keyword, row?.intent, isMockExamDirect, pathname]);

  const dismiss = (reason: string) => {
    setOpen(false);
    markDismissed();
    trackFunnelEvent(FUNNEL_EVENTS.RECOVERY_DISMISSED, {
      surface: 'keyword_lead_popup',
      reason,
      from_slug: fromSlug || null,
    });
  };

  const handleSchedule = () => {
    trackFunnelEvent(FUNNEL_EVENTS.CTA_CLICK, {
      surface: 'keyword_lead_popup',
      cta: 'schedule_meeting',
      from_slug: fromSlug || null,
    });
    trackEvent('booking_click', {
      surface: 'keyword_lead_popup',
      from_slug: fromSlug || null,
    });
    dismiss('schedule_meeting');
    void openCalendlyThemedPopup(getWebsiteCalendlyUrl('discovery'), {
      funnelLabel: 'keyword_lead_schedule',
      utm: {
        utm_source: 'pmstructure',
        utm_medium: 'keyword_lead_popup',
        utm_campaign: fromSlug || 'hub_direct',
        ...(row?.keyword ? { utm_content: row.keyword.replace(/\s+/g, '-') } : {}),
      },
      channelId: 'website',
      useProxy: true,
    });
  };

  const handleWhatsApp = () => {
    trackFunnelEvent(FUNNEL_EVENTS.CTA_CLICK, {
      surface: 'keyword_lead_popup',
      cta: 'whatsapp',
      from_slug: fromSlug || null,
    });
    trackEvent('whatsapp_click', {
      surface: 'keyword_lead_popup',
      from_slug: fromSlug || null,
    });
    dismiss('whatsapp');
    window.open(getPmsWhatsAppChatUrl(copy.whatsappMessage), '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError('Please enter your name, email, and phone number.');
      return;
    }
    setError(null);
    setSubmitting(true);
    trackFunnelEvent(FUNNEL_EVENTS.CTA_CLICK, {
      surface: 'keyword_lead_popup',
      cta: 'form_start',
      from_slug: fromSlug || null,
    });
    trackEvent('form_start', {
      surface: 'keyword_lead_popup',
      from_slug: fromSlug || null,
    });

    const phoneFull = `${dialOption.code} ${phone.trim()}`.trim();
    const pagePath = typeof window !== 'undefined' ? window.location.pathname : pathname;

    const res = await submitPublicInteraction({
      source: 'pmp_roadmap_lead',
      subject: `Keyword lead: ${row?.keyword ?? (fromSlug || 'hub')}`,
      email: email.trim(),
      website: honeypot,
      formContext: {
        formId: 'keyword_lead_popup',
        formLabel: 'Keyword lead popup',
        pagePath,
        placement: 'keyword_lead_popup',
        regionId,
      },
      payload: {
        fullName: fullName.trim(),
        phone: phoneFull,
        message: message.trim() || undefined,
        keyword: row?.keyword,
        intent: row?.intent,
        fromSlug: fromSlug || undefined,
        contentType: row?.contentType,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
      markDismissed();
      trackGenerateLead({
        surface: 'keyword_lead_popup',
        from_slug: fromSlug || null,
        keyword: row?.keyword ?? null,
      });
      trackFunnelEvent(FUNNEL_EVENTS.RECOVERY_SUBMITTED, {
        surface: 'keyword_lead_popup',
        from_slug: fromSlug || null,
      });
    } else {
      setError(res.error ?? 'Submission failed. Try again.');
    }
  };

  if (!shouldConsider) return null;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && dismiss('backdrop')}>
      <DialogContent className="sm:max-w-md z-[141]" overlayClassName="z-[140]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">{copy.headline}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">{copy.body}</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <DialogBody>
            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
              Thanks - we received your details and a mentor will follow up soon.
            </p>
            <Button type="button" className="mt-4 w-full" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogBody>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogBody className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="kw-lead-name">Full name</Label>
                <Input
                  id="kw-lead-name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kw-lead-email">Email</Label>
                <Input
                  id="kw-lead-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kw-lead-phone">Phone</Label>
                <div className="flex gap-2">
                  <Select value={dialValue} onValueChange={(v) => v && setDialValue(v)}>
                    <SelectTrigger className="w-[7.5rem] shrink-0">
                      <SelectValue>{formatDialPrefix(dialOption)}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {PMP_ROADMAP_DIAL_CODES.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {formatDialPrefix(opt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="kw-lead-phone"
                    type="tel"
                    autoComplete="tel-national"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="min-w-0 flex-1"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kw-lead-message">Message</Label>
                <Textarea
                  id="kw-lead-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What do you want help with?"
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
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <p className="text-[11px] leading-snug text-muted-foreground">
                Independent exam-prep guidance - not PMI endorsement. See{' '}
                <Link href="/legal/privacy" className="underline underline-offset-2">
                  Privacy
                </Link>
                .
              </p>
            </DialogBody>
            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Sending…' : copy.submitLabel}
              </Button>
              <Button type="button" variant="secondary" className="w-full" onClick={handleWhatsApp}>
                {copy.whatsappLabel}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleSchedule}>
                {copy.scheduleLabel}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
