/** Public site URL (this Next app). */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/** Admin dashboard UI (dev gateway → internal :5174). */
export const dashboardUrl =
  process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

export const dashboardLoginUrl = `${dashboardUrl}/login`;
