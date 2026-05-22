/** Public site URL (this Next app). */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3050';

/** Admin dashboard UI (separate Next app). */
export const dashboardUrl =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:5174';

export const dashboardLoginUrl = `${dashboardUrl}/login`;
