import { NextResponse } from 'next/server';
import { CIRCLE_GOOGLE_AUTH_URL } from '@/config/community';

function extractCsrfToken(html: string): string | null {
  const match = html.match(/name="csrf-token"\s+content="([^"]+)"/);
  return match?.[1] ?? null;
}

function collectSetCookies(headers: Headers): string[] {
  if (typeof headers.getSetCookie === 'function') {
    return headers.getSetCookie();
  }
  const raw = headers.get('set-cookie');
  return raw ? [raw] : [];
}

function cookieHeaderFromSetCookies(setCookies: string[]): string {
  return setCookies
    .map((entry) => entry.split(';')[0]?.trim())
    .filter(Boolean)
    .join('; ');
}

/** Starts Circle Google OAuth, then redirects the browser to accounts.google.com. */
export async function GET() {
  try {
    const signInRes = await fetch('https://login.circle.so/sign_in', {
      cache: 'no-store',
      headers: { Accept: 'text/html' },
    });

    if (!signInRes.ok) {
      return NextResponse.redirect('https://login.circle.so/sign_in', 302);
    }

    const html = await signInRes.text();
    const csrfToken = extractCsrfToken(html);
    const setCookies = collectSetCookies(signInRes.headers);

    if (!csrfToken) {
      return NextResponse.redirect('https://login.circle.so/sign_in', 302);
    }

    const googleRes = await fetch(CIRCLE_GOOGLE_AUTH_URL, {
      method: 'POST',
      cache: 'no-store',
      redirect: 'manual',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'text/html',
        Cookie: cookieHeaderFromSetCookies(setCookies),
      },
      body: new URLSearchParams({ authenticity_token: csrfToken }).toString(),
    });

    const location = googleRes.headers.get('location');
    if (googleRes.status >= 300 && googleRes.status < 400 && location) {
      return NextResponse.redirect(location, 302);
    }

    return NextResponse.redirect('https://login.circle.so/sign_in', 302);
  } catch {
    return NextResponse.redirect('https://login.circle.so/sign_in', 302);
  }
}
