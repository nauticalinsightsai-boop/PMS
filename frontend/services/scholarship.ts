import { apiUrl } from '@/lib/api-url';
import type { ScholarshipMarket } from '@/lib/scholarship';

export type ScholarshipReservationView = {
  id: string;
  offeringId: string;
  siteCertId: string;
  tierSlug: 'professional' | 'mastery';
  market: ScholarshipMarket;
  countryCode: string;
  deliveryMode: 'mentor_led';
  currency: string;
  baseUnitAmount: number;
  finalUnitAmount: number;
  baseUsdCents: number;
  finalUsdCents: number;
  discountPercent: 15;
  status: 'active' | 'checkout_open' | 'expired' | 'completed' | 'rejected';
  expiresAt: string;
  stripeSessionId: string | null;
};

async function parsed<T>(response: Response): Promise<{ data?: T; error?: string; status: number }> {
  const body = await response.json().catch(() => ({}));
  return response.ok
    ? { data: body as T, status: response.status }
    : { error: (body as { error?: string }).error ?? response.statusText, data: body as T, status: response.status };
}

export async function fetchExistingScholarshipReservation(params: {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  market: ScholarshipMarket;
}) {
  const query = new URLSearchParams(params);
  const response = await fetch(apiUrl(`/api/scholarship/reservation?${query}`), {
    cache: 'no-store',
    credentials: 'same-origin',
  });
  return parsed<{ reservation: ScholarshipReservationView | null }>(response);
}

export async function reserveScholarshipPrice(params: {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  market: ScholarshipMarket;
  residenceCountry: string;
  billingCountry: string;
}) {
  const response = await fetch(apiUrl('/api/scholarship/reservation'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(params),
  });
  return parsed<{
    eligible?: boolean;
    reason?: string;
    reservation?: ScholarshipReservationView;
    ordinaryUrl?: string;
    alternateScholarshipUrl?: string | null;
  }>(response);
}

export async function createScholarshipCheckout(params: {
  reservationId: string;
  colorScheme: 'light' | 'dark';
}) {
  const response = await fetch(apiUrl('/api/scholarship/checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(params),
  });
  return parsed<{
    session?: { sessionId: string; clientSecret: string };
    reservationId?: string;
    expiresAt?: string;
    expired?: boolean;
  }>(response);
}

export function recordScholarshipPageView(params: {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  market: ScholarshipMarket;
}) {
  return fetch(apiUrl('/api/scholarship/events'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({ eventName: 'scholarship_page_view', ...params }),
  }).catch(() => undefined);
}
