/** Stripe Payment Link for seat reservation deposits. */
export const SEAT_DEPOSIT_STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_SEAT_DEPOSIT_PAYMENT_LINK?.trim() ||
  'https://buy.stripe.com/bJe14m43t9MGcrlg980sU00';

/** Seat hold duration shown on the enrollment page. */
export const SEAT_RESERVATION_HOLD_MS = 15 * 60 * 1000;

const DEPOSIT_BY_TIER_PATTERN: { match: (slug: string) => boolean; amount: number }[] = [
  { match: (slug) => slug.includes('mastery'), amount: 500 },
  { match: (slug) => slug.includes('professional') || slug.includes('foundation'), amount: 250 },
];

export function resolveSeatDepositUsd(tierSlug: string): number {
  const slug = tierSlug.toLowerCase();
  return DEPOSIT_BY_TIER_PATTERN.find((row) => row.match(slug))?.amount ?? 250;
}

export function formatSeatDeposit(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

export function seatHoldStorageKey(offeringId: string): string {
  return `pms-seat-hold-${offeringId}`;
}
