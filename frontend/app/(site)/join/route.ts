import { NextRequest, NextResponse } from 'next/server';
import { CIRCLE_COMMUNITY_INVITATION_JOIN_URL, CIRCLE_CUSTOM_DOMAIN_URL } from '@/config/community';

/**
 * Apex join path (pmstructure.com/join?…).
 * Redirects to Circle custom domain with invitation params preserved.
 */
export function GET(request: NextRequest) {
  const target = new URL('/join', CIRCLE_CUSTOM_DOMAIN_URL);

  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });

  if (!target.searchParams.has('invitation_token')) {
    const defaults = new URL(CIRCLE_COMMUNITY_INVITATION_JOIN_URL);
    const token = defaults.searchParams.get('invitation_token');
    if (token) target.searchParams.set('invitation_token', token);
  }

  return NextResponse.redirect(target.toString(), 302);
}
