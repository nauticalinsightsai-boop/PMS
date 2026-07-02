import { resolvePublicSiteUrl } from '@pms/site-content/public-site-url';

/** Public marketing site: channel portals live at `/go/{slug}` here, not on the dashboard app. */
export const marketingSiteUrl = resolvePublicSiteUrl(
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
);

export const siteUrl = marketingSiteUrl;
