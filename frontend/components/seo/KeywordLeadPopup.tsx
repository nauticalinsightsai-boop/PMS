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
import { getKeywordH1MetaByFromSlug, getKeywordH1MetaBySource } from '@/content/seo/keyword-h1-meta';
import { resolveKeywordLeadPopupCopy } from '@/lib/seo/keyword-lead-popup-copy';
import {
  PMP_JOB_EXPERIENCE_OPTIONS,
  PMP_ROADMAP_DIAL_CODES,
  formatDialPrefix,
  resolveDialOption,
} from '@/lib/pmp-roadmap-form-options';
import {
  formChoiceChipLayoutClass,
  formChoiceGroupClass,
  formChoiceStepBleedClass,
} from '@/lib/form-choice-group-layout';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { trackFunnelEvent, FUNNEL_EVENTS } from '@/lib/analytics/funnel';
import { trackEvent } from '@/lib/analytics/gtag';
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup';
import { getWebsiteCalendlyUrl } from '@/lib/calendly/website-events';
import { getPmsWhatsAppChatUrl } from '@/config/pms-site';
import { useRegion } from '@/contexts/RegionContext';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'pms_keyword_lead_popup_dismissed_at';
const SESSION_SHOWN_KEY = 'pms_keyword_lead_popup_shown';
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const OPEN_DELAY_MS = 700;

/**
 * Close-focus fallback when pre-open focus is BODY/unavailable:
 * 1) `[data-keyword-lead-focus-fallback]` if present on the page
 * 2) first focusable control inside `main`
 * 3) `main` landmark itself
 * 4) Base UI default (`true`)
 */
function resolveKeywordLeadCloseFocus(prior: HTMLElement | null): HTMLElement | true {
  if (
    prior &&
    prior.isConnected &&
    prior !== document.body &&
    prior !== document.documentElement
  ) {
    return prior;
  }
  const marked = document.querySelector<HTMLElement>('[data-keyword-lead-focus-fallback]');
  if (marked?.isConnected) return marked;
  const main = document.querySelector('main');
  if (main instanceof HTMLElement) {
    const interactive = main.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (interactive?.isConnected) return interactive;
    return main;
  }
  return true;
}

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
  const h1Meta =
    (fromSlug ? getKeywordH1MetaByFromSlug(fromSlug) : undefined) ??
    (pathname === '/pmp-mock-exam' ? getKeywordH1MetaBySource('/pmp-mock-exam') : undefined);
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
  const [jobExperience, setJobExperience] = React.useState('');
  const [jobExperienceOther, setJobExperienceOther] = React.useState('');
  const [jobExperienceOtherError, setJobExperienceOtherError] = React.useState<string | null>(
    null,
  );
  const [message, setMessage] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const trackedView = React.useRef(false);
  const preOpenFocusRef = React.useRef<HTMLElement | null>(null);

  const copy = resolveKeywordLeadPopupCopy({
    intent: row?.intent ?? (isMockExamDirect ? 'Lead Magnet' : 'Commercial'),
    keyword: row?.keyword ?? (isMockExamDirect ? 'pmp mock exam' : undefined),
    h1Meta,
  });

  React.useEffect(() => {
    if (!shouldConsider) return;
    if (wasRecentlyDismissed() || wasShownThisSession()) return;

    const timer = window.setTimeout(() => {
      const active = document.activeElement;
      preOpenFocusRef.current =
        active instanceof HTMLElement &&
        active !== document.body &&
        active !== document.documentElement
          ? active
          : null;
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
    if (!jobExperience) {
      setError('Please select your years of experience.');
      return;
    }
    if (jobExperience === 'other' && !jobExperienceOther.trim()) {
      setError(null);
      setJobExperienceOtherError('Specify other experience.');
      return;
    }
    setError(null);
    setJobExperienceOtherError(null);
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

    const dialCode = dialOption.code;
    const phoneFull = `${dialCode} ${phone.trim()}`.trim();
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
        phoneCountryCode: dialCode,
        phoneCountryPrefix: dialOption.prefix,
        phone: phone.trim(),
        phoneFull,
        whatsapp: phoneFull,
        jobExperienceYears: jobExperience,
        jobExperienceOther:
          jobExperience === 'other' ? jobExperienceOther.trim() : undefined,
        message: message.trim() || undefined,
        keyword: row?.keyword,
        intent: row?.intent,
        fromSlug: fromSlug || undefined,
        contentType: row?.contentType,
        formId: 'keyword_lead_popup',
        formLabel: 'Keyword lead popup',
      },
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
      markDismissed();
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
      <DialogContent
        className="sm:max-w-md z-[141]"
        overlayClassName="z-[140]"
        finalFocus={() => resolveKeywordLeadCloseFocus(preOpenFocusRef.current)}
      >
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
          <form className="min-h-0 flex flex-1 flex-col" onSubmit={handleSubmit}>
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
              <fieldset className="space-y-1.5">
                <legend className="text-sm font-medium leading-none">
                  Years of experience <span className="text-brand-orange">*</span>
                </legend>
                <div className={formChoiceStepBleedClass('site')}>
                  <div
                    className={formChoiceGroupClass(PMP_JOB_EXPERIENCE_OPTIONS.length, 'site')}
                    role="group"
                    aria-label="Years of experience"
                  >
                    {PMP_JOB_EXPERIENCE_OPTIONS.map((opt) => {
                      const selected = jobExperience === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setJobExperience(opt.value);
                            if (opt.value !== 'other') {
                              setJobExperienceOther('');
                              setJobExperienceOtherError(null);
                            }
                            setError(null);
                          }}
                          className={cn(
                            'min-h-11 rounded-lg border text-xs font-medium transition-colors',
                            formChoiceChipLayoutClass(PMP_JOB_EXPERIENCE_OPTIONS.length),
                            selected
                              ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                              : 'border-border bg-background text-foreground hover:bg-muted',
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </fieldset>
              {jobExperience === 'other' ? (
                <div className="space-y-1.5">
                  <Label htmlFor="kw-lead-experience-other">
                    Specify other experience <span className="text-brand-orange">*</span>
                  </Label>
                  <Input
                    id="kw-lead-experience-other"
                    value={jobExperienceOther}
                    onChange={(e) => {
                      setJobExperienceOther(e.target.value);
                      if (jobExperienceOtherError) setJobExperienceOtherError(null);
                    }}
                    onInvalid={() =>
                      setJobExperienceOtherError('Specify other experience.')
                    }
                    required
                    aria-required="true"
                    aria-invalid={jobExperienceOtherError ? 'true' : 'false'}
                    aria-describedby={
                      jobExperienceOtherError
                        ? 'kw-lead-experience-other-error'
                        : undefined
                    }
                  />
                  {jobExperienceOtherError ? (
                    <p
                      id="kw-lead-experience-other-error"
                      className="text-sm text-destructive"
                      role="alert"
                    >
                      {jobExperienceOtherError}
                    </p>
                  ) : null}
                </div>
              ) : null}
              {jobExperience ? (
                <div className="space-y-1.5">
                  <Label htmlFor="kw-lead-message">
                    Message <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="kw-lead-message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="What do you want help with?"
                  />
                </div>
              ) : null}
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
              <div className="grid w-full grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full border-transparent bg-[#25D366] text-white hover:bg-[#20bd5a] hover:text-white focus-visible:border-[#25D366] focus-visible:ring-[#25D366]/40"
                  onClick={handleWhatsApp}
                >
                  {copy.whatsappLabel}
                </Button>
                <Button
                  type="button"
                  variant="brand"
                  className="w-full"
                  onClick={handleSchedule}
                >
                  {copy.scheduleLabel}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
