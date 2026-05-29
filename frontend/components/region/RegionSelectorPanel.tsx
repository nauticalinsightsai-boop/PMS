'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes';
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils';
import { RegionFlag } from '@/components/RegionFlag';
import { cn } from '@/lib/utils';
import {
  REGION_SELECTOR_SECTIONS,
  type RegionSelectorSection,
} from '@/lib/region-selector-sections';

function SectionDivider({
  title,
  portalTheme,
}: {
  title: string;
  portalTheme: PlatformPortalTheme | null;
}) {
  if (portalTheme) {
    return (
      <div className="flex items-center gap-3">
        <span
          className="shrink-0 text-[10px] font-mono uppercase tracking-wider"
          style={{ color: portalTheme.textMuted }}
        >
          {title}
        </span>
        <div className="h-px flex-1" style={{ backgroundColor: portalTheme.cardBorder }} />
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-label">{title}</span>
      <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
  overview?: string | null;
  portalTheme?: PlatformPortalTheme | null;
  className?: string;
};

export function RegionSelectorPanel({
  selectedId,
  onSelect,
  overview,
  portalTheme = null,
  className,
}: Props) {
  const renderSection = (section: RegionSelectorSection) => (
    <div key={section.title} className="space-y-2">
      <SectionDivider title={section.title} portalTheme={portalTheme} />
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
                'flex min-h-10 items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all',
                !portalTheme &&
                  (isSelected
                    ? 'border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/30 dark:bg-brand-orange/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'),
              )}
              style={
                portalTheme
                  ? {
                      borderRadius: portalTheme.radius,
                      border: `1px solid ${
                        isSelected ? portalTheme.primary : portalTheme.cardBorder
                      }`,
                      backgroundColor: isSelected
                        ? `${portalTheme.primary}14`
                        : portalTheme.surfaceMuted,
                      boxShadow: isSelected ? `0 0 0 2px ${portalTheme.primary}40` : undefined,
                    }
                  : undefined
              }
            >
              <RegionFlag code={opt.flagCode} />
              <span
                className={cn(
                  'flex-1 text-sm font-medium',
                  !portalTheme && 'text-slate-800 dark:text-slate-100',
                )}
                style={portalTheme ? { color: portalTheme.text } : undefined}
              >
                {opt.label}
              </span>
              {isSelected && (
                <Check
                  className={cn('h-4 w-4 shrink-0', !portalTheme && 'text-brand-orange')}
                  style={portalTheme ? { color: portalTheme.primary } : undefined}
                  aria-hidden
                />
              )}
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
        <p
          className={cn(
            'text-xs leading-relaxed border-t pt-4',
            !portalTheme && 'text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800',
          )}
          style={
            portalTheme
              ? {
                  color: portalTheme.textMuted,
                  borderColor: portalTheme.cardBorder,
                }
              : undefined
          }
        >
          {overview}
        </p>
      ) : null}
    </div>
  );
}

export function RegionSelectorConfirmButton({
  disabled,
  onClick,
  portalTheme,
  label = 'Confirm region',
}: {
  disabled: boolean;
  onClick: () => void;
  portalTheme?: PlatformPortalTheme | null;
  label?: string;
}) {
  const confirmFg = portalTheme
    ? portalTheme.primaryForeground ?? pickReadableForeground(portalTheme.primary)
    : undefined;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'w-full rounded-full py-2.5 text-sm font-bold shadow-sm transition-opacity hover:opacity-95 disabled:opacity-40 min-h-10',
        !portalTheme && 'bg-brand-orange text-white',
      )}
      style={
        portalTheme
          ? {
              borderRadius: portalTheme.radiusLg,
              backgroundColor: portalTheme.primary,
              color: confirmFg,
            }
          : undefined
      }
    >
      {label}
    </button>
  );
}
