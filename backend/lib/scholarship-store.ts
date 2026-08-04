import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';
import type { ScholarshipLevel, ScholarshipMarket } from '@/lib/scholarship-core';
import type { ScholarshipPrice } from '@/lib/scholarship-pricing';

export type ScholarshipReservationStatus =
  | 'active'
  | 'checkout_open'
  | 'expired'
  | 'completed'
  | 'rejected';

export type ScholarshipReservationRow = {
  id: string;
  visitor_hash: string;
  offering_id: string;
  site_cert_id: string;
  tier_slug: ScholarshipLevel;
  tier_id: string;
  market: ScholarshipMarket;
  country_code: string;
  delivery_mode: 'mentor_led';
  currency: string;
  base_unit_amount: number;
  final_unit_amount: number;
  base_usd_cents: number;
  final_usd_cents: number;
  discount_bps: 1500;
  status: ScholarshipReservationStatus;
  expires_at: string;
  stripe_session_id: string | null;
  idempotency_key: string;
  expired_at: string | null;
  completed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

const RESERVATION_COLUMNS = [
  'id', 'visitor_hash', 'offering_id', 'site_cert_id', 'tier_slug', 'tier_id', 'market',
  'country_code', 'delivery_mode', 'currency', 'base_unit_amount', 'final_unit_amount',
  'base_usd_cents', 'final_usd_cents', 'discount_bps', 'status', 'expires_at',
  'stripe_session_id', 'idempotency_key', 'expired_at', 'completed_at', 'rejection_reason',
  'created_at', 'updated_at',
].join(',');

function requireStore() {
  if (!isSupabaseConfigured) throw new Error('scholarship_store_unavailable');
}

export async function findScholarshipReservation(params: {
  visitorHash: string;
  offeringId: string;
  market: ScholarshipMarket;
}): Promise<ScholarshipReservationRow | null> {
  requireStore();
  const { data, error } = await supabaseAdmin
    .from('scholarship_reservations')
    .select(RESERVATION_COLUMNS)
    .eq('visitor_hash', params.visitorHash)
    .eq('offering_id', params.offeringId)
    .eq('market', params.market)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ScholarshipReservationRow | null) ?? null;
}

export async function getScholarshipReservation(
  reservationId: string,
): Promise<ScholarshipReservationRow | null> {
  requireStore();
  const { data, error } = await supabaseAdmin
    .from('scholarship_reservations')
    .select(RESERVATION_COLUMNS)
    .eq('id', reservationId)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as ScholarshipReservationRow | null) ?? null;
}

export async function createScholarshipReservation(params: {
  visitorHash: string;
  offeringId: string;
  siteCertId: string;
  tierSlug: ScholarshipLevel;
  tierId: string;
  market: ScholarshipMarket;
  countryCode: string;
  price: ScholarshipPrice;
  expiresAt: string;
  idempotencyKey: string;
}): Promise<ScholarshipReservationRow> {
  requireStore();
  const row = {
    visitor_hash: params.visitorHash,
    offering_id: params.offeringId,
    site_cert_id: params.siteCertId,
    tier_slug: params.tierSlug,
    tier_id: params.tierId,
    market: params.market,
    country_code: params.countryCode,
    delivery_mode: 'mentor_led',
    currency: params.price.currency,
    base_unit_amount: params.price.baseUnitAmount,
    final_unit_amount: params.price.finalUnitAmount,
    base_usd_cents: params.price.baseUsdCents,
    final_usd_cents: params.price.finalUsdCents,
    discount_bps: 1500,
    status: 'active',
    expires_at: params.expiresAt,
    idempotency_key: params.idempotencyKey,
  };
  const { data, error } = await supabaseAdmin
    .from('scholarship_reservations')
    .insert(row)
    .select(RESERVATION_COLUMNS)
    .single();
  if (!error && data) return data as unknown as ScholarshipReservationRow;
  if ((error as { code?: string } | null)?.code === '23505') {
    const existing = await findScholarshipReservation({
      visitorHash: params.visitorHash,
      offeringId: params.offeringId,
      market: params.market,
    });
    if (existing) return existing;
  }
  throw error ?? new Error('scholarship_reservation_insert_failed');
}

export async function attachScholarshipCheckout(params: {
  reservationId: string;
  stripeSessionId: string;
}): Promise<ScholarshipReservationRow> {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('scholarship_reservations')
    .update({ status: 'checkout_open', stripe_session_id: params.stripeSessionId, updated_at: now })
    .eq('id', params.reservationId)
    .in('status', ['active', 'checkout_open'])
    .select(RESERVATION_COLUMNS)
    .single();
  if (error || !data) throw error ?? new Error('scholarship_checkout_attach_failed');
  return data as unknown as ScholarshipReservationRow;
}

export async function setScholarshipReservationStatus(params: {
  reservationId: string;
  from: ScholarshipReservationStatus[];
  status: ScholarshipReservationStatus;
  reason?: string | null;
  completedAt?: string | null;
}): Promise<boolean> {
  const now = new Date().toISOString();
  const patch: Record<string, unknown> = {
    status: params.status,
    updated_at: now,
    rejection_reason: params.reason ?? null,
  };
  if (params.status === 'expired') patch.expired_at = now;
  if (params.status === 'completed') patch.completed_at = params.completedAt ?? now;
  const { data, error } = await supabaseAdmin
    .from('scholarship_reservations')
    .update(patch)
    .eq('id', params.reservationId)
    .in('status', params.from)
    .select('id')
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function listExpiredScholarshipReservations(): Promise<ScholarshipReservationRow[]> {
  requireStore();
  const { data, error } = await supabaseAdmin
    .from('scholarship_reservations')
    .select(RESERVATION_COLUMNS)
    .in('status', ['active', 'checkout_open'])
    .lte('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: true })
    .limit(100);
  if (error) throw error;
  return (data as unknown as ScholarshipReservationRow[] | null) ?? [];
}

export async function recordScholarshipEvent(params: {
  eventName: 'scholarship_page_view' | 'reservation_started' | 'checkout_started' | 'expired' | 'completed';
  reservationId?: string | null;
  offeringId: string;
  market: ScholarshipMarket;
  dedupeKey?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
}): Promise<void> {
  requireStore();
  const { error } = await supabaseAdmin.from('scholarship_events').insert({
    event_name: params.eventName,
    reservation_id: params.reservationId ?? null,
    offering_id: params.offeringId,
    market: params.market,
    dedupe_key: params.dedupeKey ?? null,
    metadata: params.metadata ?? {},
  });
  if (error && (error as { code?: string }).code !== '23505') throw error;
}
