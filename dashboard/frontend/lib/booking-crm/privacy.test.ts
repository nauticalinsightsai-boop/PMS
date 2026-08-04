import { describe, expect, it } from 'vitest';
import { maskEmail, maskPhone, phoneFromPayload } from './privacy';

describe('Booking CRM collapsed-card privacy', () => {
  it('masks email while keeping the domain useful for recognition', () => {
    expect(maskEmail('alex@example.com')).toBe('a***@example.com');
    expect(maskEmail('')).toBe('-');
    expect(maskEmail('not-an-email')).toBe('••••');
  });

  it('masks phone values and exposes only the last four digits', () => {
    expect(maskPhone('+1 (202) 555-0198')).toBe('•••• 0198');
    expect(maskPhone('')).toBe('-');
  });

  it('reads only known phone-shaped payload keys', () => {
    expect(phoneFromPayload({ fullName: 'Alex', phoneNumber: '+971 50 123 4567' })).toBe(
      '+971 50 123 4567',
    );
    expect(phoneFromPayload({ notes: '+971 50 123 4567' })).toBe('');
  });
});
