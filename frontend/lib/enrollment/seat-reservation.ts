import { parseDisplayAmount } from '@/lib/price-parser';
import { currencyCodeFromDisplay } from '@/lib/regional-fx-rates';

/** Legacy Stripe Payment Link (unused by embedded enroll flow). */
export const SEAT_DEPOSIT_STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_SEAT_DEPOSIT_PAYMENT_LINK?.trim() ||
  'https://buy.stripe.com/bJe14m43t9MGcrlg980sU00';

/** Seat hold duration shown on the enrollment page. */
export const SEAT_RESERVATION_HOLD_MS = 15 * 60 * 1000;

/** Seat reservation deposit = 25% of pathway tuition. */
export const SEAT_DEPOSIT_FRACTION = 0.25;

export type EnrollmentPaymentMode =
  | 'seat_deposit'
  | 'full_tuition'
  | 'mentor_led'
  | 'self_paced';

export function isDeliveryMode(
  mode: EnrollmentPaymentMode,
): mode is 'mentor_led' | 'self_paced' {
  return mode === 'mentor_led' || mode === 'self_paced';
}

export function resolveSeatDepositUsdCents(fullUsdCents: number | null | undefined): number | null {
  if (fullUsdCents == null || fullUsdCents <= 0) return null;
  const deposit = Math.round(fullUsdCents * SEAT_DEPOSIT_FRACTION);
  return Math.max(deposit, 50);
}

export function resolveSeatDepositUsd(fullUsdCents: number | null | undefined): number | null {
  const cents = resolveSeatDepositUsdCents(fullUsdCents);
  return cents == null ? null : cents / 100;
}

export function formatEnrollmentUsd(amount: number): string {
  const hasCents = Math.round(amount * 100) % 100 !== 0;
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  })}`;
}

/** @deprecated Use formatEnrollmentUsd */
export function formatSeatDeposit(amount: number): string {
  return formatEnrollmentUsd(amount);
}

export function seatHoldStorageKey(offeringId: string): string {
  return `pms-seat-hold-${offeringId}`;
}

export function canOfferFullTuitionOnEnroll(
  status: string,
  activeDisplay: string | null | undefined,
): boolean {
  if (!activeDisplay?.trim()) return false;
  return status !== 'waitlist' && status !== 'hidden';
}

function toMinorUnits(majorAmount: number, currencyCode: string): number {
  const currency = currencyCode.toLowerCase();
  return Math.round(majorAmount * 100);
}

function minorToMajor(unitAmount: number): number {
  return unitAmount / 100;
}

/** Deposit amount formatted in the same currency as the regional tuition display. */
export function formatRegionalDepositDisplay(
  activeDisplay: string | null | undefined,
  fraction = SEAT_DEPOSIT_FRACTION,
): string | null {
  if (!activeDisplay) return null;
  const major = parseDisplayAmount(activeDisplay);
  if (major == null) return null;
  const code = currencyCodeFromDisplay(activeDisplay) ?? 'USD';
  const fullMinor = toMinorUnits(major, code);
  const depositMinor = Math.max(Math.round(fullMinor * fraction), 1);
  const depositMajor = minorToMajor(depositMinor);

  const match = activeDisplay.match(/^(.*?)([\d][\d,]*(?:\.\d{1,2})?)(.*)$/);
  if (!match) return String(depositMajor);
  const [, prefix, numStr, suffix] = match;
  const hasDecimals = numStr.includes('.') || !Number.isInteger(depositMajor);
  const formatted = hasDecimals
    ? depositMajor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : Math.round(depositMajor).toLocaleString('en-US');
  return `${prefix}${formatted}${suffix}`.trim();
}
