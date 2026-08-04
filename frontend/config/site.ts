/**
 * Public social profiles and brand ecosystem URLs for PM Structure.
 * SEO/canonical/legal entity: use @/config/pms-site (not this file).
 */
import { PMS_SITE_URL } from '@/config/pms-site';

/** Canonical production origin for this deployment (pmstructure.com). */
export const SITE_CANONICAL_ORIGIN = PMS_SITE_URL;

export const SITE_DISPLAY_NAME = 'PM Structure';

export const SITE_USERNAME = 'sh3ikhmabz';

export const SITE_HANDLE = '@PMStructure';

export const SITE_EMAIL_DOMAIN = 'pmstructure.com';

export const SITE_CONTACT_EMAIL = 'support@pmstructure.com';

export const SITE_CONTACT_MAILTO = `mailto:${SITE_CONTACT_EMAIL}`;

/** Verified public profile URLs (do not add unverified platforms). */
export const SITE_SOCIAL_PROFILE_URLS = {
  linkedin: 'https://www.linkedin.com/company/pmstructure',
  x: 'https://x.com/PMStructure',
  medium: `https://medium.com/@${SITE_USERNAME}`,
  substack: 'https://pmstructure.substack.com',
  youtube: 'https://www.youtube.com/@Sh3ikhMABZ',
  tiktok: `https://www.tiktok.com/@${SITE_USERNAME}`,
  facebook: 'https://www.facebook.com/PMStructure',
  instagram: 'https://www.instagram.com/pm_structure/',
  pinterest: 'https://www.pinterest.com/Sh3ikhMABZ/pm-structure/',
} as const;

export type SiteSocialProfileKey = keyof typeof SITE_SOCIAL_PROFILE_URLS;

/** Related brand properties in the founder ecosystem. */
export const SITE_BRAND_ECOSYSTEM = [
  { id: 'pm-structure', name: 'PM Structure', url: PMS_SITE_URL },
  { id: 'nautical-insight', name: 'Nautical Insight', url: 'https://nauticalinsight.com' },
  { id: 'infra-intelligence', name: 'InfraIntelligence', url: 'https://infraintelligence.io' },
  { id: 'global-framework', name: 'Global Framework', url: 'https://globalframework.org' },
  { id: 'founder-site', name: 'Sheikh M. Abdullah', url: 'https://sheikhmabdullah.com' },
] as const;

export type SiteBrandEcosystemId = (typeof SITE_BRAND_ECOSYSTEM)[number]['id'];

/** schema.org sameAs: site + verified public profiles. */
export const SITE_ORGANIZATION_SAME_AS: readonly string[] = [
  SITE_CANONICAL_ORIGIN,
  ...Object.values(SITE_SOCIAL_PROFILE_URLS),
];

/** Default Open Graph image path (1200×630 asset in public/). */
export const SITE_OG_IMAGE_PATH = '/og/default.png';
