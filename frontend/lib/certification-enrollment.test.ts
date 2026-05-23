import { describe, expect, it, vi, afterEach } from 'vitest';
import { formatCohortMonthYear, getNextCohortDate } from './certification-enrollment';

describe('certification-enrollment cohort dates (fallback)', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('without certId uses rolling next calendar month', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15)); // May 15, 2026
    const next = getNextCohortDate();
    expect(next.getMonth()).toBe(5); // June
    expect(formatCohortMonthYear(next)).toBe('Jun 2026');
  });
});
