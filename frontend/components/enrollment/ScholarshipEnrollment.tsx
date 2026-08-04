'use client';

import * as React from 'react';
import Link from 'next/link';
import { loadStripe, type StripeEmbeddedCheckout } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { useSiteColorScheme } from '@/hooks/useSiteColorScheme';
import { pushAnalyticsEvent } from '@/lib/analytics/push-event';
import {
  currencyMinorUnit,
  formatScholarshipAmount,
  type ScholarshipMarket,
} from '@/lib/scholarship';
import { assertPublishableKeyAllowedOnHost } from '@/lib/stripe-key-mode';
import { stripePublishableKeyUnavailableMessage } from '@/lib/stripe-publishable-key';
import { fetchStripePublishableKey } from '@/services/enrollment';
import {
  scholarshipCountryOptions,
  scholarshipRegionName,
} from '@/lib/enrollment/scholarship-country-options';
import {
  createScholarshipCheckout,
  fetchExistingScholarshipReservation,
  recordScholarshipPageView,
  reserveScholarshipPrice,
  type ScholarshipReservationView,
} from '@/services/scholarship';

type Props = {
  offeringId: string;
  siteCertId: string;
  tierSlug: 'professional' | 'mastery';
  market: ScholarshipMarket;
  certName: string;
  courseName: string;
  publishableKeyHint?: string | null;
};

function remainingSeconds(expiresAt: string): number {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

function ReservationTimer({ expiresAt, onExpired }: { expiresAt: string; onExpired: () => void }) {
  const [seconds, setSeconds] = React.useState(() => remainingSeconds(expiresAt));
  const expiredRef = React.useRef(false);
  React.useEffect(() => {
    const tick = () => {
      const next = remainingSeconds(expiresAt);
      setSeconds(next);
      if (next === 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpired();
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, onExpired]);
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return (
    <p role="timer" aria-live="polite" className="font-mono text-3xl font-bold tabular-nums text-brand-orange">
      {String(minutes).padStart(2, '0')}:{String(remainder).padStart(2, '0')}
    </p>
  );
}

function ScholarshipStripeCheckout({
  reservation,
  publishableKeyHint,
  onExpired,
}: {
  reservation: ScholarshipReservationView;
  publishableKeyHint?: string | null;
  onExpired: () => void;
}) {
  const colorScheme = useSiteColorScheme();
  const mountRef = React.useRef<HTMLDivElement>(null);
  const checkoutRef = React.useRef<StripeEmbeddedCheckout | null>(null);
  const [started, setStarted] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!started || !mountRef.current) return;
    let cancelled = false;
    async function mountCheckout() {
      setStatus('loading');
      setError(null);
      try {
        const publishableKey = await fetchStripePublishableKey(publishableKeyHint);
        const keyError = assertPublishableKeyAllowedOnHost(publishableKey);
        if (!publishableKey || keyError) throw new Error(keyError ?? stripePublishableKeyUnavailableMessage());
        const result = await createScholarshipCheckout({ reservationId: reservation.id, colorScheme });
        if (result.status === 410 || result.data?.expired) {
          onExpired();
          return;
        }
        if (result.error || !result.data?.session?.clientSecret) {
          throw new Error(result.error ?? 'Could not start secure checkout.');
        }
        pushAnalyticsEvent('checkout_started', {
          offering_id: reservation.offeringId,
          scholarship_market: reservation.market,
          delivery_mode: 'mentor_led',
          currency: reservation.currency,
          value: reservation.finalUnitAmount / 10 ** currencyMinorUnit(reservation.currency),
        });
        const stripe = await loadStripe(publishableKey);
        if (!stripe || !mountRef.current || cancelled) return;
        const checkout = await stripe.initEmbeddedCheckout({
          clientSecret: result.data.session.clientSecret,
        });
        if (cancelled) {
          checkout.destroy();
          return;
        }
        checkoutRef.current?.destroy();
        mountRef.current.innerHTML = '';
        checkoutRef.current = checkout;
        checkout.mount(mountRef.current);
        setStatus('ready');
      } catch (cause) {
        if (cancelled) return;
        setStatus('error');
        setError(cause instanceof Error ? cause.message : 'Could not start secure checkout.');
      }
    }
    void mountCheckout();
    return () => {
      cancelled = true;
      checkoutRef.current?.destroy();
      checkoutRef.current = null;
    };
  }, [colorScheme, onExpired, publishableKeyHint, reservation, started]);

  if (!started) {
    return (
      <Button type="button" variant="brand" size="lg" className="w-full rounded-xl" onClick={() => setStarted(true)}>
        Continue to secure checkout
      </Button>
    );
  }
  return (
    <div className="relative min-h-[420px] w-full min-w-0 overflow-hidden rounded-xl bg-card">
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/95 text-sm text-muted-foreground">
          Loading secure checkout…
        </div>
      )}
      {status === 'error' && error && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          {error}
        </div>
      )}
      {status !== 'error' && <div ref={mountRef} className="min-h-[420px] w-full" aria-label="Stripe payment form" />}
    </div>
  );
}

export function ScholarshipEnrollmentPage(props: Props) {
  const options = React.useMemo(() => scholarshipCountryOptions(props.market), [props.market]);
  const [residence, setResidence] = React.useState('');
  const [billing, setBilling] = React.useState('');
  const [reservation, setReservation] = React.useState<ScholarshipReservationView | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [fallback, setFallback] = React.useState<{ ordinaryUrl: string; alternateUrl?: string | null } | null>(null);

  React.useEffect(() => {
    const identity = {
      offeringId: props.offeringId,
      siteCertId: props.siteCertId,
      tierSlug: props.tierSlug,
      market: props.market,
    };
    pushAnalyticsEvent('scholarship_page_view', {
      offering_id: props.offeringId,
      scholarship_market: props.market,
      pathway_level: props.tierSlug,
    });
    void recordScholarshipPageView(identity);
    let cancelled = false;
    void fetchExistingScholarshipReservation(identity)
      .then((result) => {
        if (!cancelled && result.data?.reservation) {
          setReservation(result.data.reservation);
          setResidence(result.data.reservation.countryCode);
          setBilling(result.data.reservation.countryCode);
        }
      })
      .catch(() => {
        if (!cancelled) setError('The scholarship reservation service could not be reached.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [props.market, props.offeringId, props.siteCertId, props.tierSlug]);

  const markExpired = React.useCallback(() => {
    setReservation((current) => current ? { ...current, status: 'expired' } : current);
    pushAnalyticsEvent('expired', {
      offering_id: props.offeringId,
      scholarship_market: props.market,
    });
  }, [props.market, props.offeringId]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setFallback(null);
    const result = await reserveScholarshipPrice({
      offeringId: props.offeringId,
      siteCertId: props.siteCertId,
      tierSlug: props.tierSlug,
      market: props.market,
      residenceCountry: residence,
      billingCountry: billing,
    });
    if (result.data?.reservation) {
      setReservation(result.data.reservation);
      pushAnalyticsEvent('reservation_started', {
        offering_id: props.offeringId,
        scholarship_market: props.market,
        delivery_mode: 'mentor_led',
        currency: result.data.reservation.currency,
        value: result.data.reservation.finalUnitAmount / 10 ** currencyMinorUnit(result.data.reservation.currency),
      });
    } else {
      const reason = result.data?.reason;
      setError(
        reason === 'south_asia_excluded'
          ? 'Pakistan and India are not eligible for this scholarship. Normal enrollment and pricing remain available.'
          : reason === 'country_mismatch'
            ? 'Residence and billing country must be the same valid country.'
            : reason === 'global_required'
              ? 'GCC residents should use the GCC scholarship link.'
              : reason === 'gcc_required'
                ? 'This link is only for GCC residence and billing countries.'
                : result.error ?? 'Scholarship eligibility could not be confirmed.',
      );
      if (result.data?.ordinaryUrl) {
        setFallback({ ordinaryUrl: result.data.ordinaryUrl, alternateUrl: result.data.alternateScholarshipUrl });
      }
    }
    setLoading(false);
  }

  const expired = reservation?.status === 'expired' || (reservation ? remainingSeconds(reservation.expiresAt) === 0 : false);
  const ordinaryUrl = `/certifications/${props.siteCertId}/${props.tierSlug}/enroll`;

  return (
    <section className={sectionSurface('blend', 'py-12 md:py-20')}>
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto w-full max-w-6xl px-4">
        <div className="mb-8 max-w-3xl">
          <p className="text-label mb-2 text-brand-orange">Shareable 15% scholarship · {props.market.toUpperCase()}</p>
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">
            {props.certName} {props.tierSlug === 'professional' ? 'Professional' : 'Mastery'} enrollment
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Exactly 15% off the existing Mentor-led price. This link may be reshared. Self-paced and every other delivery mode remain at normal pricing and are not available on this route.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
              <p className="text-label text-brand-orange">Mentor-led only</p>
              <h2 className="mt-2 text-2xl font-bold">{props.courseName}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Weekly mentor-led sessions · one non-stackable scholarship · no promotion codes</p>
            </div>

            {!reservation && (
              <form onSubmit={submit} className="space-y-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div>
                  <h2 className="text-xl font-bold">Confirm scholarship market</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Residence and billing country must match. The server will bind the confirmed country to the reservation and checkout.
                  </p>
                </div>
                {(['residence', 'billing'] as const).map((field) => (
                  <label key={field} className="block text-sm font-semibold">
                    {field === 'residence' ? 'Country of residence' : 'Billing country'}
                    <select
                      required
                      value={field === 'residence' ? residence : billing}
                      onChange={(event) => field === 'residence' ? setResidence(event.target.value) : setBilling(event.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                    >
                      <option value="">Select country</option>
                      {options.map((option) => <option key={option.code} value={option.code}>{option.name}</option>)}
                    </select>
                  </label>
                ))}
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                {fallback && (
                  <div className="flex flex-col gap-2 text-sm">
                    <Link className="font-semibold text-brand-orange hover:underline" href={fallback.ordinaryUrl}>Continue at normal enrollment and pricing</Link>
                    {fallback.alternateUrl && <Link className="font-semibold text-brand-orange hover:underline" href={fallback.alternateUrl}>Open the correct scholarship market</Link>}
                  </div>
                )}
                <Button type="submit" variant="brand" size="lg" className="w-full rounded-xl" disabled={loading || !residence || !billing}>
                  {loading ? 'Confirming…' : 'Reserve scholarship price'}
                </Button>
              </form>
            )}

            {reservation && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <p className="text-sm font-semibold text-muted-foreground">Original Mentor-led price</p>
                <p className="mt-1 text-xl text-muted-foreground line-through">
                  {formatScholarshipAmount(reservation.currency, reservation.baseUnitAmount)}
                </p>
                <p className="mt-4 text-sm font-semibold text-brand-orange">Scholarship price · 15% off</p>
                <p className="mt-1 text-4xl font-bold tracking-tight">
                  {formatScholarshipAmount(reservation.currency, reservation.finalUnitAmount)}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">Country: {scholarshipRegionName(reservation.countryCode)}</p>
                <div className="mt-6 border-t border-border pt-5">
                  <p className="mb-2 text-sm font-semibold">Scholarship price reserved for 15 minutes</p>
                  {expired ? <p className="text-xl font-bold text-destructive">Reservation expired</p> : <ReservationTimer expiresAt={reservation.expiresAt} onExpired={markExpired} />}
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    The deadline is enforced by the server and persists across refreshes. Any still-open Stripe Checkout Session is expired when this reservation ends.
                  </p>
                </div>
              </div>
            )}

            <Link href={ordinaryUrl} className="inline-flex text-sm font-semibold text-muted-foreground hover:text-brand-orange">
              Ordinary enrollment and normal prices remain unchanged
            </Link>
          </div>

          <div className="min-w-0 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
            {!reservation ? (
              <div className="flex min-h-[420px] items-center justify-center text-center text-sm text-muted-foreground">
                Confirm an eligible country to reserve the exact price and unlock checkout.
              </div>
            ) : expired || reservation.status === 'rejected' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center">
                <p className="text-xl font-bold">Scholarship reservation unavailable</p>
                <p className="max-w-sm text-sm text-muted-foreground">The scholarship price cannot be reset by refreshing or reopening this link in the same browser.</p>
                <Link href={ordinaryUrl} className="font-semibold text-brand-orange hover:underline">Continue at normal enrollment and pricing</Link>
              </div>
            ) : (
              <ScholarshipStripeCheckout reservation={reservation} publishableKeyHint={props.publishableKeyHint} onExpired={markExpired} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
