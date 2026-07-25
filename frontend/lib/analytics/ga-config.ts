/** GA4 Measurement ID (public — baked into client bundle at build). */
export const GA4_MEASUREMENT_ID_DEFAULT = 'G-E9QRM0GQ1W';

export function getGaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || GA4_MEASUREMENT_ID_DEFAULT;
}

export function isGaConfigured(): boolean {
  return Boolean(getGaMeasurementId());
}
