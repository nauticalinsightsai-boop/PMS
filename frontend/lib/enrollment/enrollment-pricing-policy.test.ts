import { describe, expect, it } from 'vitest';
import {
  PROCESSING_FEE_FRACTION,
  elitePayFraction,
  payFractionFromStatedOff,
  regionalPayFraction,
  statedEliteOffPercent,
  statedRegionalOffPercent,
} from './enrollment-pricing-policy';

describe('enrollment-pricing-policy matrix', () => {
  it('embeds 3.15% fee into discounted pay fractions', () => {
    expect(PROCESSING_FEE_FRACTION).toBe(0.0315);
    expect(payFractionFromStatedOff(0)).toBe(1);
    expect(payFractionFromStatedOff(0.2)).toBeCloseTo(0.8315, 4);
    expect(payFractionFromStatedOff(0.3)).toBeCloseTo(0.7315, 4);
    expect(payFractionFromStatedOff(0.15)).toBeCloseTo(0.8815, 4);
  });

  it('matches locked regional and Elite pay fractions to 4 decimals', () => {
    expect(regionalPayFraction('professional', 'global')).toBe(1);
    expect(regionalPayFraction('professional', 'gcc')).toBeCloseTo(0.8315, 4);
    expect(regionalPayFraction('professional', 'india')).toBeCloseTo(0.7315, 4);
    expect(regionalPayFraction('professional', 'pakistan')).toBeCloseTo(0.7315, 4);
    expect(regionalPayFraction('foundation', 'india')).toBe(1);

    expect(elitePayFraction('global')).toBeCloseTo(0.8815, 4);
    expect(elitePayFraction('gcc')).toBeCloseTo(0.7315, 4);
    expect(elitePayFraction('gcc')).toBe(regionalPayFraction('professional', 'india'));
  });

  it('exposes stated percents for UI only', () => {
    expect(statedRegionalOffPercent('professional', 'gcc')).toBe(20);
    expect(statedRegionalOffPercent('professional', 'india')).toBe(30);
    expect(statedEliteOffPercent('global')).toBe(15);
    expect(statedEliteOffPercent('gcc')).toBe(30);
  });
});
