'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import BrandIconMark from '@/components/BrandIconMark';

export type NewsletterHeroFormPlacement = 'newsletter_hero_mobile' | 'newsletter_hero_desktop';

const PLACEMENT_LABELS: Record<NewsletterHeroFormPlacement, string> = {
  newsletter_hero_mobile: 'Newsletter hub hero (mobile)',
  newsletter_hero_desktop: 'Newsletter hub hero (desktop)',
};

type Props = {
  placement: NewsletterHeroFormPlacement;
  topicOptions: string[];
  className?: string;
};

export function NewsletterHeroSubscribeForm({ placement, topicOptions, className }: Props) {
  const idPrefix = placement.replace(/[^a-z0-9]/gi, '-');
  const isMobile = placement === 'newsletter_hero_mobile';

  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errorTarget, setErrorTarget] = React.useState<'name' | 'topics' | 'submit' | null>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const topicsRef = React.useRef<HTMLFieldSetElement>(null);
  const errorRef = React.useRef<HTMLParagraphElement>(null);
  const successRef = React.useRef<HTMLParagraphElement>(null);
  React.useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);
  React.useEffect(() => {
    if (errorTarget === 'name') nameRef.current?.focus();
    if (errorTarget === 'topics') topicsRef.current?.focus();
    if (errorTarget === 'submit') errorRef.current?.focus();
  }, [errorTarget, error]);

  const shellClass = cn(
    'relative left-1/2 w-[calc(100%+0.5rem)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 sm:w-[calc(100%+2rem)] sm:max-w-[calc(100vw-3rem)]',
    'rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border shadow-2xl overflow-hidden',
    'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
    className,
  );

  const labelClass =
    'font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-[11px] sm:text-xs';
  const fieldClass = 'h-10 w-full text-sm focus-visible:ring-brand-purple/40';

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      const next = prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic];
      if (next.length > 0 && errorTarget === 'topics') {
        setError(null);
        setErrorTarget(null);
      }
      return next;
    });
  };

  const topicPillClass = (selected: boolean) =>
    cn(
      'cursor-pointer rounded-full border px-3.5 py-2 text-xs font-bold transition-colors sm:text-sm',
      selected
        ? 'border-brand-purple bg-brand-purple/10 text-slate-900 dark:text-white'
        : 'border-input text-slate-600 hover:border-brand-purple/40 dark:text-slate-400',
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      setErrorTarget('name');
      return;
    }
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic you are interested in.');
      setErrorTarget('topics');
      return;
    }
    setError(null);
    setErrorTarget(null);
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/newsletter';
    const topicsLabel = selectedTopics.join(', ');

    const res = await submitPublicInteraction({
      source: 'subscription',
      subject: `Newsletter signup: ${topicsLabel}`,
      email,
      website: honeypot,
      formContext: {
        formId: 'newsletter_hero_signup',
        formLabel: 'Newsletter hero signup',
        placement: PLACEMENT_LABELS[placement],
        pagePath,
      },
      payload: {
        fullName: fullName.trim(),
        linkedinUrl: linkedinUrl.trim() || undefined,
        topics: selectedTopics,
        topicsLabel,
        placement,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      if (res.submissionId && !res.idempotentReplay) {
        pushAnalyticsEvent('sign_up', {
          form_id: 'newsletter_hero_signup',
          page_path: pagePath,
        });
      }
      setSubmitted(true);
      setFullName('');
      setEmail('');
      setLinkedinUrl('');
      setSelectedTopics([]);
    } else {
      setError(res.error ?? 'Could not subscribe. Please try again.');
      setErrorTarget('submit');
    }
  };

  if (submitted) {
    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p ref={successRef} id={`${idPrefix}-success`} role="status" aria-live="polite" aria-atomic="true" tabIndex={-1} className="text-base font-semibold text-green-700 dark:text-green-400">
          You&apos;re subscribed. We&apos;ll send insights on your selected topics.
        </p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Browse the latest articles below or{' '}
          <Link href="/membership" className="font-bold text-brand-orange hover:underline">
            explore membership
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <form onSubmit={handleSubmit} aria-labelledby={`${idPrefix}-title`}>
        <div className="shrink-0 border-b border-slate-100 bg-gradient-to-br from-brand-purple/5 via-white to-[#57d5e2]/10 px-5 py-5 sm:px-6 sm:py-6 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <div className="flex items-start gap-3 sm:gap-4">
            {!isMobile ? (
              <div className="hidden sm:block">
                <BrandIconMark size={56} priority={placement === 'newsletter_hero_desktop'} />
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p
                id={`${idPrefix}-title`}
                className="font-heading text-lg font-bold tracking-tight text-slate-900 sm:text-xl dark:text-white"
              >
                Subscribe to the newsletter
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                Pick the topics you care about. We&apos;ll tailor what we send.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5 py-6 sm:space-y-6 sm:px-6 sm:py-7">
          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-name`} className={labelClass}>
              Full Name
            </Label>
            <Input
              id={`${idPrefix}-name`}
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                const next = e.target.value;
                setFullName(next);
                if (next.trim() && errorTarget === 'name') {
                  setError(null);
                  setErrorTarget(null);
                }
              }}
              ref={nameRef}
              aria-invalid={errorTarget === 'name' ? true : undefined}
              aria-describedby={errorTarget === 'name' ? `${idPrefix}-form-error` : undefined}
              placeholder="John Smith"
              className={fieldClass}
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-email`} className={labelClass}>
              Email Address
            </Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className={fieldClass}
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor={`${idPrefix}-linkedin`} className={labelClass}>
              LinkedIn profile{' '}
              <span className="font-semibold normal-case tracking-normal text-slate-400">(Optional)</span>
            </Label>
            <Input
              id={`${idPrefix}-linkedin`}
              type="url"
              autoComplete="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/your-profile"
              className={fieldClass}
            />
          </div>

          <fieldset
            ref={topicsRef}
            tabIndex={-1}
            className="space-y-3"
            aria-invalid={errorTarget === 'topics' ? true : undefined}
            aria-describedby={errorTarget === 'topics' ? `${idPrefix}-form-error` : undefined}
          >
            <legend id={`${idPrefix}-topics-legend`} className={cn(labelClass, 'mb-2.5')}>
              What topics are you interested in? <span className="text-brand-orange">*</span>
            </legend>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${idPrefix}-topics-legend`}>
              {topicOptions.map((topic) => {
                const selected = selectedTopics.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    className={topicPillClass(selected)}
                    aria-pressed={selected}
                    onClick={() => toggleTopic(topic)}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </fieldset>

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

          {error ? (
            <p
              ref={errorRef}
              id={`${idPrefix}-form-error`}
              role="alert"
              tabIndex={-1}
              className="text-sm font-medium text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 space-y-3 border-t border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            By subscribing, you agree to our{' '}
            <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
              Privacy Policy
            </Link>
            . Unsubscribe anytime.
          </p>
          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full bg-brand-purple text-base font-bold text-white shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90"
          >
            {submitting ? 'Subscribing…' : 'Subscribe to newsletter'}
          </Button>
        </div>
      </form>
    </div>
  );
}
