/** Fail-closed community destination. External providers require a separately verified release. */
export const COMMUNITY_JOIN_FALLBACK_PATH = '/community#community-waitlist';

export type CommunityPlatform = 'circle';
export const COMMUNITY_PLATFORM: CommunityPlatform = 'circle';
export const COMMUNITY_PLATFORM_LABEL = 'Circle';
export const COMMUNITY_PRODUCT_LABEL = 'Inner Circle';

const PRODUCTION_HOSTS = new Set(['pmstructure.com', 'www.pmstructure.com']);

/**
 * Resolve a configured community destination without ever activating an unverified URL.
 * The configuration seam remains for a later provider release, but this stage accepts only
 * the first-party waitlist destination.
 */
export function resolveCommunityJoinUrl(): string {
  const configured = process.env.NEXT_PUBLIC_CIRCLE_COMMUNITY_JOIN_URL?.trim();
  if (!configured) return COMMUNITY_JOIN_FALLBACK_PATH;

  try {
    const parsed = new URL(configured, 'https://pmstructure.com');
    if (
      PRODUCTION_HOSTS.has(parsed.hostname.toLowerCase()) &&
      parsed.pathname === '/community' &&
      parsed.hash === '#community-waitlist' &&
      !parsed.search
    ) {
      return COMMUNITY_JOIN_FALLBACK_PATH;
    }
  } catch {
    // Invalid configuration is deliberately ignored.
  }
  return COMMUNITY_JOIN_FALLBACK_PATH;
}

/** @deprecated Kept for existing imports. */
export const PMS_SKOOL_COMMUNITY_JOIN_URL = resolveCommunityJoinUrl();

export function isCommunityJoinExternal(): boolean {
  return false;
}
