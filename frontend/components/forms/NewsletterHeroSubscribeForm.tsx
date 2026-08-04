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
import {
  formChoiceChipLayoutClass,
  formChoiceGroupClass,
} from '@/lib/form-choice-group-layout';
import {
  NEWSLETTER_SIGNUP_PREFERENCES,
  type NewsletterSignupPreference,
} from '@/lib/newsletter-signup-preferences';

export type NewsletterHeroFormPlacement = 'newsletter_hero_mobile' | 'newsletter_hero_desktop';

type NewsletterFormStep = 'topics' | 'contact';

const PLACEMENT_LABELS: Record<NewsletterHeroFormPlacement, string> = {
  newsletter_hero_mobile: 'Newsletter hub hero (mobile)',
  newsletter_hero_desktop: 'Newsletter hub hero (desktop)',
};

const NEWSLETTER_FOCUS_OPTIONS = [
  { value: 'exam_prep', label: 'Exam prep' },
  { value: 'career', label: 'Career growth' },
  { value: 'leadership', label: 'Team leadership' },
  { value: 'general', label: 'General updates' },
] as const;

type NewsletterFocusValue = (typeof NEWSLETTER_FOCUS_OPTIONS)[number]['value'];

type Props = {
  placement: NewsletterHeroFormPlacement;
  className?: string;
};

export function NewsletterHeroSubscribeForm({ placement, className }: Props) {
  const idPrefix = placement.replace(/[^a-z0-9]/gi, '-');
  const isMobile = placement === 'newsletter_hero_mobile';

  const [currentStep, setCurrentStep] = React.useState<NewsletterFormStep>('topics');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [selectedTopics, setSelectedTopics] = React.useState<NewsletterSignupPreference[]>([]);
  const [readerFocus, setReaderFocus] = React.useState<NewsletterFocusValue | ''>('');
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
    'min-h-[420px] sm:min-h-[440px]',
    'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-slate-900/10 dark:shadow-black/30',
    className,
  );

  const labelClass =
    'font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide text-[11px] sm:text-xs';
  const fieldClass = 'h-12 w-full text-sm focus-visible:ring-brand-purple/40';
  const stepNumber = currentStep === 'topics' ? 1 : 2;

  const clearError = () => {
    setError(null);
    setErrorTarget(null);
  };

  const toggleTopic = (topic: NewsletterSignupPreference) => {
    setSelectedTopics((prev) => {
      const next = prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic];
      if (next.length > 0 && errorTarget === 'topics') {
        clearError();
      }
      return next;
    });
  };

  const toggleFocus = (value: NewsletterFocusValue) => {
    setReaderFocus((prev) => (prev === value ? '' : value));
  };

  const topicPillClass = (selected: boolean) =>
    cn(
      'cursor-pointer rounded-full border px-3.5 py-2 text-xs font-bold transition-colors sm:text-sm',
      selected
        ? 'border-brand-purple bg-brand-purple/10 text-slate-900 dark:text-white'
        : 'border-input text-slate-600 hover:border-brand-purple/40 dark:text-slate-400',
    );

  const focusChipClass = (selected: boolean) =>
    cn(
      'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg border py-2.5 text-sm font-bold transition-colors',
      selected
        ? 'border-brand-purple bg-brand-purple text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-purple/40 dark:bg-slate-900 dark:text-slate-300',
    );

  const validateTopicsStep = () => {
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic you are interested in.');
      setErrorTarget('topics');
      return false;
    }
    clearError();
    return true;
  };

  const handleStepNext = () => {
    if (!validateTopicsStep()) return;
    setCurrentStep('contact');
  };

  const handleStepBack = () => {
    clearError();
    setCurrentStep('topics');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 'contact') {
      handleStepNext();
      return;
    }
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      setErrorTarget('name');
      return;
    }
    if (selectedTopics.length === 0) {
      setError('Please select at least one topic you are interested in.');
      setErrorTarget('topics');
      setCurrentStep('topics');
      return;
    }
    clearError();
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/newsletter';
    const topicsLabel = selectedTopics.join(', ');
    const focusLabel =
      NEWSLETTER_FOCUS_OPTIONS.find((option) => option.value === readerFocus)?.label ?? undefined;

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
        readerFocus: readerFocus || undefined,
        readerFocusLabel: focusLabel,
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
      setReaderFocus('');
      setCurrentStep('topics');
    } else {
      setError(res.error ?? 'Could not subscribe. Please try again.');
      setErrorTarget('submit');
    }
  };

  if (submitted) {
    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p
          ref={successRef}
          id={`${idPrefix}-success`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          tabIndex={-1}
          className="text-base font-semibold text-green-700 dark:text-green-400"
        >
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
      <form onSubmit={handleSubmit} className="flex flex-col" aria-labelledby={`${idPrefix}-title`}>
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
              <p className="mt-0.5 text-sm font-medium leading-snug text-slate-500 dark:text-slate-400">
                Pick the topics you care about. We&apos;ll tailor what we send.
              </p>
              <div
                className="mt-3"
                role="progressbar"
                aria-valuenow={stepNumber}
                aria-valuemin={1}
                aria-valuemax={2}
                aria-label={`Step ${stepNumber} of 2`}
              >
                <div className="flex gap-1.5">
                  {[1, 2].map((step) => (
                    <div
                      key={step}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all',
                        step <= stepNumber
                          ? 'bg-brand-purple'
                          : 'bg-slate-200 dark:bg-slate-700',
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Step {stepNumber} of 2
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 py-6 sm:gap-6 sm:px-6 sm:py-7">
          {currentStep === 'topics' ? (
            <div data-step="topics" className="flex flex-col gap-5 sm:gap-6">
              <fieldset
                ref={topicsRef}
                tabIndex={-1}
                className="m-0 min-w-0 space-y-3 border-0 p-0"
                aria-invalid={errorTarget === 'topics' ? true : undefined}
                aria-describedby={errorTarget === 'topics' ? `${idPrefix}-form-error` : undefined}
              >
                <legend id={`${idPrefix}-topics-legend`} className={cn(labelClass, 'mb-2.5')}>
                  Topics of interest <span className="text-brand-orange">*</span>
                </legend>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-labelledby={`${idPrefix}-topics-legend`}
                >
                  {NEWSLETTER_SIGNUP_PREFERENCES.map((topic) => {
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

              <fieldset
                className="m-0 min-w-0 space-y-3.5 border-0 p-0"
                aria-labelledby={`${idPrefix}-focus-legend`}
              >
                <legend id={`${idPrefix}-focus-legend`} className={cn(labelClass, 'mb-2.5')}>
                  Primary focus{' '}
                  <span className="font-normal normal-case tracking-normal text-slate-400">
                    (optional)
                  </span>
                </legend>
                <div
                  className={formChoiceGroupClass(NEWSLETTER_FOCUS_OPTIONS.length, 'site')}
                  role="group"
                  aria-labelledby={`${idPrefix}-focus-legend`}
                >
                  {NEWSLETTER_FOCUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={cn(
                        focusChipClass(readerFocus === option.value),
                        formChoiceChipLayoutClass(NEWSLETTER_FOCUS_OPTIONS.length),
                      )}
                      aria-pressed={readerFocus === option.value}
                      onClick={() => toggleFocus(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          ) : null}

          {currentStep === 'contact' ? (
            <div data-step="contact" className="flex flex-col gap-5 sm:gap-6">
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
                      clearError();
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
                  <span className="font-semibold normal-case tracking-normal text-slate-400">
                    (Optional)
                  </span>
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

              <p className="!mt-0 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                By subscribing, you agree to our{' '}
                <Link
                  href="/legal/privacy"
                  className="font-semibold text-brand-orange hover:underline"
                >
                  Privacy Policy
                </Link>
                . Unsubscribe anytime.
              </p>
            </div>
          ) : null}

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

        <div className="mt-auto shrink-0 space-y-3 border-t border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <div className="flex gap-3">
            {currentStep !== 'topics' ? (
              <Button
                type="button"
                onClick={handleStepBack}
                disabled={submitting}
                variant="outline"
                className="h-12 rounded-full px-6 text-base font-bold"
              >
                Back
              </Button>
            ) : null}
            {currentStep === 'contact' ? (
              <Button
                type="submit"
                disabled={submitting}
                className="h-12 flex-1 rounded-full bg-brand-purple text-base font-bold text-white shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90"
              >
                {submitting ? 'Subscribing…' : 'Subscribe to newsletter'}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleStepNext}
                disabled={submitting}
                className="h-12 flex-1 rounded-full bg-brand-purple text-base font-bold text-white shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
