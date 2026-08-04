import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { isSupabaseConfigured } from '@/lib/supabase-admin';
import {
  listExpiredScholarshipReservations,
  recordScholarshipEvent,
  setScholarshipReservationStatus,
  type ScholarshipReservationRow,
} from '@/lib/scholarship-store';

export async function expireScholarshipReservation(
  reservation: ScholarshipReservationRow,
): Promise<boolean> {
  if (reservation.status !== 'active' && reservation.status !== 'checkout_open') return false;
  if (new Date(reservation.expires_at).getTime() > Date.now()) return false;

  if (reservation.stripe_session_id) {
    if (!isStripeConfigured()) return false;
    try {
      const current = await getStripe().checkout.sessions.retrieve(reservation.stripe_session_id);
      if (current.status === 'complete') return false;
      if (current.status === 'open') {
        await getStripe().checkout.sessions.expire(reservation.stripe_session_id);
      }
    } catch (error) {
      console.error('[scholarship-expiry] Stripe session expiration failed', {
        reservationId: reservation.id,
        error,
      });
      return false;
    }
  }

  const changed = await setScholarshipReservationStatus({
    reservationId: reservation.id,
    from: ['active', 'checkout_open'],
    status: 'expired',
  });
  if (changed) {
    await recordScholarshipEvent({
      eventName: 'expired',
      reservationId: reservation.id,
      offeringId: reservation.offering_id,
      market: reservation.market,
      dedupeKey: `expired:${reservation.id}`,
    });
  }
  return changed;
}

async function sweepScholarshipExpirations(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const rows = await listExpiredScholarshipReservations();
  for (const row of rows) {
    await expireScholarshipReservation(row);
  }
}

type GlobalWithSweeper = typeof globalThis & {
  __pmsScholarshipExpirySweeper?: NodeJS.Timeout;
};

export function startScholarshipExpirySweeper(): void {
  const target = globalThis as GlobalWithSweeper;
  if (target.__pmsScholarshipExpirySweeper) return;
  const run = () => {
    void sweepScholarshipExpirations().catch((error) => {
      console.error('[scholarship-expiry] sweep failed', error);
    });
  };
  run();
  const timer = setInterval(run, 10_000);
  timer.unref?.();
  target.__pmsScholarshipExpirySweeper = timer;
}
