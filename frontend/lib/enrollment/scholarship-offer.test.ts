import { describe, expect, it } from 'vitest';
import {
  applyScholarshipDiscountDisplay,
  applyScholarshipDiscountMinor,
  evaluateScholarshipSession,
  isScholarshipAllowedRegion,
  isScholarshipTier,
  SCHOLARSHIP_COOLDOWN_MS,
  SCHOLARSHIP_SESSION_MS,
  startScholarshipSession,
} from './scholarship-offer';

describe('scholarship-offer discount math', () => {
  it('applies 15% off minor units with currency floor', () => {
    expect(applyScholarshipDiscountMinor(10000)).toBe(8500);
    expect(applyScholarshipDiscountMinor(1)).toBe(1);
    expect(applyScholarshipDiscountMinor(0)).toBe(1);
  });

  it('formats display amounts at 85% of catalogue', () => {
    expect(applyScholarshipDiscountDisplay('$1,000')).toBe('$850');
    expect(applyScholarshipDiscountDisplay('AED 2,000')).toBe('AED 1,700');
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
  it('keeps an active window for 15 minutes from open', () => {
    const openedAt = 1_000_000;
    const record = startScholarshipSession(openedAt);
    expect(record.expiresAt - record.openedAt).toBe(SCHOLARSHIP_SESSION_MS);

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
