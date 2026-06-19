'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import { cn } from '@/lib/utils';

type NewsletterSubscribeFormProps = {
  formId: string;
  pagePath: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  layout?: 'inline' | 'stacked';
};

export function NewsletterSubscribeForm({
  formId,
  pagePath,
  className,
  inputClassName,
  buttonClassName,
  layout = 'inline',
}: NewsletterSubscribeFormProps) {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus('loading');
    const res = await submitPublicInteraction({
      source: 'subscription',
      subject: 'Newsletter signup',
      email: trimmed,
      formContext: { pagePath, formId },
    });
    if (res.ok) {
      pushAnalyticsEvent('sign_up', {
        form_id: formId,
        page_path: pagePath,
      });
      setStatus('done');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  const isInline = layout === 'inline';

  return (
    <div className={className}>
      <form
        onSubmit={handleSubmit}
        className={cn(isInline ? 'flex flex-col gap-3 sm:flex-row sm:items-center' : 'space-y-3')}
      >
        <Input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className={inputClassName}
          aria-label="Email address"
        />
        <Button type="submit" disabled={status === 'loading'} className={buttonClassName}>
          {status === 'loading' ? 'Subscribing…' : status === 'done' ? 'Subscribed!' : 'Subscribe'}
        </Button>
      </form>
      {status === 'error' ? (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">
          Could not subscribe. Please try again or contact us.
        </p>
      ) : null}
    </div>
  );
}
