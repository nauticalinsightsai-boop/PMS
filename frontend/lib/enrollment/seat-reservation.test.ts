import { describe, expect, it } from 'vitest';
import {
  formatRegionalDepositDisplay,
  formatEnrollmentUsd,
  resolveSeatDepositUsdCents,
  SEAT_DEPOSIT_FRACTION,
} from '@/lib/enrollment/seat-reservation';

describe('seat-reservation', () => {
  it('uses 25% of pathway tuition for deposit in USD', () => {
    expect(SEAT_DEPOSIT_FRACTION).toBe(0.25);
    expect(resolveSeatDepositUsdCents(89900)).toBe(22475);
  });

  it('formats regional deposit in local currency display', () => {
    expect(formatRegionalDepositDisplay('PKR 119,999')).toBe('PKR 29,999.75');
    expect(formatRegionalDepositDisplay('$899')).toBe('$224.75');
  });

  it('formats enrollment USD amounts', () => {
    expect(formatEnrollmentUsd(224.75)).toBe('$224.75');
    expect(formatEnrollmentUsd(899)).toBe('$899');
  });
});
