/**
 * Community platform links (Circle — on-site sign-in + custom domain when DNS is ready).
 */

/** Circle invitation join URL (custom domain). Normalized to on-site sign-in with token preserved. */
export const CIRCLE_COMMUNITY_INVITATION_JOIN_URL =
  'https://www.pmstructure.com/join?invitation_token=fc889aa3995f03e8d4923034079eb19a07d3599a-0caba3de-aabe-4309-9177-73c221df358a';

/** Internal fallback when no external invite URL is configured. */
export const COMMUNITY_JOIN_FALLBACK_PATH = '/community/sign-in';

export type CommunityPlatform = 'circle';

export const COMMUNITY_PLATFORM: CommunityPlatform = 'circle';

export const COMMUNITY_PLATFORM_LABEL = 'Circle';

/** User-facing community product name shown on sign-in and membership surfaces. */
export const COMMUNITY_PRODUCT_LABEL = 'Inner Circle';

/** Circle custom domain (requires www CNAME in Namecheap). */
export const CIRCLE_CUSTOM_DOMAIN_URL = 'https://www.pmstructure.com';

/** On-site sign-in bridge (works in Cursor browser and while www DNS is missing). */
export const CIRCLE_SIGN_IN_PATH = '/community/sign-in';

/** Circle hosted email/password sign-in (form POST target). */
export const CIRCLE_EMAIL_SIGN_IN_URL = 'https://login.circle.so/sign_in';

/** Circle Google OAuth (form POST target — use for Gmail-linked accounts). */
export const CIRCLE_GOOGLE_AUTH_URL =
  'https://login.circle.so/users/auth/google?community_id=undefined';

const PRODUCTION_HOST = 'pmstructure.com';

function siteHostname(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).hostname.toLowerCase();
    } catch {
      // fall through
    }
  }
  return PRODUCTION_HOST;
}

function appendQueryParams(base: string, source: URL): string {
  const target = new URL(base, 'https://pmstructure.com');
  source.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });
  return `${target.pathname}${target.search}`;
}

/** Rewrite legacy custom-domain /join links to on-site sign-in. */
function normalizeJoinUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const isCustomJoin =
      (host === 'pmstructure.com' || host === 'www.pmstructure.com') &&
      parsed.pathname.replace(/\/$/, '') === '/join';

    if (isCustomJoin) {
      return appendQueryParams(CIRCLE_SIGN_IN_PATH, parsed);
    }

    // Invalid native slug — pmstructure.circle.so is not a live community URL.
    if (host.endsWith('.circle.so') && host !== 'login.circle.so') {
      return appendQueryParams(CIRCLE_SIGN_IN_PATH, parsed);
    }

    return url;
  } catch {
    return url;
  }
}

/**
 * Resolved community join URL.
 * - Prefers NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL when set.
 * - Legacy pmstructure.com/join → /community/sign-in (on-site).
 * - Default: Circle invitation link with token.
 */
export function resolveCommunityJoinUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL?.trim() ||
    process.env.NEXT_PUBLIC_SKOOL_COMMUNITY_JOIN_URL?.trim();

  if (fromEnv) {
    const normalizedEnv = normalizeJoinUrl(fromEnv);
    // Legacy env pointed at sign-in without invitation — use default invite link.
    if (
      normalizedEnv === CIRCLE_SIGN_IN_PATH ||
      fromEnv === CIRCLE_SIGN_IN_PATH ||
      fromEnv === COMMUNITY_JOIN_FALLBACK_PATH
    ) {
      return normalizeJoinUrl(CIRCLE_COMMUNITY_INVITATION_JOIN_URL);
    }
    return normalizedEnv;
  }

  return normalizeJoinUrl(CIRCLE_COMMUNITY_INVITATION_JOIN_URL);
}

/** @deprecated Prefer {@link resolveCommunityJoinUrl} — kept for existing imports. */
export const PMS_SKOOL_COMMUNITY_JOIN_URL = resolveCommunityJoinUrl();

/** Whether the join CTA points off-site. */
export function isCommunityJoinExternal(): boolean {
  const url = resolveCommunityJoinUrl();
  if (!url.startsWith('http')) return false;
  try {
    const joinHost = new URL(url).hostname.toLowerCase();
    return joinHost !== siteHostname();
  } catch {
    return url.startsWith('http');
  }
}
