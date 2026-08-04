import { beforeEach, describe, expect, it } from 'vitest';
import {
  createScholarshipVisitorCookieValue,
  scholarshipVisitorHash,
  verifyScholarshipVisitorCookie,
} from './scholarship-visitor';

describe('opaque signed scholarship visitor identity', () => {
  beforeEach(() => {
    process.env.SCHOLARSHIP_RESERVATION_SECRET = 'test-scholarship-reservation-secret';
  });

  it('round-trips a signed opaque identity and hashes it deterministically', () => {
    const cookie = createScholarshipVisitorCookieValue();
    const visitorId = verifyScholarshipVisitorCookie(cookie);
    expect(visitorId).toMatch(/^[A-Za-z0-9_-]{32}$/);
    expect(scholarshipVisitorHash(visitorId!)).toMatch(/^[a-f0-9]{64}$/);
    expect(scholarshipVisitorHash(visitorId!)).toBe(scholarshipVisitorHash(visitorId!));
  });

  it('fails closed for tampering or malformed values', () => {
    const cookie = createScholarshipVisitorCookieValue();
    expect(verifyScholarshipVisitorCookie(`${cookie.slice(0, -1)}x`)).toBeNull();
    expect(verifyScholarshipVisitorCookie('not-a-signed-cookie')).toBeNull();
  });
});
