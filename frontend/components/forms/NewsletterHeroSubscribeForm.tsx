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

type NewsletterStep = 'topics' | 'contact';

const PLACEMENT_LABELS: Record<NewsletterHeroFormPlacement, string> = {
  newsletter_hero_mobile: 'Newsletter hub hero (mobile)',
  newsletter_hero_desktop: 'Newsletter hub hero (desktop)',
};

/** Second Step-1 question — keeps payload useful without lengthening contact. */
export const NEWSLETTER_READER_ROLE_OPTIONS = [
  { value: 'project_manager', label: 'Project manager' },
  { value: 'aspiring_pm', label: 'Aspiring PM' },
  { value: 'pmo_governance', label: 'PMO / governance' },
  { value: 'other', label: 'Other' },
] as const;

export type NewsletterReaderRoleValue =
  (typeof NEWSLETTER_READER_ROLE_OPTIONS)[number]['value'];

type Props = {
  placement: NewsletterHeroFormPlacement;
  topicOptions: string[];
  className?: string;
};

export function NewsletterHeroSubscribeForm({ placement, topicOptions, className }: Props) {
  const idPrefix = placement.replace(/[^a-z0-9]/gi, '-');
  const isMobile = placement === 'newsletter_hero_mobile';
  const formRef = React.useRef<HTMLFormElement>(null);

  const [currentStep, setCurrentStep] = React.useState<NewsletterStep>('topics');
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [linkedinUrl, setLinkedinUrl] = React.useState('');
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [readerRole, setReaderRole] = React.useState<NewsletterReaderRoleValue | ''>('');
  const [readerRoleOther, setReaderRoleOther] = React.useState('');
  const [honeypot, setHoneypot] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const shellClass = cn(
    'rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] border shadow-2xl overflow-hidden',
    'min-h-[420px] sm:min-h-[440px] bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800',
    'shadow-slate-900/10 dark:shadow-black/30',
    className,
  );

  const labelClass =
    'font-semibold normal-case tracking-normal text-[13px] sm:text-sm text-slate-600 dark:text-slate-300';
  const fieldClass =
    'min-h-12 h-12 w-full text-sm focus-visible:ring-brand-purple/40';

  const stepNumber = currentStep === 'topics' ? 1 : 2;
  const progressPercent = (stepNumber / 2) * 100;

  const clearError = () => setError(null);

  const topicPillClass = (selected: boolean) =>
    cn(
      'cursor-pointer rounded-full border px-3.5 py-2 text-xs font-bold transition-colors sm:text-sm',
      selected
        ? 'border-brand-purple bg-brand-purple/10 text-slate-900 dark:text-white'
        : 'border-input text-slate-600 hover:border-brand-purple/40 dark:text-slate-400',
    );

  const roleChipClass = (selected: boolean) =>
    cn(
      'flex min-h-12 w-full cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-bold transition-colors',
      selected
        ? 'border-brand-purple bg-brand-purple text-white shadow-sm'
        : 'border-input bg-white text-slate-700 hover:border-brand-purple/40 dark:bg-slate-900 dark:text-slate-300',
    );

  const toggleTopic = (topic: string) => {
    clearError();
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const moveToStep = (next: NewsletterStep) => {
    setCurrentStep(next);
    requestAnimationFrame(() => {
      const firstInput = formRef.current?.querySelector<HTMLElement>(
        `[data-step="${next}"] input, [data-step="${next}"] button`,
      );
      firstInput?.focus();
    });
  };

  const resolvedRoleLabel = (): string | undefined => {
    if (!readerRole) return undefined;
    if (readerRole === 'other') return readerRoleOther.trim() || 'Other';
    return NEWSLETTER_READER_ROLE_OPTIONS.find((o) => o.value === readerRole)?.label;
  };

  const validateTopicsStep = (): string | null => {
    if (selectedTopics.length === 0) {
      return 'Please select at least one topic you are interested in.';
    }
    if (readerRole === 'other' && !readerRoleOther.trim()) {
      return 'Please specify your role under Other.';
    }
    return null;
  };

  const validateContactStep = (): string | null => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!email.trim()) return 'Please enter your email address.';
    return null;
  };

  const handleContinue = () => {
    const issue = validateTopicsStep();
    if (issue) {
      setError(issue);
      return;
    }
    clearError();
    moveToStep('contact');
  };

  const handleBack = () => {
    clearError();
    moveToStep('topics');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 'contact') return;

    const topicsIssue = validateTopicsStep();
    if (topicsIssue) {
      setError(topicsIssue);
      moveToStep('topics');
      return;
    }
    const contactIssue = validateContactStep();
    if (contactIssue) {
      setError(contactIssue);
      return;
    }

    clearError();
    setSubmitting(true);

    const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/newsletter';
    const topicsLabel = selectedTopics.join(', ');
    const roleLabel = resolvedRoleLabel();

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
        readerRole: readerRole || undefined,
        readerRoleLabel: roleLabel,
        readerRoleOther: readerRole === 'other' ? readerRoleOther.trim() : undefined,
        placement,
      },
    });

    setSubmitting(false);
    if (res.ok) {
      pushAnalyticsEvent('sign_up', {
        form_id: 'newsletter_hero_signup',
        page_path: pagePath,
      });
      setSubmitted(true);
      setFullName('');
      setEmail('');
      setLinkedinUrl('');
      setSelectedTopics([]);
      setReaderRole('');
      setReaderRoleOther('');
      setCurrentStep('topics');
    } else {
      setError(res.error ?? 'Could not subscribe. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className={cn(shellClass, 'p-8 sm:p-10')}>
        <p className="text-base font-semibold text-green-700 dark:text-green-400">
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
      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col"
        aria-labelledby={`${idPrefix}-title`}
        aria-describedby={error ? `${idPrefix}-form-error` : undefined}
      >
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
              <div
                className="mt-3"
                role="progressbar"
                aria-valuenow={stepNumber}
                aria-valuemin={1}
                aria-valuemax={2}
                aria-label={`Step ${stepNumber} of 2`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Step {stepNumber} of 2
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-brand-purple transition-[width] duration-300 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-5 py-6 sm:gap-6 sm:px-8 sm:py-7">
          {currentStep === 'topics' ? (
            <div data-step="topics" className="flex flex-col gap-5 sm:gap-6">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend id={`${idPrefix}-topics-label`} className={cn(labelClass, 'mb-2.5')}>
                  What topics are you interested in?{' '}
                  <span className="text-brand-orange">*</span>
                </legend>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-labelledby={`${idPrefix}-topics-label`}
                >
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

              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend id={`${idPrefix}-role-label`} className={cn(labelClass, 'mb-2.5')}>
                  What best describes you?{' '}
                  <span className="font-normal text-slate-400">(optional)</span>
                </legend>
                <div
                  id={`${idPrefix}-role-options`}
                  className="grid grid-cols-2 gap-2.5"
                  role="radiogroup"
                  aria-labelledby={`${idPrefix}-role-label`}
                >
                  {NEWSLETTER_READER_ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="radio"
                      aria-checked={readerRole === opt.value}
                      className={roleChipClass(readerRole === opt.value)}
                      onClick={() => {
                        clearError();
                        if (readerRole === opt.value) {
                          setReaderRole('');
                          setReaderRoleOther('');
                          return;
                        }
                        setReaderRole(opt.value);
                        if (opt.value !== 'other') setReaderRoleOther('');
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {readerRole === 'other' ? (
                  <div className="mt-2.5 space-y-1.5">
                    <Label htmlFor={`${idPrefix}-role-other`}>Specify other role</Label>
                    <Input
                      id={`${idPrefix}-role-other`}
                      value={readerRoleOther}
                      onChange={(e) => {
                        clearError();
                        setReaderRoleOther(e.target.value);
                      }}
                      placeholder="Please specify"
                      className={fieldClass}
                      required
                    />
                  </div>
                ) : null}
              </fieldset>
            </div>
          ) : null}

          {currentStep === 'contact' ? (
            <div data-step="contact" className="flex flex-col gap-5 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-name`} className={labelClass}>
                  Full name <span className="text-brand-orange">*</span>
                </Label>
                <Input
                  id={`${idPrefix}-name`}
                  type="text"
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => {
                    clearError();
                    setFullName(e.target.value);
                  }}
                  placeholder="John Smith"
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-email`} className={labelClass}>
                  Email address <span className="text-brand-orange">*</span>
                </Label>
                <Input
                  id={`${idPrefix}-email`}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    clearError();
                    setEmail(e.target.value);
                  }}
                  placeholder="you@company.com"
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${idPrefix}-linkedin`} className={labelClass}>
                  LinkedIn profile{' '}
                  <span className="font-normal text-slate-400">(optional)</span>
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

              <p className="!mt-0 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                By subscribing, you agree to our{' '}
                <Link href="/legal/privacy" className="font-semibold text-brand-orange hover:underline">
                  Privacy Policy
                </Link>
                . Unsubscribe anytime.
              </p>
            </div>
          ) : null}

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
              id={`${idPrefix}-form-error`}
              role="alert"
              className="text-sm font-medium text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 py-5 sm:px-6 dark:border-slate-800">
          <div className="flex gap-3">
            {currentStep === 'contact' ? (
              <Button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                variant="outline"
                className="h-12 rounded-full px-6 font-bold"
              >
                Back
              </Button>
            ) : null}
            {currentStep === 'topics' ? (
              <Button
                type="button"
                onClick={handleContinue}
                className="h-12 w-full rounded-full bg-brand-purple text-base font-bold text-white shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={submitting}
                className="h-12 flex-1 rounded-full bg-brand-purple text-base font-bold text-white shadow-lg shadow-brand-purple/20 hover:bg-brand-purple/90"
              >
                {submitting ? 'Subscribing…' : 'Subscribe to newsletter'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
