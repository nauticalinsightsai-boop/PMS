import { describe, expect, it } from 'vitest';
import {
  elitePayFraction,
  payFractionFromStatedOff,
  regionalPayFraction,
  statedEliteOffPercent,
} from './enrollment-pricing-policy';

describe('backend enrollment-pricing-policy matrix', () => {
  it('matches locked pay fractions to 4 decimals', () => {
    expect(payFractionFromStatedOff(0)).toBe(1);
    expect(regionalPayFraction('professional', 'gcc')).toBeCloseTo(0.8315, 4);
    expect(regionalPayFraction('professional', 'india')).toBeCloseTo(0.7315, 4);
    expect(elitePayFraction('global')).toBeCloseTo(0.8815, 4);
    expect(elitePayFraction('gcc')).toBeCloseTo(0.7315, 4);
    expect(elitePayFraction('gcc')).toBe(regionalPayFraction('professional', 'pakistan'));
    expect(statedEliteOffPercent('gcc')).toBe(30);
  });
});
