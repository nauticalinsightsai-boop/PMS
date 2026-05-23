export type BillingCycle = 'monthly' | 'yearly';

export function formatMembershipUsd(amount: number): string {
  return `$${amount}`;
}

export function membershipAnnualSavingsUsd(monthlyUsd: number, yearlyUsd: number): number {
  return Math.max(0, monthlyUsd * 12 - yearlyUsd);
}

export function getMembershipDisplayPrice(
  monthlyUsd: number,
  yearlyUsd: number,
  cycle: BillingCycle,
): { price: string; period: string; savingsLabel: string | null } {
  if (monthlyUsd === 0 && yearlyUsd === 0) {
    return { price: '$0', period: '', savingsLabel: null };
  }

  if (cycle === 'monthly') {
    return {
      price: formatMembershipUsd(monthlyUsd),
      period: '/month',
      savingsLabel: null,
    };
  }

  const savings = membershipAnnualSavingsUsd(monthlyUsd, yearlyUsd);
  return {
    price: formatMembershipUsd(yearlyUsd),
    period: '/year',
    savingsLabel:
      savings > 0 ? `Save ${formatMembershipUsd(savings)} vs monthly` : null,
  };
}

/** Paid tiers: Professional $19/mo · $199/yr; Mastery $49/mo · $499/yr */
export const MEMBERSHIP_PRICING = {
  professional: { monthlyUsd: 19, yearlyUsd: 199 },
  mastery: { monthlyUsd: 49, yearlyUsd: 499 },
} as const;
