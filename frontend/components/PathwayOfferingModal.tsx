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
import { FileText, ImageIcon, PlayCircle, Presentation } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PathwayModalMode } from '@/lib/pathway-tier-cta';
import {
  getProgrammePreviewContent,
  type ProgrammeResourceKind,
} from '@/lib/pathway-programme-preview';

const RESOURCE_ICON: Record<ProgrammeResourceKind, typeof FileText> = {
  pdf: FileText,
  slides: Presentation,
  infographic: ImageIcon,
  video: PlayCircle,
};

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
      ? 'Review what is included, then continue to secure your place.'
      : 'Review the programme materials below, then book a call with our team.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[2rem] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight pr-8">{programmeTitle}</DialogTitle>
          <DialogDescription className="text-base font-medium leading-relaxed">{intro}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6 py-2">
          <div className="flex flex-wrap gap-2 text-label">
            {duration && <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{duration}</span>}
            {deliveryLine && (
              <span className="rounded-full bg-brand-orange/10 px-3 py-1 text-brand-orange">{deliveryLine}</span>
            )}
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {preview.videoEmbedUrl ? (
              <iframe
                title={preview.videoTitle}
                src={preview.videoEmbedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <PlayCircle className="h-12 w-12 text-brand-orange/80" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{preview.videoTitle}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Programme overview video — available in your learner hub after enrolment. Use the resources
                  below to preview structure and delivery.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {preview.resources.map((resource) => {
              const Icon = RESOURCE_ICON[resource.kind];
              const isPlaceholder = resource.href.startsWith('#');
              return (
                <div
                  key={resource.href}
                  className={cn(
                    'rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50',
                    isPlaceholder && 'opacity-75',
                  )}
                  aria-disabled={isPlaceholder}
                >
                  <Icon className="mb-2 h-5 w-5 text-brand-orange" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{resource.title}</p>
                  <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                    {resource.description}
                  </p>
                  <p className="mt-2 text-label text-brand-orange">
                    {isPlaceholder ? 'Coming soon' : 'Preview'}
                  </p>
                </div>
              );
            })}
          </div>

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

        <DialogFooter className="flex-col gap-2 sm:flex-col">
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
