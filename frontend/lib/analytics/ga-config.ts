/** GA4 Measurement ID from public env (no hardcoded production fallback in client logic). */

export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id || undefined;
}

export function isGaConfigured(): boolean {
  return Boolean(getGaMeasurementId());
}
