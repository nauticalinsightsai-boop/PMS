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

export type EnrollmentPaymentMode = 'seat_deposit' | 'full_tuition';
