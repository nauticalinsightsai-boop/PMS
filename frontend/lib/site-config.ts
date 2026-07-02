import { resolvePublicSiteUrl } from '@pms/site-content/public-site-url';

/** Public site URL (this Next app). */
export const siteUrl = resolvePublicSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
);

/** Admin dashboard UI (same origin in production). */
export const dashboardUrl = resolvePublicSiteUrl(
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? process.env.NEXT_PUBLIC_SITE_URL,
  'http://localhost:3000',
);

export const dashboardLoginUrl = `${dashboardUrl}/admin/login`;
