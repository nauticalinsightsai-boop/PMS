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
  popular,
  gradient,
  accentClass,
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

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'h-14 w-full rounded-[1rem] font-black text-lg group/btn transition-all shadow-xl hover:shadow-brand-orange/20',
          popular
            ? gradient
              ? cn('bg-gradient-to-r text-white', gradient)
              : cn(accentClass, 'hover:opacity-90 text-white')
            : 'bg-obsidian hover:bg-brand-orange text-white dark:bg-slate-800 dark:hover:bg-brand-orange',
          className,
        )}
        style={popular && !gradient && color ? { backgroundColor: color } : undefined}
      >
        {pathwayCta.label}
        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
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
