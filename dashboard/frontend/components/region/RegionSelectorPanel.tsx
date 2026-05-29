'use client';

import { Check } from 'lucide-react';
import { RegionFlag } from '@/components/region/RegionFlag';
import { cn } from '@/lib/utils';
import {
  REGION_SELECTOR_SECTIONS,
  type RegionSelectorSection,
} from '@/lib/region-selector-sections';

function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-label">{title}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  overview?: string | null;
  className?: string;
};

export function RegionSelectorPanel({ selectedId, onSelect, overview, className }: Props) {
  const renderSection = (section: RegionSelectorSection) => (
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
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all',
                isSelected
                  ? 'border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/30 dark:bg-brand-orange/10'
                  : 'border-border bg-card hover:border-brand-orange/40',
              )}
            >
              <RegionFlag code={opt.flagCode} />
              <span className="flex-1 text-sm font-medium text-foreground">{opt.label}</span>
              {isSelected ? <Check className="h-4 w-4 shrink-0 text-brand-orange" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn('space-y-6', className)}>
      {REGION_SELECTOR_SECTIONS.map(renderSection)}
      {overview ? (
        <p className="border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          {overview}
        </p>
      ) : null}
    </div>
  );
}

export function RegionSelectorConfirmButton({
  disabled,
  onClick,
  label = 'Confirm region',
}: {
  disabled: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="min-h-11 w-full rounded-full bg-brand-orange py-3 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-40"
    >
      {label}
    </button>
  );
}
