'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PathwayTier } from '@/types/site';
import type { TierPathwayCta } from '@/lib/pathway-tier-cta';
import { tierDeliveryLine } from '@/lib/pathway-tier-cta';
import { PathwayOfferingModal } from '@/components/PathwayOfferingModal';

export function PathwayTierCta({
  tier,
  pathwayCta,
  className,
  gradient,
  color,
}: {
  tier: PathwayTier;
  pathwayCta: TierPathwayCta;
  className?: string;
  popular?: boolean;
  gradient?: string;
  accentClass?: string;
  color?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const offeringId = tier.offeringId ?? 'pathway';

  const buttonStyle: React.CSSProperties | undefined =
    !gradient && color ? { backgroundColor: color } : undefined;

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'w-full h-12 rounded-2xl font-bold text-base text-white border-transparent shadow-md transition-all hover:opacity-90 inline-flex items-center justify-center group/btn',
          gradient && cn('bg-gradient-to-r', gradient),
          className,
        )}
        style={buttonStyle}
      >
        {pathwayCta.label}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Button>

      <PathwayOfferingModal
        open={open}
        onOpenChange={setOpen}
        programmeTitle={tier.title}
        offeringId={offeringId}
        duration={tier.duration}
        deliveryLine={tierDeliveryLine(tier.tierDelivery ?? tier.deliveryMode)}
        modalMode={pathwayCta.modalMode}
        proceedHref={pathwayCta.proceedHref}
        proceedLabel={pathwayCta.proceedLabel}
        outcomes={tier.outcomes}
      />
    </>
  );
}
