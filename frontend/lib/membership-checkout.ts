export type MembershipCheckoutTier = 'professional' | 'mastery';
export type MembershipCheckoutBilling = 'monthly' | 'yearly';

export function membershipCheckoutHref(
  tier: MembershipCheckoutTier,
  billing: MembershipCheckoutBilling,
): string {
  const params = new URLSearchParams({ tier, billing });
  return `/membership/checkout?${params.toString()}`;
}

export function storeCheckoutHref(productId: string): string {
  const params = new URLSearchParams({ product: productId });
  return `/checkout/store?${params.toString()}`;
}
