import { describe, expect, it } from 'vitest';
import { currencyCodeFromDisplay, fxPerUsdForDisplay } from '@/lib/regional-fx-rates';

describe('regional-fx-rates', () => {
  it('resolves FX for GCC and South Asia display strings', () => {
    expect(fxPerUsdForDisplay('PKR 119,999', 'pakistan')).toBe(278);
    expect(fxPerUsdForDisplay('AED 2,650', 'gcc')).toBe(3.6725);
    expect(currencyCodeFromDisplay('€749')).toBe('EUR');
  });
});
