import { describe, expect, it, vi, afterEach } from 'vitest';
import { formatCohortMonthYear, getNextCohortDate } from './certification-enrollment';

describe('certification-enrollment cohort dates', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('next cohort is the first day of the month after today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 15)); // May 15, 2026
    const next = getNextCohortDate('pmp');
    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(5); // June
    expect(next.getDate()).toBe(1);
    expect(formatCohortMonthYear(next)).toBe('Jun 2026');
  });
});
