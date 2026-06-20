import { CommunityCircleSignIn } from '@/components/pages/CommunityCircleSignIn';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

export const metadata = buildPhase2PageMetadata('/community/sign-in') ?? {
  title: 'Sign in to Circle | PM Structure',
  robots: { index: false, follow: false },
};

async function fetchCircleCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch('https://login.circle.so/sign_in', {
      cache: 'no-store',
      headers: { Accept: 'text/html' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/name="csrf-token"\s+content="([^"]+)"/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export default async function CommunitySignInPage({
  searchParams,
}: {
  searchParams: Promise<{ invitation_token?: string | string[]; returnTo?: string | string[] }>;
}) {
  const params = await searchParams;
  const invitationToken = Array.isArray(params.invitation_token)
    ? params.invitation_token[0]
    : params.invitation_token;
  const returnTo = Array.isArray(params.returnTo) ? params.returnTo[0] : params.returnTo;
  const csrfToken = await fetchCircleCsrfToken();

  return (
    <CommunityCircleSignIn
      csrfToken={csrfToken}
      invitationToken={invitationToken}
      returnTo={returnTo}
    />
  );
}
