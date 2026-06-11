'use client';

import * as React from 'react';
import Link from 'next/link';
import { RegionalPrice } from '@/components/RegionalPrice';
import { StripeEmbeddedSeatCheckout } from '@/components/enrollment/StripeEmbeddedSeatCheckout';
import { SeatReservationTimer } from '@/components/enrollment/SeatReservationTimer';
import { useRegionalOffering } from '@/hooks/useRegionalOffering';
import { enrollSuccessPath } from '@/lib/enrollment-routes';
import { formatSeatDeposit, resolveSeatDepositUsd } from '@/lib/enrollment/seat-reservation';
import { getOfferingById } from '@/lib/regional-catalogue';
import { setEnrollStarted } from '@/lib/conversion-recovery/session-state';

type ProgramEnrollmentFormProps = {
  offeringId: string;
  siteCertId: string;
  tierSlug: string;
};

export function ProgramEnrollmentForm({ offeringId, siteCertId, tierSlug }: ProgramEnrollmentFormProps) {
  const data = useRegionalOffering(offeringId);

  const depositUsd = resolveSeatDepositUsd(tierSlug);
  const depositLabel = formatSeatDeposit(depositUsd);

  React.useEffect(() => {
    setEnrollStarted(offeringId, tierSlug, siteCertId);
  }, [offeringId, siteCertId, tierSlug]);

  if (!data) {
    return <p className="text-slate-500">Offering not found.</p>;
  }

  const offeringMeta = getOfferingById(offeringId);
  const tierLabel = offeringMeta?.tier ?? tierSlug.replace(/-/g, ' ');

  return (
    <div className="space-y-6">
      <SeatReservationTimer offeringId={offeringId} />

      <div>
        <h2 className="text-xl font-bold">{data.offering.courseName}</h2>
        <p className="text-sm text-slate-500">{tierLabel}</p>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Pay {depositLabel} now to reserve your seat. Support will schedule your onboarding call within 24 hours.
          You&apos;ll pay the remaining pathway tuition during that onboarding call.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/40">
        <div className="p-4">
          <RegionalPrice
            original={data.prices.original}
            active={data.prices.active}
            showScholarshipLabels={data.showScholarshipLabels}
            regionalLabel={data.prices.regionalLabel}
            footnote={data.rule.regionMessage ?? data.prices.footnote}
            variant="full"
          />
        </div>

        <div className="border-t border-slate-100 px-4 pb-4 pt-3 dark:border-slate-800 sm:px-5 sm:pb-5">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-brand-orange">
            Complete reservation
          </p>
          <StripeEmbeddedSeatCheckout
            offeringId={offeringId}
            siteCertId={siteCertId}
            tierSlug={tierSlug}
          />
        </div>
      </div>

      <p className="text-center text-xs text-slate-500">
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
}
