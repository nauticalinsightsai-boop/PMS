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
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';
import { useRegion } from '@/contexts/RegionContext';
import { getCatalogue } from '@/lib/regional-catalogue';
import { REGION_COPY } from '@/lib/brand-voice';
import { RegionFlag, type RegionFlagCode } from '@/components/RegionFlag';

type CardOption = {
  id: string;
  label: string;
  flagCode: RegionFlagCode;
  regionId: RegionId;
  gccCountry?: GccCountryCode;
};

const SECTIONS: { title: string; options: CardOption[]; columns?: 2 | 3 }[] = [
  {
    title: 'USA, UK & Europe',
    options: [
      { id: 'us', label: 'United States', flagCode: 'us', regionId: 'global' },
      { id: 'uk', label: 'United Kingdom', flagCode: 'uk', regionId: 'uk' },
      { id: 'eu', label: 'Europe', flagCode: 'eu', regionId: 'europe' },
    ],
    columns: 3,
  },
  {
    title: 'GCC',
    options: [
      { id: 'ae', label: 'United Arab Emirates', flagCode: 'ae', regionId: 'gcc', gccCountry: 'AE' },
      { id: 'sa', label: 'Saudi Arabia', flagCode: 'sa', regionId: 'gcc', gccCountry: 'SA' },
      { id: 'qa', label: 'Qatar', flagCode: 'qa', regionId: 'gcc', gccCountry: 'QA' },
      { id: 'bh', label: 'Bahrain', flagCode: 'bh', regionId: 'gcc', gccCountry: 'BH' },
      { id: 'kw', label: 'Kuwait', flagCode: 'kw', regionId: 'gcc', gccCountry: 'KW' },
      { id: 'om', label: 'Oman', flagCode: 'om', regionId: 'gcc', gccCountry: 'OM' },
    ],
    columns: 3,
  },
  {
    title: 'Asia',
    options: [
      { id: 'pk', label: 'Pakistan', flagCode: 'pk', regionId: 'pakistan' },
      { id: 'in', label: 'India', flagCode: 'in', regionId: 'india' },
    ],
    columns: 2,
  },
];

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-label">{title}</span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function RegionSelectorModal() {
  const { modalOpen, regionId, gccCountry, setRegion, closeRegionModal } = useRegion();
  const [selected, setSelected] = React.useState<string | null>(null);
  const overview = getCatalogue().meta.overview.recommendedMessage;

  React.useEffect(() => {
    if (!modalOpen) return;
    if (regionId === 'gcc' && gccCountry) {
      const match = SECTIONS.flatMap((s) => s.options).find((o) => o.gccCountry === gccCountry);
      setSelected(match?.id ?? null);
    } else {
      const match = SECTIONS.flatMap((s) => s.options).find(
        (o) => o.regionId === regionId && !o.gccCountry,
      );
      setSelected(match?.id ?? null);
    }
  }, [modalOpen, regionId, gccCountry]);

  const confirm = () => {
    const opt = SECTIONS.flatMap((s) => s.options).find((o) => o.id === selected);
    if (opt) setRegion(opt.regionId, opt.gccCountry ?? null);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={(open) => !open && closeRegionModal()}>
      <DialogContent className="sm:max-w-[512px] border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-lg font-bold leading-snug pr-8">
            Select your region for a personalized website experience.
          </DialogTitle>
          <DialogDescription>{REGION_COPY.pricingSelector}</DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-6 py-1">
          {SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <SectionDivider title={section.title} />
              <div
                className={cn(
                  'grid gap-2',
                  section.columns === 3 && 'grid-cols-1 sm:grid-cols-3',
                  section.columns === 2 && 'grid-cols-1 sm:grid-cols-2',
                  !section.columns && 'grid-cols-1 sm:grid-cols-2',
                )}
              >
                {section.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelected(opt.id)}
                      className={cn(
                        'flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                        isSelected
                          ? 'border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/30 dark:bg-brand-orange/10'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600',
                      )}
                    >
                      <RegionFlag code={opt.flagCode} />
                      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-brand-orange" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {overview && (
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-4 dark:border-slate-800">
              {overview}
            </p>
          )}
        </DialogBody>

        <DialogFooter className="sm:justify-stretch">
          <button
            type="button"
            disabled={!selected}
            onClick={confirm}
            className="w-full rounded-full bg-brand-orange py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-40 min-h-11"
          >
            Confirm region
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
