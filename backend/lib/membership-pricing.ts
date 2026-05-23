/** 20% membership discount on checkout usdCents (§K.1). */
export function membershipPriceUsdCents(usdCents: number | null): number | null {
  if (usdCents == null) return null;
  return Math.round(usdCents * 0.8);
}
