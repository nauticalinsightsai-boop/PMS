/** GA4 Measurement ID (public — baked into client bundle at build). */
export function getGaMeasurementId(): string | undefined {
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || undefined;
}

export function isGaConfigured(): boolean {
  return Boolean(getGaMeasurementId());
}
