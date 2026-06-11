'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import type { CtaRoute } from '@/lib/cta-router';
import { openPathwayConsultationCalendly } from '@/lib/pathway-consultation-scheduling';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';
import { cn } from '@/lib/utils';

interface OfferingCtaButtonsProps {
  ctas: CtaRoute;
  primaryHref: string;
  secondaryHref: string;
  offeringId: string;
  siteCertId: string;
  tierId?: string;
  className?: string;
  vertical?: boolean;
}

function ConsultationButton({
  label,
  offeringId,
  siteCertId,
  tierId = 'foundation',
  className,
  variant = 'outline',
}: {
  label: string;
  offeringId: string;
  siteCertId: string;
  tierId?: string;
  className?: string;
  variant?: 'default' | 'outline';
}) {
  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={() => {
        markIntent();
        openPathwayConsultationCalendly(siteCertId, tierId, offeringId);
      }}
    >
      {label}
    </Button>
  );
}

export function OfferingCtaButtons({
  ctas,
  primaryHref,
  secondaryHref,
  offeringId,
  siteCertId,
  tierId,
  className,
  vertical,
}: OfferingCtaButtonsProps) {
  if (ctas.primary === 'hidden') return null;

  const primaryIsConsultation = ctas.primary === 'consultation';
  const secondaryIsConsultation = ctas.secondary === 'consultation';

  return (
    <div
      className={cn(
        'flex gap-3',
        vertical ? 'flex-col' : 'flex-wrap',
        className
      )}
    >
      {primaryIsConsultation ? (
        <ConsultationButton
          label={ctas.primaryLabel}
          offeringId={offeringId}
          siteCertId={siteCertId}
          tierId={tierId}
          variant="default"
          className={cn(buttonVariants(), 'rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white')}
        />
      ) : (
        <Link
          href={primaryHref}
          className={cn(buttonVariants(), 'rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white')}
        >
          {ctas.primaryLabel}
        </Link>
      )}
      {ctas.secondary !== 'hidden' && ctas.secondaryLabel && (
        secondaryIsConsultation ? (
          <ConsultationButton
            label={ctas.secondaryLabel}
            offeringId={offeringId}
            siteCertId={siteCertId}
            tierId={tierId}
            className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full')}
          />
        ) : (
          <Link
            href={secondaryHref}
            className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full')}
          >
            {ctas.secondaryLabel}
          </Link>
        )
      )}
    </div>
  );
}
