import { describe, expect, it } from 'vitest';
import {
  convertMembershipUsdToRegional,
  floorToCharm99,
  getRegionalMembershipAmounts,
} from './membership-regional-pricing';

describe('membership-regional-pricing', () => {
  it('floors integer currencies to xx99 without rounding up', () => {
    expect(floorToCharm99(5282, false)).toBe(5199);
    expect(floorToCharm99(16517, false)).toBe(16499);
    expect(floorToCharm99(98, false)).toBe(98);
  });

  it('floors decimal currencies to x.99 without rounding up', () => {
    expect(floorToCharm99(19, true)).toBe(18.99);
    expect(floorToCharm99(199, true)).toBe(198.99);
    expect(floorToCharm99(17.48, true)).toBe(16.99);
  });

  it('formats Professional monthly in Pakistan as PKR with xx99', () => {
    const { display, numeric } = convertMembershipUsdToRegional(19, 'pakistan', null);
    expect(numeric).toBe(5199);
    expect(display).toMatch(/^PKR\s/);
    expect(display).toContain('5,199');
  });

  it('formats Professional monthly in India as INR with xx99', () => {
    const { display, numeric } = convertMembershipUsdToRegional(19, 'india', null);
    expect(numeric).toBe(1499);
    expect(display).toMatch(/₹/);
  });

  it('formats global USD with .99 charm', () => {
    const { display, numeric } = convertMembershipUsdToRegional(19, 'global', null);
    expect(numeric).toBe(18.99);
    expect(display).toBe('$18.99');
  });

  it('returns paired monthly and yearly displays for a region', () => {
    const amounts = getRegionalMembershipAmounts(19, 199, 'pakistan', null);
    expect(amounts.monthly).toContain('5,199');
    expect(amounts.yearly).toMatch(/PKR/);
    expect(amounts.yearlyNumeric).toBeLessThan(199 * 278);
  });
});
