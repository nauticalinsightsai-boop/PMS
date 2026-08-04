import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createReservation: vi.fn(),
  findReservation: vi.fn(),
  getReservation: vi.fn(),
  recordEvent: vi.fn(),
  expireReservation: vi.fn(),
}));

vi.mock('@/lib/scholarship-store', () => ({
  createScholarshipReservation: mocks.createReservation,
  findScholarshipReservation: mocks.findReservation,
  getScholarshipReservation: mocks.getReservation,
  recordScholarshipEvent: mocks.recordEvent,
}));
vi.mock('@/lib/scholarship-expiry', () => ({
  expireScholarshipReservation: mocks.expireReservation,
}));

import { POST } from './route';

const expiresAt = '2099-01-01T00:15:00.000Z';
const row = {
  id: '11111111-1111-4111-8111-111111111111',
  visitor_hash: 'a'.repeat(64),
  offering_id: 'pmp-preparation-professional',
  site_cert_id: 'pmp',
  tier_slug: 'professional' as const,
  tier_id: 'professional',
  market: 'global' as const,
  country_code: 'US',
  delivery_mode: 'mentor_led' as const,
  currency: 'usd',
  base_unit_amount: 89_900,
  final_unit_amount: 76_415,
  base_usd_cents: 89_900,
  final_usd_cents: 76_415,
  discount_bps: 1500 as const,
  status: 'active' as const,
  expires_at: expiresAt,
  stripe_session_id: null,
  idempotency_key: 'scholarship:test',
  expired_at: null,
  completed_at: null,
  rejection_reason: null,
  created_at: '2099-01-01T00:00:00.000Z',
  updated_at: '2099-01-01T00:00:00.000Z',
};

function request(country = 'US', cookie?: string) {
  return new Request('https://pmstructure.com/api/scholarship/reservation', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify({
      offeringId: 'pmp-preparation-professional',
      siteCertId: 'pmp',
      tierSlug: 'professional',
      market: 'global',
      residenceCountry: country,
      billingCountry: country,
    }),
  });
}

describe('scholarship reservation durability boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SCHOLARSHIP_RESERVATION_SECRET = 'test-scholarship-reservation-secret';
    mocks.findReservation.mockResolvedValue(null);
    mocks.createReservation.mockResolvedValue(row);
    mocks.getReservation.mockResolvedValue(row);
    mocks.recordEvent.mockResolvedValue(undefined);
  });

  it('creates one 15-minute server reservation and reuses it across reopening', async () => {
    const first = await POST(request());
    const firstBody = await first.json();
    const setCookie = first.headers.get('set-cookie');
    expect(first.status).toBe(200);
    expect(setCookie).toContain('pms_scholarship_visitor=');
    expect(firstBody.reservation).toMatchObject({ id: row.id, expiresAt, discountPercent: 15 });
    expect(mocks.createReservation).toHaveBeenCalledOnce();

    mocks.findReservation.mockResolvedValue(row);
    const cookieHeader = setCookie!.split(';', 1)[0];
    const reopened = await POST(request('US', cookieHeader));
    const reopenedBody = await reopened.json();
    expect(reopened.status).toBe(200);
    expect(reopenedBody.reservation).toMatchObject({ id: row.id, expiresAt });
    expect(mocks.createReservation).toHaveBeenCalledOnce();
  });

  it.each(['PK', 'IN'])('falls back to ordinary pricing for excluded country %s', async (country) => {
    const response = await POST(request(country));
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({
      eligible: false,
      reason: 'south_asia_excluded',
      ordinaryUrl: '/certifications/pmp/professional/enroll',
    });
    expect(mocks.createReservation).not.toHaveBeenCalled();
  });

  it('rejects a tampered visitor cookie without creating a new reservation', async () => {
    const response = await POST(request('US', 'pms_scholarship_visitor=tampered'));
    expect(response.status).toBe(400);
    expect(mocks.createReservation).not.toHaveBeenCalled();
  });
});
