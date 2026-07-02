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
import { effectiveProgrammeAssets } from '@pms/site-content';
import { getProgrammePreviewContent } from '@/lib/pathway-programme-preview';
import { ProgrammePreviewExplorer } from '@/components/ProgrammePreviewExplorer';
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

  React.useEffect(() => {
    if (open) {
      actionRef.current = 'none';
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

  const resolvedProgrammeAssets = React.useMemo(
    () => effectiveProgrammeAssets(offeringId, programmeAssets ?? null),
    [offeringId, programmeAssets],
  );

  const preview = React.useMemo(
    () => getProgrammePreviewContent(offeringId, programmeTitle, resolvedProgrammeAssets),
    [offeringId, programmeTitle, resolvedProgrammeAssets],
  );

  const dualActions = pathwayCta.showConsultationInModal && pathwayCta.enrollHref;
  const singleEnroll = pathwayCta.enrollHref && !pathwayCta.showConsultationInModal;
  const singleOther = !pathwayCta.enrollHref;

  const mentorCtaLabel = pathwayCta.consultationLabel ?? CTAS.pathwayMentorCta;

  const enrollCtaLabel = pathwayCta.enrollLabel;

  const intro = dualActions
    ? `Review the pathway map below, then ${enrollCtaLabel.toLowerCase()} or ${mentorCtaLabel.toLowerCase()}.`
    : singleEnroll || pathwayCta.modalMode === 'enroll' || pathwayCta.modalMode === 'verify'
      ? 'Review the pathway map and materials below, then continue to secure your place.'
      : 'Review the pathway map and materials below, then take the next step with our team.';

  const handleConsultation = () => {
    actionRef.current = 'consultation';
    onOpenChange(false);
    openPathwayConsultationCalendly(siteCertId, tierId, offeringId);
  };

  const enrollEvent =
    siteCertId === 'pmp' ? getPmpEnrollConversionEvent(tierId) : null;

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-6xl lg:max-w-7xl max-h-[min(92vh,900px)] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight pr-8">{programmeTitle}</DialogTitle>
          <DialogDescription className="text-base font-medium leading-relaxed">{intro}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6 py-2 min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-wrap gap-2 text-label">
            {duration && <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{duration}</span>}
            {deliveryLine && (
              <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-brand-orange">{deliveryLine}</span>
            )}
          </div>

          <ProgrammePreviewExplorer preview={preview} />

          {outcomes.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/90">
              <p className="mb-3 text-label">Programme focus</p>
              <ul className="space-y-2">
                {outcomes.slice(0, 4).map((item) => (
                  <li key={item} className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogBody>

        <DialogFooter className="flex-col gap-2 sm:flex-col shrink-0">
          {dualActions && pathwayCta.enrollHref && (
            <EnrollLink
              href={pathwayCta.enrollHref}
              label={pathwayCta.enrollLabel}
              className={cn(
                buttonVariants({ variant: 'brand' }),
                'h-12 w-full rounded-2xl text-base',
              )}
            />
          )}
          {dualActions && (
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-2xl text-base border-brand-orange/30 text-brand-orange hover:bg-brand-orange/5"
              onClick={handleConsultation}
            >
              {mentorCtaLabel}
            </Button>
          )}
          {singleEnroll && pathwayCta.enrollHref && (
            <EnrollLink
              href={pathwayCta.enrollHref}
              label={pathwayCta.enrollLabel}
              className={cn(
                buttonVariants({ variant: 'brand' }),
                'h-12 w-full rounded-2xl text-base',
              )}
            />
          )}
          {singleOther && (
            <>
              {pathwayCta.modalMode === 'consultation' || pathwayCta.showConsultationInModal ? (
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
                  className={cn(
                    buttonVariants({ variant: 'brand' }),
                    'h-12 w-full rounded-2xl text-base',
                  )}
                >
                  {pathwayCta.proceedLabel}
                </Link>
              )}
            </>
          )}
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
