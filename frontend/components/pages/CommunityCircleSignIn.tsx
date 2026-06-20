'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CIRCLE_EMAIL_SIGN_IN_URL, COMMUNITY_PLATFORM_LABEL, COMMUNITY_PRODUCT_LABEL } from '@/config/community';
import { BRAND } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const CIRCLE_GOOGLE_AUTH_ROUTE = '/community/google-auth';

type Props = {
  csrfToken: string | null;
  invitationToken?: string;
  returnTo?: string;
};

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function CommunityCircleSignIn({ csrfToken, invitationToken, returnTo }: Props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const afterLoginUrl = returnTo || (invitationToken ? `/join?invitation_token=${encodeURIComponent(invitationToken)}` : undefined);

  function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!csrfToken) {
      event.preventDefault();
      window.location.href = CIRCLE_EMAIL_SIGN_IN_URL;
      return;
    }
    setSubmitting(true);
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 px-4 py-16">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-orange">{COMMUNITY_PRODUCT_LABEL}</p>
        <h1 className="text-3xl font-bold tracking-tight">Sign in to {BRAND.name}</h1>
        <p className="text-muted-foreground">
          Access the community, billing, and admin settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Community sign-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <a
            href={submitting ? undefined : CIRCLE_GOOGLE_AUTH_ROUTE}
            tabIndex={submitting ? -1 : undefined}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-full gap-3 border-input py-5',
              submitting && 'pointer-events-none opacity-50',
            )}
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            Sign in with Google
          </a>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or email &amp; password</span>
            </div>
          </div>

          {csrfToken ? (
            <form
              action={CIRCLE_EMAIL_SIGN_IN_URL}
              method="post"
              className="space-y-4"
              onSubmit={handleEmailSubmit}
            >
              <input type="hidden" name="authenticity_token" value={csrfToken} />
              <input type="hidden" name="commit" value="Sign in" />
              {afterLoginUrl ? <input type="hidden" name="user[remember_me]" value="1" /> : null}

              <div className="space-y-2">
                <label htmlFor="circle-email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="circle-email"
                  name="user[email]"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="circle-password" className="text-sm font-medium">
                  Password
                </label>
                <input
                  id="circle-password"
                  name="user[password]"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Opening {COMMUNITY_PLATFORM_LABEL}…
                  </>
                ) : (
                  'Sign in with email'
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Could not load the secure sign-in token. Use Circle&apos;s direct login page instead.
              </p>
              <Button asChild className="w-full">
                <a href={CIRCLE_EMAIL_SIGN_IN_URL} rel="noopener noreferrer">
                  Continue to {COMMUNITY_PLATFORM_LABEL} login
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/community" className="underline underline-offset-4 hover:text-foreground">
          Back to community page
        </Link>
      </p>
    </div>
  );
}
