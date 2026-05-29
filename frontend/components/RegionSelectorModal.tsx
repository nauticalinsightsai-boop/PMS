'use client';

import * as React from 'react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRegion } from '@/contexts/RegionContext';
import { usePortalRegionTheme } from '@/contexts/PortalRegionThemeContext';
import { getCatalogue } from '@/lib/regional-catalogue';
import { REGION_COPY } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';
import {
  findRegionSelectorOption,
  REGION_SELECTOR_SECTIONS,
} from '@/lib/region-selector-sections';
import {
  RegionSelectorConfirmButton,
  RegionSelectorPanel,
} from '@/components/region/RegionSelectorPanel';

export function RegionSelectorModal() {
  const { modalOpen, regionId, gccCountry, setRegion, closeRegionModal } = useRegion();
  const portalTheme = usePortalRegionTheme();
  const [selected, setSelected] = React.useState<string | null>(null);
  const overview = getCatalogue().meta.overview.recommendedMessage;

  React.useEffect(() => {
    if (!modalOpen) return;
    const match = findRegionSelectorOption(regionId, gccCountry);
    setSelected(match?.id ?? null);
  }, [modalOpen, regionId, gccCountry]);

  const confirm = () => {
    const opt = REGION_SELECTOR_SECTIONS.flatMap((s) => s.options).find((o) => o.id === selected);
    if (opt) setRegion(opt.regionId, opt.gccCountry ?? null);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && closeRegionModal()}>
      <DialogContent
        className={cn(
          'sm:max-w-[512px] gap-0 p-0',
          !portalTheme && 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950',
        )}
        style={
          portalTheme
            ? {
                backgroundColor: portalTheme.cardBg,
                borderColor: portalTheme.cardBorder,
                color: portalTheme.text,
              }
            : undefined
        }
      >
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle
            className="text-lg font-bold leading-snug pr-8"
            style={portalTheme ? { color: portalTheme.text } : undefined}
          >
            Select your region for a personalized website experience.
          </DialogTitle>
          <DialogDescription style={portalTheme ? { color: portalTheme.textMuted } : undefined}>
            {REGION_COPY.pricingSelector}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6 py-1">
          <RegionSelectorPanel
            selectedId={selected}
            onSelect={setSelected}
            overview={overview}
            portalTheme={portalTheme}
          />
        </DialogBody>

        <DialogFooter
          className="sm:justify-stretch"
          style={
            portalTheme
              ? {
                  borderColor: portalTheme.cardBorder,
                  backgroundColor: portalTheme.cardBg,
                }
              : undefined
          }
        >
          <RegionSelectorConfirmButton
            disabled={!selected}
            onClick={confirm}
            portalTheme={portalTheme}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
