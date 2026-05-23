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
import type { PathwayModalMode } from '@/lib/pathway-tier-cta';
import { getProgrammePreviewContent } from '@/lib/pathway-programme-preview';
import { ProgrammePreviewExplorer } from '@/components/ProgrammePreviewExplorer';

interface PathwayOfferingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programmeTitle: string;
  offeringId: string;
  duration: string;
  deliveryLine: string;
  modalMode: PathwayModalMode;
  proceedHref: string;
  proceedLabel: string;
  outcomes: string[];
}

export function PathwayOfferingModal({
  open,
  onOpenChange,
  programmeTitle,
  offeringId,
  duration,
  deliveryLine,
  modalMode,
  proceedHref,
  proceedLabel,
  outcomes,
}: PathwayOfferingModalProps) {
  const preview = React.useMemo(
    () => getProgrammePreviewContent(offeringId, programmeTitle),
    [offeringId, programmeTitle],
  );

  const intro =
    modalMode === 'enroll' || modalMode === 'verify'
      ? 'Review the pathway map and materials below, then continue to secure your place.'
      : 'Review the pathway map and materials below, then book a call with our team.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] sm:max-w-2xl max-h-[min(92vh,900px)] flex flex-col">
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
            <div className="rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/50">
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
          <Link
            href={proceedHref}
            onClick={() => onOpenChange(false)}
            className={cn(
              buttonVariants({ variant: 'brand' }),
              'h-12 w-full rounded-2xl text-base',
            )}
          >
            {proceedLabel}
          </Link>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-slate-500"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
