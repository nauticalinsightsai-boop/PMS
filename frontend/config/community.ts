/**
 * Community platform links (Circle — custom domain join + invitation token).
 */

/** Circle invitation join URL (custom domain). */
export const CIRCLE_COMMUNITY_INVITATION_JOIN_URL =
  'https://www.pmstructure.com/join?invitation_token=fc889aa3995f03e8d4923034079eb19a07d3599a-0caba3de-aabe-4309-9177-73c221df358a';

/** Apex join handler — redirects to Circle custom domain with params preserved. */
export const COMMUNITY_JOIN_FALLBACK_PATH = '/join';

export type CommunityPlatform = 'circle';

export const COMMUNITY_PLATFORM: CommunityPlatform = 'circle';

export const COMMUNITY_PLATFORM_LABEL = 'Circle';

/** User-facing community product name shown on membership surfaces. */
export const COMMUNITY_PRODUCT_LABEL = 'Inner Circle';

/** Circle custom domain (requires www CNAME in Namecheap). */
export const CIRCLE_CUSTOM_DOMAIN_URL = 'https://www.pmstructure.com';

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

function withDefaultInvitationToken(target: URL): URL {
  if (!target.searchParams.has('invitation_token')) {
    const defaults = new URL(CIRCLE_COMMUNITY_INVITATION_JOIN_URL);
    const token = defaults.searchParams.get('invitation_token');
    if (token) target.searchParams.set('invitation_token', token);
  }
  return target;
}

/** Normalize join URLs to Circle custom-domain /join (www) with invitation token. */
function normalizeJoinUrl(url: string): string {
  if (url === '/community/sign-in' || url.startsWith('/community/sign-in?')) {
    return normalizeJoinUrl(CIRCLE_COMMUNITY_INVITATION_JOIN_URL);
  }

  try {
    const parsed = new URL(url, 'https://pmstructure.com');
    const host = parsed.hostname.toLowerCase();
    const isJoinPath = parsed.pathname.replace(/\/$/, '') === '/join';

    if (isJoinPath && (host === 'pmstructure.com' || host === 'www.pmstructure.com')) {
      const wwwJoin = withDefaultInvitationToken(
        new URL(`${parsed.pathname}${parsed.search}`, CIRCLE_CUSTOM_DOMAIN_URL),
      );
      return wwwJoin.toString();
    }

    if (url.startsWith('/join') || url.startsWith('/join?')) {
      const apexJoin = withDefaultInvitationToken(new URL(url, 'https://pmstructure.com'));
      return withDefaultInvitationToken(
        new URL(`${apexJoin.pathname}${apexJoin.search}`, CIRCLE_CUSTOM_DOMAIN_URL),
      ).toString();
    }

    // Invalid native slug — pmstructure.circle.so is not a live community URL.
    if (host.endsWith('.circle.so') && host !== 'login.circle.so') {
      return CIRCLE_COMMUNITY_INVITATION_JOIN_URL;
    }

    return url.startsWith('http') ? url : `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
}

/**
 * Resolved community join URL.
 * - Prefers NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL when set.
 * - Default: Circle invitation link on www.pmstructure.com.
 */
export function resolveCommunityJoinUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL?.trim() ||
    process.env.NEXT_PUBLIC_SKOOL_COMMUNITY_JOIN_URL?.trim();

  if (fromEnv) {
    const normalizedEnv = normalizeJoinUrl(fromEnv);
    if (
      fromEnv === '/community/sign-in' ||
      fromEnv.startsWith('/community/sign-in?') ||
      normalizedEnv === '/community/sign-in'
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
