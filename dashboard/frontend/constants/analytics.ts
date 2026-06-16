/** PM Structure GA4 property — Google Analytics home / reports. */
export const GOOGLE_ANALYTICS_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_GA_ANALYTICS_DASHBOARD_URL?.trim() ||
  'https://analytics.google.com/analytics/web/#/a394703049p541985040/reports/intelligenthome?params=_u..nav%3Dmaui';

export const GA4_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || 'G-E9QRM0GQ1W';

export const GA4_STREAM_NAME = 'PM Structure website';

export const WEBSITE_ANALYTICS_PATH = '/dashboard/site-system/analytics';
