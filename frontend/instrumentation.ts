import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

type ExpiredReservation = {
  id: string;
  offering_id: string;
  market: 'gcc' | 'global';
  status: 'active' | 'checkout_open';
  stripe_session_id: string | null;
};

type GlobalWithScholarshipSweeper = typeof globalThis & {
  __pmsScholarshipExpirySweeper?: NodeJS.Timeout;
};

function startScholarshipExpirySweeper(): void {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim() ?? '';
  if (!supabaseUrl || !serviceRoleKey || !/^(sk|rk)_(test|live)_/.test(stripeSecretKey)) return;

  const target = globalThis as GlobalWithScholarshipSweeper;
  if (target.__pmsScholarshipExpirySweeper) return;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const stripe = new Stripe(stripeSecretKey, { typescript: true });
  const run = async () => {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('scholarship_reservations')
      .select('id,offering_id,market,status,stripe_session_id')
      .in('status', ['active', 'checkout_open'])
      .lte('expires_at', now)
      .order('expires_at', { ascending: true })
      .limit(100);
    if (error) throw error;

    for (const reservation of (data ?? []) as ExpiredReservation[]) {
      if (reservation.stripe_session_id) {
        const session = await stripe.checkout.sessions.retrieve(reservation.stripe_session_id);
        if (session.status === 'complete') continue;
        if (session.status === 'open') {
          await stripe.checkout.sessions.expire(reservation.stripe_session_id);
        }
      }
      const expiredAt = new Date().toISOString();
      const { data: changed, error: updateError } = await supabase
        .from('scholarship_reservations')
        .update({
          status: 'expired',
          expired_at: expiredAt,
          rejection_reason: null,
          updated_at: expiredAt,
        })
        .eq('id', reservation.id)
        .in('status', ['active', 'checkout_open'])
        .select('id')
        .maybeSingle();
      if (updateError) throw updateError;
      if (changed) {
        const { error: eventError } = await supabase.from('scholarship_events').insert({
          event_name: 'expired',
          reservation_id: reservation.id,
          offering_id: reservation.offering_id,
          market: reservation.market,
          dedupe_key: `expired:${reservation.id}`,
          metadata: {},
        });
        if (eventError && eventError.code !== '23505') throw eventError;
      }
    }
  };

  const safeRun = () => {
    void run().catch((error) => {
      console.error('[scholarship-expiry] sweep failed', error);
    });
  };
  safeRun();
  const timer = setInterval(safeRun, 10_000);
  timer.unref?.();
  target.__pmsScholarshipExpirySweeper = timer;
}

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') startScholarshipExpirySweeper();
}
