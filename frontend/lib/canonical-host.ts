import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const PREFERRED_CANONICAL_HOST = 'pmstructure.com';

/** Hosts that must not be redirected (local dev, Vercel previews). */
function isRedirectExemptHost(host: string): boolean {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.localhost') ||
    host.endsWith('.vercel.app') ||
    host.endsWith('.railway.app')
  );
}

/**
 * Permanent redirect to https://pmstructure.com when host is www or protocol is http.
 * Returns null when no redirect is needed.
 */
export function canonicalHostRedirect(request: NextRequest): NextResponse | null {
  const rawHost = request.headers.get('host');
  if (!rawHost) return null;

  const host = rawHost.split(':')[0].toLowerCase();
  if (isRedirectExemptHost(host)) return null;

  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https';
  const hostOk = host === PREFERRED_CANONICAL_HOST;
  const protoOk = proto === 'https';

  if (hostOk && protoOk) return null;

  const url = request.nextUrl.clone();
  url.protocol = 'https:';
  url.host = PREFERRED_CANONICAL_HOST;

  return NextResponse.redirect(url, 301);
}
