import { describe, expect, it } from 'vitest';
import { resolveDetailFinalFocus } from './detail-focus';

describe('Booking CRM Details final focus', () => {
  it('returns the connected invoking Details button to the Sheet focus manager', () => {
    const trigger = { isConnected: true } as HTMLButtonElement;
    expect(resolveDetailFinalFocus(trigger)).toBe(trigger);
  });

  it('does not direct focus to a stale or missing trigger', () => {
    expect(resolveDetailFinalFocus({ isConnected: false } as HTMLButtonElement)).toBeNull();
    expect(resolveDetailFinalFocus(null)).toBeNull();
  });
});
