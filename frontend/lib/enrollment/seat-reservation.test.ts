import { describe, expect, it } from 'vitest';
import {
  formatSeatDeposit,
  resolveSeatDepositUsd,
} from '@/lib/enrollment/seat-reservation';

describe('seat-reservation', () => {
  it('uses $250 deposit for professional and foundation tiers', () => {
    expect(resolveSeatDepositUsd('professional')).toBe(250);
    expect(resolveSeatDepositUsd('foundation')).toBe(250);
  });

  it('uses $500 deposit for mastery tiers', () => {
    expect(resolveSeatDepositUsd('mastery')).toBe(500);
    expect(resolveSeatDepositUsd('mastery-corporate')).toBe(500);
  });

  it('formats deposit amounts', () => {
    expect(formatSeatDeposit(250)).toBe('$250');
    expect(formatSeatDeposit(500)).toBe('$500');
  });
});
