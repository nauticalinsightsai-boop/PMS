import { NextRequest, NextResponse } from 'next/server';
import { CIRCLE_SIGN_IN_PATH } from '@/config/community';

/**
 * Legacy custom-domain join path (pmstructure.com/join?…).
 * Routes to on-site Circle sign-in with invitation params preserved.
 */
export function GET(request: NextRequest) {
  const target = new URL(CIRCLE_SIGN_IN_PATH, request.url);
  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });
  return NextResponse.redirect(target, 302);
}
