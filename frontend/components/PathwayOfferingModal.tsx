'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TierPathwayCta } from '@/lib/pathway-tier-cta';
import type { ProgrammeOfferingAssets } from '@pms/site-content';
import { getProgrammePreviewContent } from '@/lib/pathway-programme-preview';
import { usePublishedProgrammeAssets } from '@/lib/use-published-programme-assets';
import {
  PathwayModalPreviewFlow,
  PathwayModalStepActions,
  type PathwayModalStep,
} from '@/components/PathwayModalPreviewFlow';
import { openPathwayConsultationCalendly } from '@/lib/pathway-consultation-scheduling';
import { TrackedConversionLink } from '@/components/analytics/TrackedConversionLink';
import { getPmpEnrollConversionEvent } from '@/lib/analytics/conversion-events';
import { CTAS } from '@/lib/brand-voice';
import { useLeadRecoveryOptional } from '@/components/conversion-recovery/LeadRecoveryProvider';
import { pathwayExitVariant, tierIdFromPathwayTier } from '@/lib/conversion-recovery/copy';
import { markIntent } from '@/lib/conversion-recovery/engagement-score';
import {
  setEnrollStarted,
  setPathwayModalTierOpened,
} from '@/lib/conversion-recovery/session-state';

interface PathwayOfferingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programmeTitle: string;
  offeringId: string;
  siteCertId: string;
  tierId: string;
  duration: string;
  deliveryLine: string;
  pathwayCta: TierPathwayCta;
  outcomes: string[];
  programmeAssets?: ProgrammeOfferingAssets | null;
}

export function PathwayOfferingModal({
  open,
  onOpenChange,
  programmeTitle,
  offeringId,
  siteCertId,
  tierId,
  duration,
  deliveryLine,
  pathwayCta,
  outcomes,
  programmeAssets,
}: PathwayOfferingModalProps) {
  const recovery = useLeadRecoveryOptional();
  const actionRef = React.useRef<'none' | 'enroll' | 'consultation'>('none');
  const [step, setStep] = React.useState<PathwayModalStep>('roadmap');

  React.useEffect(() => {
    if (open) {
      actionRef.current = 'none';
      setStep('roadmap');
      markIntent();
      setPathwayModalTierOpened(tierId);
    }
  }, [open, tierId]);

  const handleOpenChange = (next: boolean) => {
    if (!next && open && actionRef.current === 'none') {
      const recoveryCtx = {
        variant: pathwayExitVariant(tierId),
        siteCertId,
        tierId: tierIdFromPathwayTier(tierId),
        offeringId,
        parentSurface: 'pathway_modal' as const,
      };
      recovery?.requestRecovery(recoveryCtx, {
        requireIntent: true,
        intentRecovery: true,
        bypassPageVariantCap: true,
        bypassSessionCap: true,
      });
      onOpenChange(false);
      return;
    }
    onOpenChange(next);
  };

  const { assets: publishedAssets, isLoading: assetsLoading } = usePublishedProgrammeAssets(
    siteCertId,
    offeringId,
    open,
  );

  const resolvedProgrammeAssets = React.useMemo(
    () => publishedAssets ?? programmeAssets ?? null,
    [publishedAssets, programmeAssets],
  );

  const preview = React.useMemo(
    () => getProgrammePreviewContent(offeringId, programmeTitle, resolvedProgrammeAssets),
    [offeringId, programmeTitle, resolvedProgrammeAssets],
  );

  const dualActions = pathwayCta.showConsultationInModal && pathwayCta.enrollHref;
  const singleEnroll = pathwayCta.enrollHref && !pathwayCta.showConsultationInModal;
  const singleOther = !pathwayCta.enrollHref;

  const mentorCtaLabel = pathwayCta.consultationLabel ?? CTAS.pathwayMentorCta;

  const intro =
    step === 'roadmap'
      ? 'Start with your pathway map, then continue to preview programme materials.'
      : 'Watch the overview video, review the documents, then enrol when you are ready.';

  const handleConsultation = () => {
    actionRef.current = 'consultation';
    onOpenChange(false);
    openPathwayConsultationCalendly(siteCertId, tierId, offeringId);
  };

  const enrollEvent = siteCertId === 'pmp' ? getPmpEnrollConversionEvent(tierId) : null;

  const EnrollLink = ({
    href,
    label,
    className,
  }: {
    href: string;
    label: string;
    className?: string;
  }) =>
    enrollEvent ? (
      <TrackedConversionLink
        href={href}
        event={enrollEvent}
        onClick={() => {
          actionRef.current = 'enroll';
          setEnrollStarted(offeringId, tierId, siteCertId);
          onOpenChange(false);
        }}
        className={className}
      >
        {label}
      </TrackedConversionLink>
    ) : (
      <Link
        href={href}
        onClick={() => {
          actionRef.current = 'enroll';
          setEnrollStarted(offeringId, tierId, siteCertId);
          onOpenChange(false);
        }}
        className={className}
      >
        {label}
      </Link>
    );

  const enrollActions = (
    <>
      {dualActions && pathwayCta.enrollHref ? (
        <EnrollLink
          href={pathwayCta.enrollHref}
          label={pathwayCta.enrollLabel}
          className={cn(buttonVariants({ variant: 'brand' }), 'h-12 w-full rounded-2xl text-base')}
        />
      ) : null}
      {dualActions ? (
        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-2xl text-base border-brand-orange/30 text-brand-orange hover:bg-brand-orange/5"
          onClick={handleConsultation}
        >
          {mentorCtaLabel}
        </Button>
      ) : null}
      {singleEnroll && pathwayCta.enrollHref ? (
        <EnrollLink
          href={pathwayCta.enrollHref}
          label={pathwayCta.enrollLabel}
          className={cn(buttonVariants({ variant: 'brand' }), 'h-12 w-full rounded-2xl text-base')}
        />
      ) : null}
      {singleOther ? (
        pathwayCta.modalMode === 'consultation' || pathwayCta.showConsultationInModal ? (
          <Button
            type="button"
            className={cn(buttonVariants({ variant: 'brand' }), 'h-12 w-full rounded-2xl text-base')}
            onClick={handleConsultation}
          >
            {pathwayCta.proceedLabel}
          </Button>
        ) : (
          <Link
            href={pathwayCta.proceedHref}
            onClick={() => {
              actionRef.current = 'enroll';
              onOpenChange(false);
            }}
            className={cn(buttonVariants({ variant: 'brand' }), 'h-12 w-full rounded-2xl text-base')}
          >
            {pathwayCta.proceedLabel}
          </Link>
        )
      ) : null}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[min(92vh,900px)] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight pr-8">{programmeTitle}</DialogTitle>
          <DialogDescription className="text-base font-medium leading-relaxed">{intro}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4 py-2 min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-wrap gap-2 text-label">
            {duration ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{duration}</span>
            ) : null}
            {deliveryLine ? (
              <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-brand-orange">{deliveryLine}</span>
            ) : null}
          </div>

          <PathwayModalPreviewFlow
            preview={preview}
            step={step}
            outcomes={outcomes}
            materialsLoading={assetsLoading && step === 'materials'}
          />
        </DialogBody>

        <DialogFooter className="flex-col gap-2 sm:flex-col shrink-0">
          <PathwayModalStepActions
            step={step}
            onNext={() => setStep('materials')}
            onBack={() => setStep('roadmap')}
            enrollActions={enrollActions}
          />
          <Button
            type="button"
            variant="ghost"
            className="w-full text-slate-500"
            onClick={() => handleOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
