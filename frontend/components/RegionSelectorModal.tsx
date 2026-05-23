'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </span>
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
      <DialogContent
        className={cn(
          'max-h-[90vh] overflow-y-auto border-slate-200 bg-white p-6 sm:max-w-[512px]',
          'text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100',
        )}
      >
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-lg font-bold leading-snug pr-8 text-slate-900 dark:text-white">
            Select your region for a personalized website experience.
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            {REGION_COPY.pricingSelector}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-1">
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
                        'flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                        isSelected
                          ? 'border-violet-400 bg-violet-50 ring-1 ring-violet-300 dark:border-violet-500 dark:bg-violet-950/50 dark:ring-violet-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600',
                      )}
                    >
                      <RegionFlag code={opt.flagCode} />
                      <span className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {overview && (
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-4 dark:border-slate-800">
            {overview}
          </p>
        )}

        <button
          type="button"
          disabled={!selected}
          onClick={confirm}
          className="w-full rounded-full bg-brand-orange py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-40"
        >
          Confirm region
        </button>
      </DialogContent>
    </Dialog>
  );
}
