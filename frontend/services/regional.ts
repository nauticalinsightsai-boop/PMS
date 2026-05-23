const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function fetchRegions() {
  const res = await fetch(`${API_BASE}/api/regions`);
  if (!res.ok) throw new Error('Failed to load regions');
  return res.json();
}

export async function fetchCatalogue() {
  const res = await fetch(`${API_BASE}/api/catalogue`);
  if (!res.ok) throw new Error('Failed to load catalogue');
  return res.json();
}

async function parseApi<T>(res: Response): Promise<{ data?: T; error?: string }> {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) return { error: (body as { error?: string }).error ?? res.statusText };
  return { data: body as T };
}

export async function verifyRegion(payload: {
  regionId: string;
  residenceCountry: string;
  billingCountry: string;
  gccCountry?: string | null;
}) {
  const res = await fetch(`${API_BASE}/api/region/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseApi<{ result: { verified: boolean; message: string; scholarshipEligible: boolean } }>(res);
}

export async function createCheckoutSession(payload: {
  offeringId: string;
  regionId: string;
  residenceCountry: string;
  billingCountry: string;
  email: string;
  gccCountry?: string | null;
  hasMembership?: boolean;
}) {
  const res = await fetch(`${API_BASE}/api/checkout/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseApi<{ session: { url: string | null }; usdCents: number; hasMembership?: boolean }>(
    res
  );
}

export async function syncProfileRegion(payload: {
  userId: string;
  regionId: string;
  gccCountry?: string | null;
}) {
  const res = await fetch(`${API_BASE}/api/profile/region`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseApi<{ saved: boolean }>(res);
}

export async function submitWaitlist(payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function submitScholarshipReview(payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/scholarship-review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function submitConsultation(payload: Record<string, unknown>) {
  const res = await fetch(`${API_BASE}/api/consultation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
