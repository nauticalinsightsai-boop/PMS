'use client';

import * as React from 'react';
import Link from 'next/link';
import { RegionalPrice } from '@/components/RegionalPrice';
import { StripeEmbeddedSeatCheckout } from '@/components/enrollment/StripeEmbeddedSeatCheckout';
import { SeatReservationTimer } from '@/components/enrollment/SeatReservationTimer';
import { useRegionalOffering } from '@/hooks/useRegionalOffering';
import { useRegion } from '@/contexts/RegionContext';
import { enrollSuccessPath } from '@/lib/enrollment-routes';
import {
  canOfferFullTuitionOnEnroll,
  formatRegionalDepositDisplay,
  isDeliveryMode,
  type EnrollmentPaymentMode,
} from '@/lib/enrollment/seat-reservation';
import { getOfferingById, resolveDeliveryPriceDisplay } from '@/lib/regional-catalogue';
import { setEnrollStarted } from '@/lib/conversion-recovery/session-state';
import { cn } from '@/lib/utils';

type ProgramEnrollmentFormProps = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
  publishableKeyHint?: string | null;
};

function defaultPaymentMode(tierId: string): EnrollmentPaymentMode {
  if (tierId === 'foundation') return 'self_paced';
  if (tierId === 'professional') return 'self_paced';
  return 'seat_deposit';
}

export function ProgramEnrollmentForm({
  offeringId,
  siteCertId,
  tierSlug,
  publishableKeyHint = null,
}: ProgramEnrollmentFormProps) {
  const data = useRegionalOffering(offeringId);
  const { regionId, gccCountry } = useRegion();
  const offeringMeta = getOfferingById(offeringId);
  const tierId = offeringMeta?.tierId ?? 'foundation';

  const [paymentMode, setPaymentMode] = React.useState<EnrollmentPaymentMode>(() =>
    defaultPaymentMode(tierId),
  );

  React.useEffect(() => {
    setPaymentMode(defaultPaymentMode(tierId));
  }, [tierId, offeringId]);

  React.useEffect(() => {
    setEnrollStarted(offeringId, tierSlug, siteCertId);
  }, [offeringId, siteCertId, tierSlug]);

  if (!data || !offeringMeta) {
    return <p className="text-muted-foreground">Offering not found.</p>;
  }

  const tierLabel = offeringMeta.tier ?? tierSlug.replace(/-/g, ' ');
  const isFoundation = tierId === 'foundation';
  const isProfessional = tierId === 'professional';
  const usesDeliveryModes = isFoundation || isProfessional;

  const mentorPrices = resolveDeliveryPriceDisplay(
    offeringMeta,
    regionId,
    'mentor_led',
    gccCountry,
  );
  const selfPacedPrices = resolveDeliveryPriceDisplay(
    offeringMeta,
    regionId,
    'self_paced',
    gccCountry,
  );

  const activePrices =
    paymentMode === 'self_paced'
      ? selfPacedPrices
      : usesDeliveryModes
        ? mentorPrices
        : data.prices;

  const fullLabel = activePrices.active;
  const depositLabel = formatRegionalDepositDisplay(data.prices.active);
  const canPayInFull = canOfferFullTuitionOnEnroll(data.rule.status, data.prices.active);
  const isDeposit = paymentMode === 'seat_deposit';
  const isSelfPaced = paymentMode === 'self_paced';
  const isMentorLed = paymentMode === 'mentor_led';

  return (
    <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10 xl:gap-x-14 lg:space-y-0">
      <div className="space-y-6">
        {isDeposit && <SeatReservationTimer offeringId={offeringId} />}

        <div>
          <h2 className="text-xl font-bold text-foreground md:text-2xl">{data.offering.courseName}</h2>
          <p className="text-sm text-muted-foreground">{tierLabel}</p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed md:text-base">
            {isFoundation ? (
              <>
                Pay {fullLabel ?? 'pathway tuition'} today for the self-paced online curriculum. Includes one mentor
                guidance meeting after you complete the course, before certification is issued. Support will confirm
                onboarding within 24 hours.
              </>
            ) : isProfessional ? (
              isSelfPaced ? (
                <>
                  Pay {fullLabel ?? 'pathway tuition'} today for self-paced online access. Includes two one-hour mentor
                  meetings: one at the start and one at the end. Support will confirm onboarding within 24 hours.
                </>
              ) : (
                <>
                  Pay {fullLabel ?? 'pathway tuition'} today for mentor-led weekly sessions. Support will confirm
                  onboarding within 24 hours.
                </>
              )
            ) : isDeposit ? (
              <>
                Pay {depositLabel ?? '25% of pathway tuition'} to reserve your seat. Includes two mentor meetings (start
                and end). Support will schedule your onboarding call within 24 hours. You&apos;ll pay the remaining
                balance during that call.
              </>
            ) : (
              <>
                Pay {fullLabel ?? 'pathway tuition'} in full today. Includes two mentor meetings (start and end). Support
                will confirm onboarding within 24 hours.
              </>
            )}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="p-4 sm:p-5">
            <RegionalPrice
              original={activePrices.original}
              active={activePrices.active}
              membership={null}
              showScholarshipLabels={activePrices.showScholarshipLabels}
              regionalLabel={activePrices.regionalLabel}
              footnote={data.rule.regionMessage ?? activePrices.footnote}
              variant="full"
            />
          </div>

          {isFoundation ? null : isProfessional ? (
            <div className="border-t border-border px-4 pt-4 sm:px-5 sm:pb-5">
              <p className="text-label text-brand-orange mb-3">Delivery option</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('self_paced')}
                  disabled={!selfPacedPrices.active}
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left transition-colors',
                    !selfPacedPrices.active && 'cursor-not-allowed opacity-60',
                    isSelfPaced && selfPacedPrices.active
                      ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/30'
                      : 'border-border bg-background hover:border-brand-orange/40',
                  )}
                >
                  <span className="block text-sm font-semibold text-foreground">Self-paced online</span>
                  <span className="mt-2 block space-y-0.5 text-xs leading-snug text-muted-foreground">
                    <span className="block">Two 1-hour mentor meetings</span>
                    <span className="block">Start and end of pathway</span>
                    {selfPacedPrices.active ? (
                      <span className="block font-medium text-foreground/80">
                        {selfPacedPrices.active}{' '}
                        <span className="font-normal text-muted-foreground">today</span>
                      </span>
                    ) : null}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('mentor_led')}
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left transition-colors',
                    isMentorLed
                      ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/30'
                      : 'border-border bg-background hover:border-brand-orange/40',
                  )}
                >
                  <span className="block text-sm font-semibold text-foreground">Mentor-led</span>
                  <span className="mt-2 block space-y-0.5 text-xs leading-snug text-muted-foreground">
                    <span className="block">Weekly sessions</span>
                    {mentorPrices.active ? (
                      <span className="block font-medium text-foreground/80">
                        {mentorPrices.active}{' '}
                        <span className="font-normal text-muted-foreground">today</span>
                      </span>
                    ) : null}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-border px-4 pt-4 sm:px-5 sm:pb-5">
              <p className="text-label text-brand-orange mb-3">Payment option</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMode('seat_deposit')}
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left transition-colors',
                    isDeposit
                      ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/30'
                      : 'border-border bg-background hover:border-brand-orange/40',
                  )}
                >
                  <span className="block text-sm font-semibold text-foreground">Reserve seat</span>
                  <span className="mt-2 block space-y-0.5 text-xs leading-snug text-muted-foreground">
                    <span className="block">25% deposit</span>
                    {depositLabel ? (
                      <span className="block font-medium text-foreground/80">
                        {depositLabel} <span className="font-normal text-muted-foreground">today</span>
                      </span>
                    ) : null}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('full_tuition')}
                  disabled={!canPayInFull}
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left transition-colors',
                    !canPayInFull && 'cursor-not-allowed opacity-60',
                    !isDeposit && canPayInFull
                      ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/30'
                      : 'border-border bg-background hover:border-brand-orange/40',
                  )}
                >
                  <span className="block text-sm font-semibold text-foreground">Pay in full</span>
                  <span className="mt-2 block space-y-0.5 text-xs leading-snug text-muted-foreground">
                    <span className="block">One payment</span>
                    {data.prices.active ? (
                      <span className="block font-medium text-foreground/80">
                        {data.prices.active}{' '}
                        <span className="font-normal text-muted-foreground">today</span>
                      </span>
                    ) : null}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
          <div className="border-b border-border bg-muted/15 px-4 py-4 dark:bg-muted/10 sm:px-5">
            <p className="text-label text-brand-orange mb-1">
              {isDeposit ? 'Complete reservation' : 'Complete payment'}
            </p>
            <p className="text-xs text-muted-foreground">Secure card checkout powered by Stripe</p>
          </div>
          <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
            <StripeEmbeddedSeatCheckout
              offeringId={offeringId}
              siteCertId={siteCertId}
              tierSlug={tierSlug}
              paymentMode={
                usesDeliveryModes && !isDeliveryMode(paymentMode) ? 'mentor_led' : paymentMode
              }
              publishableKeyHint={publishableKeyHint}
            />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground lg:text-left">
          Already paid?{' '}
          <Link
            href={`${enrollSuccessPath(siteCertId, tierSlug)}?offering=${encodeURIComponent(offeringId)}`}
            className="text-brand-orange font-semibold hover:underline"
          >
            View confirmation
          </Link>
        </p>
      </div>
    </div>
  );
}
