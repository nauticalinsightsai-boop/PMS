/**
 * Central public identity & brand configuration — single source of truth.
 * Use for metadata defaults, JSON-LD, footer/social links, and SEO fallbacks.
 */

/** Verified canonical production site (no trailing slash). */
export const SITE_CANONICAL_ORIGIN = 'https://sheikhmabdullah.com';

/** Legacy brand domain (redirects to canonical via middleware). */
export const SITE_LEGACY_BRAND_ORIGIN = 'https://sh3ikhmabz.com';

export const SITE_DISPLAY_NAME = 'Sheikh M. Abdullah';

export const SITE_USERNAME = 'sh3ikhmabz';

export const SITE_HANDLE = '@sh3ikhmabz';

export const SITE_POSITIONING =
  'Naval Architect | Offshore Project Manager | Marine & Floating Infrastructure | EPC Delivery | AI-Enabled Infrastructure Workflows';

export const SITE_DESCRIPTION =
  'Sheikh M. Abdullah is a naval architect, offshore project manager, and floating infrastructure strategist focused on marine EPC delivery, class interface, AI-enabled infrastructure workflows, project governance, and strategic education.';

export const SITE_ALTERNATE_NAMES = [
  'Sheikh Abdullah',
  'Sheikh MABZ',
  SITE_HANDLE,
] as const;

export const SITE_EMAIL_DOMAIN = 'sh3ikhmabz.com';

export const SITE_CONTACT_EMAIL = `contact@${SITE_EMAIL_DOMAIN}`;

export const SITE_CONTACT_MAILTO = `mailto:${SITE_CONTACT_EMAIL}`;

/** Verified + existing public profile URLs (do not add unverified platforms here). */
export const SITE_SOCIAL_PROFILE_URLS = {
  linkedin: `https://www.linkedin.com/in/${SITE_USERNAME}`,
  x: `https://x.com/${SITE_USERNAME}`,
  medium: `https://medium.com/@${SITE_USERNAME}`,
  substack: `https://${SITE_USERNAME}.substack.com`,
  youtube: `https://www.youtube.com/@${SITE_USERNAME}`,
  tiktok: `https://www.tiktok.com/@${SITE_USERNAME}`,
  facebook: `https://www.facebook.com/${SITE_USERNAME}`,
  instagram: `https://www.instagram.com/${SITE_USERNAME}/`,
  pinterest: `https://www.pinterest.com/${SITE_USERNAME}/`,
} as const;

export type SiteSocialProfileKey = keyof typeof SITE_SOCIAL_PROFILE_URLS;

/** Insight / education brand properties (verified ecosystem). */
export const SITE_BRAND_ECOSYSTEM = [
  { id: 'pm-structure', name: 'PM Structure', url: 'https://pmstructure.com' },
  { id: 'nautical-insight', name: 'Nautical Insight', url: 'https://nauticalinsight.com' },
  { id: 'infra-intelligence', name: 'InfraIntelligence', url: 'https://infraintelligence.io' },
  { id: 'global-framework', name: 'Global Framework', url: 'https://globalframework.org' },
] as const;

export type SiteBrandEcosystemId = (typeof SITE_BRAND_ECOSYSTEM)[number]['id'];

/** schema.org sameAs — canonical site, legacy alias, and public profiles. */
export const SITE_ORGANIZATION_SAME_AS: readonly string[] = [
  SITE_CANONICAL_ORIGIN,
  SITE_LEGACY_BRAND_ORIGIN,
  ...Object.values(SITE_SOCIAL_PROFILE_URLS),
];

/** Best available Open Graph / Twitter card image (1200×630 asset not yet in repo). */
// TODO: Add /public/og-default.jpg (1200×630) and set SITE_OG_IMAGE_PATH to '/og-default.jpg'.
export const SITE_OG_IMAGE_PATH = '/brand/logo-sa-dark.png';

/** Homepage — verified SEO / Open Graph copy. */
export const SITE_HOME_SEO = {
  title:
    'Sheikh M. Abdullah | Naval Architect, Offshore Project Manager & Floating Infrastructure Strategist',
  description:
    'Official website of Sheikh M. Abdullah, naval architect and offshore project manager focused on floating infrastructure, marine EPC delivery, class interface, AI-enabled infrastructure workflows, and strategic education.',
  openGraphTitle: 'Sheikh M. Abdullah | Marine, Floating Infrastructure & AI-Enabled Delivery',
  openGraphDescription:
    'Explore the work, advisory ecosystem, insights, and brand platforms of Sheikh M. Abdullah across naval architecture, offshore project management, floating infrastructure, project governance, and AI-enabled infrastructure systems.',
  canonicalUrl: SITE_CANONICAL_ORIGIN,
} as const;

/** Default SEO / Open Graph identity fields (merged into CMS seo-config when unset). */
export const SITE_SEO_DEFAULTS = {
  siteName: SITE_DISPLAY_NAME,
  organizationName: SITE_DISPLAY_NAME,
  defaultTitle: SITE_HOME_SEO.title,
  titleTemplate: `%s | ${SITE_DISPLAY_NAME}`,
  defaultDescription: SITE_HOME_SEO.description,
  defaultOpenGraphTitle: SITE_HOME_SEO.openGraphTitle,
  defaultOpenGraphDescription: SITE_HOME_SEO.openGraphDescription,
  defaultOgImage: SITE_OG_IMAGE_PATH,
  defaultKeywords: [
    SITE_DISPLAY_NAME,
    'Floating Infrastructure',
    'Naval Architecture',
    'Offshore Project Management',
    'Marine EPC Delivery',
    'AI-Enabled Infrastructure',
  ],
  twitterHandle: SITE_USERNAME,
  organizationSameAs: [...SITE_ORGANIZATION_SAME_AS],
} as const;

/** Person schema helpers — aligned with canonical JSON-LD in site-person.ts */
export const SITE_PERSON_SCHEMA = {
  name: 'Sheikh M. Abdullah',
  alternateName: ['Sh3ikhMABZ', 'sh3ikhmabz', 'Sheikh Abdullah'],
  jobTitle: 'Naval Architect and Offshore Project Manager',
  description: SITE_DESCRIPTION,
  sameAs: [
    SITE_SOCIAL_PROFILE_URLS.linkedin,
    SITE_SOCIAL_PROFILE_URLS.x,
  ],
  knowsAbout: [
    'Naval Architecture',
    'Offshore Project Management',
    'Floating Infrastructure',
    'Marine EPC Delivery',
    'Class Interface',
    'DNV and Bureau Veritas Coordination',
    'Project Governance',
    'AI-Enabled Infrastructure Workflows',
    'Digital Twins',
    'Strategic Infrastructure Analysis',
  ],
} as const;
