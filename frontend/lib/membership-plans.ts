import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';
import { getRegionalMembershipAmounts } from '@/lib/membership-regional-pricing';

export type BillingCycle = 'monthly' | 'yearly';

export function formatMembershipUsd(amount: number): string {
  return `$${amount}`;
}

export function membershipAnnualSavingsUsd(monthlyUsd: number, yearlyUsd: number): number {
  return Math.max(0, monthlyUsd * 12 - yearlyUsd);
}

/** Rounded percent saved vs paying monthly for 12 months (e.g. 19×12 vs 199 → 13%). */
export function membershipAnnualSavingsPercent(monthlyUsd: number, yearlyUsd: number): number {
  const annualAtMonthly = monthlyUsd * 12;
  if (annualAtMonthly <= 0) return 0;
  return Math.round(((annualAtMonthly - yearlyUsd) / annualAtMonthly) * 100);
}

export function formatMembershipSavingsPercent(monthlyUsd: number, yearlyUsd: number): string | null {
  const pct = membershipAnnualSavingsPercent(monthlyUsd, yearlyUsd);
  return pct > 0 ? `Save ${pct}%` : null;
}

export function getMembershipDisplayPrice(
  monthlyUsd: number,
  yearlyUsd: number,
  cycle: BillingCycle,
  regionId: RegionId = 'global',
  gccCountry: GccCountryCode | null = null,
): { price: string; period: string; savingsLabel: string | null } {
  if (monthlyUsd === 0 && yearlyUsd === 0) {
    const zero = getRegionalMembershipAmounts(0, 0, regionId, gccCountry);
    return { price: zero.monthly, period: '', savingsLabel: null };
  }

  const amounts = getRegionalMembershipAmounts(monthlyUsd, yearlyUsd, regionId, gccCountry);
  const savingsLabel = formatMembershipSavingsPercent(
    amounts.monthlyNumeric,
    amounts.yearlyNumeric,
  );

  if (cycle === 'monthly') {
    return {
      price: amounts.monthly,
      period: '/month',
      savingsLabel: null,
    };
  }

  return {
    price: amounts.yearly,
    period: '/year',
    savingsLabel,
  };
}

/** Paid tiers: Professional $19/mo · $199/yr; Mastery $49/mo · $499/yr */
export const MEMBERSHIP_PRICING = {
  professional: { monthlyUsd: 19, yearlyUsd: 199 },
  mastery: { monthlyUsd: 49, yearlyUsd: 499 },
} as const;
