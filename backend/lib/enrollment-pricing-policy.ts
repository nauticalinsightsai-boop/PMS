/**
 * Backend mirror of frontend/lib/enrollment/enrollment-pricing-policy.ts.
 * Keep in sync: fee, stated offs, and payFraction helpers.
 */

export const PROCESSING_FEE_FRACTION = 0.0315;

export const STATED_GCC_OFF = 0.2;
export const STATED_IN_PK_OFF = 0.3;
export const STATED_ELITE_GLOBAL_OFF = 0.15;
export const STATED_ELITE_GCC_OFF = 0.3;

/** effectiveOff = statedOff - fee; payFraction = 1 - effectiveOff. Full price (stated 0) pays 1. */
export function effectiveOffFromStated(statedOff: number): number {
  if (!Number.isFinite(statedOff) || statedOff <= 0) return 0;
  return Math.max(0, statedOff - PROCESSING_FEE_FRACTION);
}

export function payFractionFromStatedOff(statedOff: number): number {
  if (!Number.isFinite(statedOff) || statedOff <= 0) return 1;
  return 1 - effectiveOffFromStated(statedOff);
}

export function statedRegionalOff(tierId: string, regionId: string): number {
  if (tierId === 'foundation') return 0;
  if (regionId === 'india' || regionId === 'pakistan') return STATED_IN_PK_OFF;
  if (regionId === 'gcc') return STATED_GCC_OFF;
  return 0;
}

export function regionalPayFraction(tierId: string, regionId: string): number {
  return payFractionFromStatedOff(statedRegionalOff(tierId, regionId));
}

export function statedEliteOff(regionId: string | null | undefined): number {
  return regionId === 'gcc' ? STATED_ELITE_GCC_OFF : STATED_ELITE_GLOBAL_OFF;
}

export function elitePayFraction(regionId: string | null | undefined): number {
  return payFractionFromStatedOff(statedEliteOff(regionId));
}

/** Stated percent for banners/labels (15 / 20 / 30), never fee-adjusted. */
export function statedRegionalOffPercent(tierId: string, regionId: string): number {
  return Math.round(statedRegionalOff(tierId, regionId) * 100);
}

export function statedEliteOffPercent(regionId: string | null | undefined): number {
  return Math.round(statedEliteOff(regionId) * 100);
}
