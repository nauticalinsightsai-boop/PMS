'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RegionalPrice } from '@/components/RegionalPrice';
import { StripeEmbeddedSeatCheckout } from '@/components/enrollment/StripeEmbeddedSeatCheckout';
import { SeatReservationTimer } from '@/components/enrollment/SeatReservationTimer';
import { ScholarshipSessionGate } from '@/components/enrollment/ScholarshipSessionGate';
import { useRegionalOffering } from '@/hooks/useRegionalOffering';
import { useRegion } from '@/contexts/RegionContext';
import { enrollPath, enrollSuccessPath } from '@/lib/enrollment-routes';
import {
  applyScholarshipDiscountDisplay,
  eliteScholarshipBanner,
  isScholarshipAllowedRegion,
  scholarshipDiscountPct,
} from '@/lib/enrollment/scholarship-offer';
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
  scholarshipMode?: boolean;
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
  scholarshipMode = false,
}: ProgramEnrollmentFormProps) {
  const data = useRegionalOffering(offeringId);
  const { regionId, gccCountry } = useRegion();
  const router = useRouter();
  const offeringMeta = getOfferingById(offeringId);
  const tierId = offeringMeta?.tierId ?? 'foundation';

  const [paymentMode, setPaymentMode] = React.useState<EnrollmentPaymentMode>(() =>
    scholarshipMode ? 'mentor_led' : defaultPaymentMode(tierId),
  );

  React.useEffect(() => {
    setPaymentMode(scholarshipMode ? 'mentor_led' : defaultPaymentMode(tierId));
  }, [tierId, offeringId, scholarshipMode]);

  React.useEffect(() => {
    setEnrollStarted(offeringId, tierSlug, siteCertId);
  }, [offeringId, siteCertId, tierSlug]);

  React.useEffect(() => {
    if (!scholarshipMode) return;
    if (regionId === 'india' || regionId === 'pakistan') {
      router.replace(enrollPath(siteCertId, tierSlug));
    }
  }, [scholarshipMode, regionId, router, siteCertId, tierSlug]);

  if (!data || !offeringMeta) {
    return <p className="text-muted-foreground">Offering not found.</p>;
  }

  if (scholarshipMode && (regionId === 'india' || regionId === 'pakistan')) {
    return (
      <p className="text-muted-foreground text-sm">
        Redirecting to your regional enrollment page…
      </p>
    );
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
  const globalMentorPrices = resolveDeliveryPriceDisplay(
    offeringMeta,
    'global',
    'mentor_led',
    null,
  );
  const selfPacedPrices = resolveDeliveryPriceDisplay(
    offeringMeta,
    regionId,
    'self_paced',
    gccCountry,
  );

  const scholarshipActive =
    scholarshipMode && isScholarshipAllowedRegion(regionId)
      ? applyScholarshipDiscountDisplay(globalMentorPrices.active, regionId)
      : null;
  const scholarshipPct = scholarshipDiscountPct(regionId);

  const activePrices =
    scholarshipMode
      ? {
          ...mentorPrices,
          original: globalMentorPrices.active,
          active: scholarshipActive ?? globalMentorPrices.active,
          showScholarshipLabels: true,
          regionalLabel: eliteScholarshipBanner(regionId),
        }
      : paymentMode === 'self_paced'
        ? selfPacedPrices
        : usesDeliveryModes
          ? mentorPrices
          : data.prices;

  const fullLabel = activePrices.active;
  const depositLabel = formatRegionalDepositDisplay(data.prices.active);
  const canPayInFull = canOfferFullTuitionOnEnroll(data.rule.status, data.prices.active);
  const isDeposit = !scholarshipMode && paymentMode === 'seat_deposit';
  const isSelfPaced = !scholarshipMode && paymentMode === 'self_paced';
  const isMentorLed = paymentMode === 'mentor_led';

  const checkoutPaymentMode: EnrollmentPaymentMode = scholarshipMode
    ? 'mentor_led'
    : usesDeliveryModes && !isDeliveryMode(paymentMode)
      ? 'mentor_led'
      : paymentMode;

  const priceAndModes = (
    <>
      <div>
        <h2 className="text-xl font-bold text-foreground md:text-2xl">{data.offering.courseName}</h2>
        <p className="text-sm text-muted-foreground">{tierLabel}</p>
        {scholarshipMode ? (
          <p className="mt-3 rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-3 py-2 text-sm font-medium text-foreground">
            {eliteScholarshipBanner(regionId)}
          </p>
        ) : null}
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed md:text-base">
          {scholarshipMode ? (
            <>
              Pay {fullLabel ?? 'Elite scholarship tuition'} today for mentor-led weekly sessions —{' '}
              {scholarshipPct}% off the Global mentor-led catalogue price
              {regionId === 'gcc' ? ' (GCC Elite invite)' : ''}. Support will confirm onboarding within
              24 hours.
            </>
          ) : isFoundation ? (
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

        {scholarshipMode ? (
          <div className="border-t border-border px-4 py-4 sm:px-5 sm:pb-5">
            <p className="text-label text-brand-orange mb-1">Delivery</p>
            <p className="text-sm font-semibold text-foreground">Mentor-led</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Weekly sessions · scholarship applies to mentor-led tuition only
            </p>
          </div>
        ) : isFoundation ? null : isProfessional ? (
          <fieldset className="border-t border-border px-4 pt-4 sm:px-5 sm:pb-5">
            <legend className="text-label text-brand-orange mb-3">Delivery option</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                aria-pressed={isSelfPaced}
                onClick={() => setPaymentMode('self_paced')}
                disabled={!selfPacedPrices.active}
                className={cn(
                  'rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2',
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
                aria-pressed={isMentorLed}
                onClick={() => setPaymentMode('mentor_led')}
                className={cn(
                  'rounded-xl border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2',
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
          </fieldset>
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
    </>
  );

  const checkoutPanel = (checkoutAllowed: boolean) => (
    <div className="space-y-4 lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <div className="border-b border-border bg-muted/15 px-4 py-4 dark:bg-muted/10 sm:px-5">
          <p className="text-label text-brand-orange mb-1">
            {isDeposit ? 'Complete reservation' : 'Complete payment'}
          </p>
          <p className="text-xs text-muted-foreground">Secure card checkout powered by Stripe</p>
        </div>
        <div className="px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          {checkoutAllowed ? (
            <StripeEmbeddedSeatCheckout
              offeringId={offeringId}
              siteCertId={siteCertId}
              tierSlug={tierSlug}
              paymentMode={checkoutPaymentMode}
              publishableKeyHint={publishableKeyHint}
              offerType={scholarshipMode ? 'scholarship_invite' : undefined}
            />
          ) : (
            <p className="rounded-lg border border-border bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
              Checkout is unavailable until a new scholarship session starts.
            </p>
          )}
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
  );

  if (scholarshipMode) {
    return (
      <ScholarshipSessionGate offeringId={offeringId}>
        {({ checkoutAllowed }) => (
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10 xl:gap-x-14 lg:space-y-0">
            <div className="space-y-6">{priceAndModes}</div>
            {checkoutPanel(checkoutAllowed)}
          </div>
        )}
      </ScholarshipSessionGate>
    );
  }

  return (
    <div className="space-y-6 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-10 xl:gap-x-14 lg:space-y-0">
      <div className="space-y-6">
        {isDeposit && <SeatReservationTimer offeringId={offeringId} />}
        {priceAndModes}
      </div>
      {checkoutPanel(true)}
    </div>
  );
}
