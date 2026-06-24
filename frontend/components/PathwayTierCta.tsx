'use client';

import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PathwayTier } from '@/types/site';
import type { TierPathwayCta } from '@/lib/pathway-tier-cta';
import { tierDeliveryLine } from '@/lib/pathway-tier-cta';
import type { ProgrammeOfferingAssets } from '@pms/site-content';
import { PathwayOfferingModal } from '@/components/PathwayOfferingModal';
import {
  JoinWaitlistDialog,
  type JoinWaitlistContext,
} from '@/components/forms/JoinWaitlistDialog';
import { getOfferingById } from '@/lib/regional-catalogue';

export function PathwayTierCta({
  tier,
  pathwayCta,
  siteCertId,
  className,
  gradient,
  color,
  programmeAssetsByOffering,
}: {
  tier: PathwayTier;
  pathwayCta: TierPathwayCta;
  siteCertId: string;
  className?: string;
  popular?: boolean;
  gradient?: string;
  accentClass?: string;
  color?: string;
  programmeAssetsByOffering?: Record<string, ProgrammeOfferingAssets>;
}) {
  const [open, setOpen] = React.useState(false);
  const offeringId = tier.offeringId ?? 'pathway';
  const offering = getOfferingById(offeringId);
  const tierId = offering?.tierId ?? 'foundation';
  const isWaitlist = pathwayCta.modalMode === 'waitlist';
  const programmeAssets = programmeAssetsByOffering?.[offeringId] ?? null;

  const waitlistContext: JoinWaitlistContext = {
    headline: tier.title,
    subject: `Waitlist: ${tier.title}`,
    offeringId,
    siteCertId,
    tierId,
    formId: 'pathway_waitlist',
    formLabel: 'Pathway waitlist',
    placement: `Pathway: ${tier.title}`,
  };

  const buttonClassName = cn(
    'w-full h-12 rounded-2xl font-bold text-base text-white border-transparent shadow-md transition-all hover:opacity-90 inline-flex items-center justify-center group/btn',
    gradient && cn('bg-gradient-to-r', gradient),
    className,
  );

  const buttonStyle: React.CSSProperties | undefined =
    !gradient && color ? { backgroundColor: color } : undefined;

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName}
        style={buttonStyle}
      >
        {pathwayCta.label}
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
      </Button>

      <PathwayOfferingModal
        open={open && !isWaitlist}
        onOpenChange={setOpen}
        programmeTitle={tier.title}
        offeringId={offeringId}
        siteCertId={siteCertId}
        tierId={tierId}
        duration={tier.duration}
        deliveryLine={tierDeliveryLine(tier.tierDelivery ?? tier.deliveryMode)}
        pathwayCta={pathwayCta}
        outcomes={tier.outcomes}
        programmeAssets={programmeAssets}
      />

      <JoinWaitlistDialog
        open={open && isWaitlist}
        onOpenChange={setOpen}
        context={waitlistContext}
      />
    </>
  );
}
