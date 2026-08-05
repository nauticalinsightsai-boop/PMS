import { NextRequest, NextResponse } from 'next/server';
import { COMMUNITY_JOIN_FALLBACK_PATH } from '@/config/community';

/**
 * Legacy join path. Query parameters (including old invitation tokens) are intentionally dropped.
 */
export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL(COMMUNITY_JOIN_FALLBACK_PATH, request.nextUrl.origin), 307);
}
