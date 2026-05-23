import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import {
  getCohortMonthsAhead,
  getScheduledCohortDate,
  resolveCohortIntakeTier,
} from './cohort-intake-schedule';
import { formatCohortMonthYear, getNextCohortDate } from './certification-enrollment';

describe('cohort-intake-schedule', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15)); // May 15, 2026
  });

  it('staggers flagship PMI pathways across Jun–Jul', () => {
    expect(formatCohortMonthYear(getScheduledCohortDate('pmp'))).toBe('Jul 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('pmi-rmp'))).toBe('Jun 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('capm'))).toBe('Jun 2026');
  });

  it('places SP and CP in August when viewed in May', () => {
    expect(formatCohortMonthYear(getScheduledCohortDate('pmi-sp'))).toBe('Aug 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('pmi-cp'))).toBe('Aug 2026');
  });

  it('places most other PMI pathways in September', () => {
    expect(formatCohortMonthYear(getScheduledCohortDate('pmi-acp'))).toBe('Sep 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('pmi-pba'))).toBe('Sep 2026');
  });

  it('staggers PRINCE2 and Six Sigma flagship rows', () => {
    expect(formatCohortMonthYear(getScheduledCohortDate('prince2'))).toBe('Jun 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('prince2-practitioner'))).toBe('Jul 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('prince2-agile'))).toBe('Aug 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('lss-green'))).toBe('Jun 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('lss-yellow'))).toBe('Jul 2026');
    expect(formatCohortMonthYear(getScheduledCohortDate('lss-black'))).toBe('Aug 2026');
  });

  it('maps portfolio credentials to priority tier', () => {
    expect(resolveCohortIntakeTier('pgmp')).toBe('priority');
    expect(resolveCohortIntakeTier('pfmp')).toBe('priority');
    expect(getCohortMonthsAhead('pgmp')).toBe(2);
  });
});

describe('certification-enrollment cohort dates', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses per-cert schedule when certId is provided', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15));
    const next = getNextCohortDate('pmp');
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(6); // July
    expect(formatCohortMonthYear(next)).toBe('Jul 2026');
  });
});
