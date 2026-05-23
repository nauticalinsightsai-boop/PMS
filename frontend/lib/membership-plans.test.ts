import { describe, expect, it } from 'vitest';
import {
  formatMembershipSavingsPercent,
  getMembershipDisplayPrice,
  membershipAnnualSavingsPercent,
  MEMBERSHIP_PRICING,
} from '@/lib/membership-plans';

describe('membership-plans', () => {
  it('computes annual savings percent for Professional and Mastery', () => {
    const { professional, mastery } = MEMBERSHIP_PRICING;
    expect(membershipAnnualSavingsPercent(professional.monthlyUsd, professional.yearlyUsd)).toBe(13);
    expect(membershipAnnualSavingsPercent(mastery.monthlyUsd, mastery.yearlyUsd)).toBe(15);
  });

  it('yearly display uses percent savings label in global USD', () => {
    const display = getMembershipDisplayPrice(19, 199, 'yearly', 'global', null);
    expect(display.price).toBe('$198.99');
    expect(display.period).toBe('/year');
    expect(display.savingsLabel).toMatch(/Save \d+%/);
  });

  it('monthly display uses regional charm pricing', () => {
    const display = getMembershipDisplayPrice(19, 199, 'monthly', 'global', null);
    expect(display.price).toBe('$18.99');
    expect(display.period).toBe('/month');
    expect(display.savingsLabel).toBeNull();
  });

  it('formatMembershipSavingsPercent returns null when no savings', () => {
    expect(formatMembershipSavingsPercent(10, 120)).toBeNull();
  });
});
