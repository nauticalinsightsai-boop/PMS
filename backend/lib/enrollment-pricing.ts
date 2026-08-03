/** Seat reservation deposit = 25% of regional pathway tuition (USD cents). */
export const SEAT_DEPOSIT_FRACTION = 0.25;

export const STRIPE_MIN_USD_CENTS = 50;

export function resolveSeatDepositUsdCents(fullUsdCents: number): number {
  const deposit = Math.round(fullUsdCents * SEAT_DEPOSIT_FRACTION);
  return Math.max(deposit, STRIPE_MIN_USD_CENTS);
}

export function resolveSeatDepositUsd(fullUsdCents: number): number {
  return resolveSeatDepositUsdCents(fullUsdCents) / 100;
}

export type EnrollmentPaymentMode =
  | 'seat_deposit'
  | 'full_tuition'
  | 'mentor_led'
  | 'self_paced';

export function isDeliveryFullChargeMode(mode: EnrollmentPaymentMode): boolean {
  return mode === 'mentor_led' || mode === 'self_paced' || mode === 'full_tuition';
}

export function parseEnrollmentPaymentMode(
  raw: unknown,
  tierId?: string | null,
): EnrollmentPaymentMode {
  if (tierId === 'foundation') return 'self_paced';
  if (raw === 'self_paced') return 'self_paced';
  if (raw === 'mentor_led') return 'mentor_led';
  if (raw === 'full_tuition') return 'full_tuition';
  if (raw === 'seat_deposit') return 'seat_deposit';
  // Professional default: mentor-led full charge (no deposit)
  if (tierId === 'professional') return 'mentor_led';
  return 'seat_deposit';
}
