/**
 * Approximate FX per 1 USD for global-reference display labels only.
 * Checkout still uses matrix `usdCents`; these rates convert global USD list price
 * into the learner's regional currency for comparison with scholarship tuition.
 */
export const GLOBAL_REFERENCE_FX_PER_USD: Record<string, number> = {
  AED: 3.6725,
  SAR: 3.75,
  QAR: 3.64,
  BHD: 0.376,
  KWD: 0.307,
  OMR: 0.385,
  PKR: 278,
  INR: 83,
  EUR: 0.92,
  GBP: 0.79,
};

/** Infer currency code from a matrix display string (e.g. "PKR 29,999" → PKR). */
export function currencyCodeFromDisplay(display: string): string | null {
  const trimmed = display.trim();
  if (trimmed.startsWith('₹')) return 'INR';
  if (trimmed.startsWith('$')) return 'USD';
  if (trimmed.startsWith('€')) return 'EUR';
  if (trimmed.startsWith('£')) return 'GBP';

  const codeMatch = trimmed.match(/^([A-Z]{3})\b/);
  return codeMatch?.[1] ?? null;
}

export function fxPerUsdForDisplay(display: string, regionId: string): number | null {
  const code = currencyCodeFromDisplay(display);
  if (code && GLOBAL_REFERENCE_FX_PER_USD[code] != null) {
    return GLOBAL_REFERENCE_FX_PER_USD[code];
  }
  if (regionId === 'europe') return GLOBAL_REFERENCE_FX_PER_USD.EUR;
  if (regionId === 'uk') return GLOBAL_REFERENCE_FX_PER_USD.GBP;
  return null;
}
