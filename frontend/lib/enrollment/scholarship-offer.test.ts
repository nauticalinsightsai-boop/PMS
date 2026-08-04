import { describe, expect, it } from 'vitest';
import {
  applyScholarshipDiscountDisplay,
  applyScholarshipDiscountMinor,
  evaluateScholarshipSession,
  isScholarshipAllowedRegion,
  isScholarshipTier,
  resolveEliteScholarshipPrice,
  SCHOLARSHIP_COOLDOWN_MS,
  SCHOLARSHIP_SESSION_MS,
  scholarshipDiscountPct,
  startScholarshipSession,
} from './scholarship-offer';
import { GLOBAL_REFERENCE_FX_PER_USD } from '@/lib/regional-fx-rates';

describe('scholarship-offer discount math', () => {
  it('applies stated 15% Global / 30% GCC labels with fee-adjusted pay fractions', () => {
    expect(applyScholarshipDiscountMinor(10000, 'global')).toBe(8815);
    expect(applyScholarshipDiscountMinor(10000, 'gcc')).toBe(7315);
    expect(scholarshipDiscountPct('global')).toBe(15);
    expect(scholarshipDiscountPct('gcc')).toBe(30);
  });

  it('resolves Global Elite in USD and GCC Elite in local FX currency', () => {
    const global = resolveEliteScholarshipPrice({
      globalUsdMajor: 899,
      regionId: 'global',
    });
    expect(global?.currency).toBe('usd');
    expect(global?.display).toBe('$792.47');
    expect(global?.unitAmount).toBe(79247);

    const ae = resolveEliteScholarshipPrice({
      globalUsdMajor: 899,
      regionId: 'gcc',
      gccCountry: 'AE',
    });
    const expectedMajor = Math.round(899 * GLOBAL_REFERENCE_FX_PER_USD.AED * 0.7315);
    expect(ae?.currencyCode).toBe('AED');
    expect(ae?.currency).toBe('aed');
    expect(ae?.majorAmount).toBe(expectedMajor);
    expect(ae?.display).toBe(`AED ${expectedMajor.toLocaleString('en-US')}`);
    expect(ae?.originalDisplay).toBe(
      `AED ${Math.round(899 * GLOBAL_REFERENCE_FX_PER_USD.AED).toLocaleString('en-US')}`,
    );

    const sa = resolveEliteScholarshipPrice({
      globalUsdMajor: 899,
      regionId: 'gcc',
      gccCountry: 'SA',
    });
    expect(sa?.currencyCode).toBe('SAR');
    expect(sa?.majorAmount).toBe(Math.round(899 * GLOBAL_REFERENCE_FX_PER_USD.SAR * 0.7315));

    const om = resolveEliteScholarshipPrice({
      globalUsdMajor: 899,
      regionId: 'gcc',
      gccCountry: 'OM',
    });
    expect(om?.currencyCode).toBe('OMR');

    const bh = resolveEliteScholarshipPrice({
      globalUsdMajor: 899,
      regionId: 'gcc',
      gccCountry: 'BH',
    });
    expect(bh?.currencyCode).toBe('BHD');
  });

  it('formats display amounts from Global catalogue (with gccCountry for local)', () => {
    expect(applyScholarshipDiscountDisplay('$1,000', 'global')).toBe('$881.50');
    expect(applyScholarshipDiscountDisplay('$1,000', 'gcc', 'AE')).toBe(
      `AED ${Math.round(1000 * GLOBAL_REFERENCE_FX_PER_USD.AED * 0.7315).toLocaleString('en-US')}`,
    );
  });
});

describe('scholarship-offer region and tier gates', () => {
  it('allows only global and gcc regions', () => {
    expect(isScholarshipAllowedRegion('global')).toBe(true);
    expect(isScholarshipAllowedRegion('gcc')).toBe(true);
    expect(isScholarshipAllowedRegion('india')).toBe(false);
    expect(isScholarshipAllowedRegion('pakistan')).toBe(false);
  });

  it('allows professional and mastery slug variants only', () => {
    expect(isScholarshipTier('professional')).toBe(true);
    expect(isScholarshipTier('mastery')).toBe(true);
    expect(isScholarshipTier('mastery-advisory')).toBe(true);
    expect(isScholarshipTier('mastery-corporate')).toBe(true);
    expect(isScholarshipTier('foundation')).toBe(false);
  });
});

describe('scholarship-offer session and cooldown', () => {
  it('keeps an active window for 20 minutes from open', () => {
    const openedAt = 1_000_000;
    const record = startScholarshipSession(openedAt);
    expect(record.expiresAt - record.openedAt).toBe(SCHOLARSHIP_SESSION_MS);
    expect(SCHOLARSHIP_SESSION_MS).toBe(20 * 60 * 1000);

    const active = evaluateScholarshipSession(record, openedAt + 5 * 60 * 1000);
    expect(active.status).toBe('active');
    if (active.status === 'active') {
      expect(active.remainingMs).toBe(SCHOLARSHIP_SESSION_MS - 5 * 60 * 1000);
    }
  });

  it('enters cooldown until 30 minutes after openedAt', () => {
    const openedAt = 2_000_000;
    const record = {
      openedAt,
      expiresAt: openedAt + SCHOLARSHIP_SESSION_MS,
    };
    const cooling = evaluateScholarshipSession(record, openedAt + SCHOLARSHIP_SESSION_MS + 1);
    expect(cooling.status).toBe('cooldown');
    if (cooling.status === 'cooldown') {
      expect(cooling.remainingMs).toBe(SCHOLARSHIP_COOLDOWN_MS - SCHOLARSHIP_SESSION_MS - 1);
    }

    const ready = evaluateScholarshipSession(record, openedAt + SCHOLARSHIP_COOLDOWN_MS);
    expect(ready.status).toBe('ready');
  });
});
