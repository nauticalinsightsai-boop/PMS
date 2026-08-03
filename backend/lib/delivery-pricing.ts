/**
 * Backend mirror of frontend/lib/enrollment/delivery-pricing.ts for checkout.
 * Keep FX + charm rules in sync with the frontend module.
 */

export type EnrollmentDeliveryMode = 'mentor_led' | 'self_paced';

const FX: Record<string, number> = {
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  BHD: 0.376,
  KWD: 0.307,
  OMR: 0.385,
  PKR: 278,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
};

export function nearestCharm50(n: number): number {
  if (!Number.isFinite(n) || n <= 49) return 49;
  const k = Math.round((n - 49) / 50);
  return Math.max(49, k * 50 + 49);
}

/** Existing fallback for GCC catalogue values not explicitly locked by the owner table. */
export function ceilCharm99(n: number): number {
  if (!Number.isFinite(n) || n <= 99) return 99;
  return Math.ceil((n + 1) / 100) * 100 - 1;
}

export function charm999(n: number): number {
  if (!Number.isFinite(n) || n <= 999) return 999;
  return Math.ceil((n + 1) / 1000) * 1000 - 1;
}

export function deriveFoundationUsd(currentGlobalUsd: number): number {
  return nearestCharm50(currentGlobalUsd * 0.3);
}

export function deriveSelfPacedUsd(mentorGlobalUsd: number): number {
  return nearestCharm50(mentorGlobalUsd * 0.5);
}

export function isDeliveryFullChargeMode(mode: string | null | undefined): boolean {
  return mode === 'mentor_led' || mode === 'self_paced';
}

export function parseEnrollmentDeliveryMode(
  raw: unknown,
  tierId?: string | null,
): EnrollmentDeliveryMode {
  if (tierId === 'foundation') return 'self_paced';
  return raw === 'self_paced' ? 'self_paced' : 'mentor_led';
}

/** Re-export FX for tests / scripts. */
export const DELIVERY_FX_PER_USD = FX;
