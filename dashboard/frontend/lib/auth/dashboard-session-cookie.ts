import type { NextRequest, NextResponse } from 'next/server';
import { DEMO_SESSION_KEY } from '@/lib/demo-auth';
import { GW_DASHBOARD_SESSION } from '@/lib/auth/session-constants';
import { getSessionSecret, verifySignedSessionToken } from '@/lib/auth/session-token';

const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

/**
 * Only HMAC-verified `gw_dashboard_session` counts as an API admin session.
 * Demo cookies are never trusted for authorization.
 */
export function readDashboardSessionEmail(request: NextRequest): string | null {
  const secret = getSessionSecret();
  const token = request.cookies.get(GW_DASHBOARD_SESSION)?.value?.trim();
  if (token && secret) {
    const email = verifySignedSessionToken(token, secret);
    if (email) return email;
  }

  // Explicitly ignore DEMO_SESSION_KEY for auth decisions.
  void DEMO_SESSION_KEY;
  return null;
}

export function appendDashboardSessionCookie(
  response: NextResponse,
  sessionToken: string,
): void {
  const secure = process.env.NODE_ENV === 'production';
  response.cookies.set(GW_DASHBOARD_SESSION, sessionToken, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export function clearDashboardSessionCookie(response: NextResponse): void {
  response.cookies.set(GW_DASHBOARD_SESSION, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
}
