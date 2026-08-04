import { describe, expect, it } from 'vitest';
import {
  applyScholarshipDiscountDisplay,
  applyScholarshipDiscountMinor,
  evaluateScholarshipSession,
  isScholarshipAllowedRegion,
  isScholarshipTier,
  SCHOLARSHIP_COOLDOWN_MS,
  SCHOLARSHIP_SESSION_MS,
  scholarshipDiscountPct,
  startScholarshipSession,
} from './scholarship-offer';

describe('scholarship-offer discount math', () => {
  it('applies 15% off Global and 35% off Global for GCC', () => {
    expect(applyScholarshipDiscountMinor(10000, 'global')).toBe(8500);
    expect(applyScholarshipDiscountMinor(10000, 'gcc')).toBe(6500);
    expect(applyScholarshipDiscountMinor(1, 'global')).toBe(1);
    expect(applyScholarshipDiscountMinor(0, 'gcc')).toBe(1);
    expect(scholarshipDiscountPct('global')).toBe(15);
    expect(scholarshipDiscountPct('gcc')).toBe(35);
  });

  it('formats display amounts from Global catalogue', () => {
    expect(applyScholarshipDiscountDisplay('$1,000', 'global')).toBe('$850');
    expect(applyScholarshipDiscountDisplay('$1,000', 'gcc')).toBe('$650');
    // $899 → 89900 * 0.85 = 76415 → $764.15
    expect(applyScholarshipDiscountDisplay('$899', 'global')).toBe('$764.15');
    // $899 → 89900 * 0.65 = 58435 → $584.35
    expect(applyScholarshipDiscountDisplay('$899', 'gcc')).toBe('$584.35');
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
