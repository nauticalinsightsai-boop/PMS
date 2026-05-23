'use client';

import * as React from 'react';
import { Search, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { CertificationSummary, FamilyId } from '@/types/site';
import {
  MAX_COMPARE_CERTS,
  filterCertsForPicker,
  toggleCompareSelection,
} from '@/lib/compare-certifications';
import { PATHWAY_FAMILY_TABS, type PathwayFamilyTab } from '@/lib/certification-enrollment';

const FAMILY_LABEL: Record<PathwayFamilyTab, string> = {
  PMI: 'PMI®',
  PRINCE2: 'PRINCE2®',
  SixSigma: 'Lean Six Sigma',
};

type FamilyFilter = PathwayFamilyTab | 'all';

export function CompareCertPicker({
  certifications,
  selectedIds,
  onChange,
}: {
  certifications: CertificationSummary[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = React.useState('');
  const [familyFilter, setFamilyFilter] = React.useState<FamilyFilter>('all');
  const [maxHint, setMaxHint] = React.useState(false);

  const filtered = React.useMemo(
    () =>
      filterCertsForPicker(certifications, {
        familyId: familyFilter === 'all' ? undefined : (familyFilter as FamilyId),
        query,
      }),
    [certifications, familyFilter, query],
  );

  const selectedCerts = React.useMemo(
    () =>
      selectedIds
        .map((id) => certifications.find((c) => c.id === id))
        .filter((c): c is CertificationSummary => Boolean(c)),
    [selectedIds, certifications],
  );

  const handleToggle = (certId: string) => {
    const { next, atMax } = toggleCompareSelection(selectedIds, certId);
    if (atMax) {
      setMaxHint(true);
      window.setTimeout(() => setMaxHint(false), 3000);
      return;
    }
    setMaxHint(false);
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Choose certifications to compare
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Select up to {MAX_COMPARE_CERTS} — pathway tiers, prep time, regional tuition, and exam guidance side by side.
          </p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'w-fit shrink-0 px-4 py-2 text-xs font-bold uppercase tracking-widest border-brand-orange/30',
            maxHint && 'border-destructive text-destructive animate-pulse',
          )}
        >
          {selectedIds.length} / {MAX_COMPARE_CERTS} selected
        </Badge>
      </div>

      {selectedCerts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCerts.map((cert) => (
            <button
              key={cert.id}
              type="button"
              onClick={() => handleToggle(cert.id)}
              className="inline-flex items-center gap-2 pl-4 pr-2 py-2 rounded-2xl bg-brand-orange/10 text-brand-orange border border-brand-orange/20 text-sm font-bold hover:bg-brand-orange/15 transition-colors"
            >
              {cert.name}
              <span className="rounded-full bg-brand-orange/20 p-1">
                <X className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or keyword…"
            className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950/50 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          />
        </div>

        <div
          role="tablist"
          aria-label="Filter by family"
          className="flex flex-wrap gap-2"
        >
          <FamilyChip
            label="All families"
            selected={familyFilter === 'all'}
            onClick={() => setFamilyFilter('all')}
          />
          {PATHWAY_FAMILY_TABS.map((familyId) => (
            <FamilyChip
              key={familyId}
              label={FAMILY_LABEL[familyId]}
              selected={familyFilter === familyId}
              onClick={() => setFamilyFilter(familyId)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 max-h-[min(24rem,50vh)] overflow-y-auto pr-1">
          {filtered.map((cert) => {
            const selected = selectedIds.includes(cert.id);
            const disabled = !selected && selectedIds.length >= MAX_COMPARE_CERTS;
            return (
              <button
                key={cert.id}
                type="button"
                disabled={disabled}
                onClick={() => handleToggle(cert.id)}
                className={cn(
                  'text-left rounded-2xl border px-4 py-3 transition-all',
                  selected
                    ? 'border-brand-orange bg-brand-orange/5 shadow-sm ring-1 ring-brand-orange/30'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-900',
                  disabled && 'opacity-40 cursor-not-allowed',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                      {cert.familyId}
                    </p>
                    <p className="font-bold text-slate-900 dark:text-white truncate">{cert.name}</p>
                  </div>
                  {selected && (
                    <span className="shrink-0 rounded-full bg-brand-orange text-white p-0.5">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8 font-medium">
            No certifications match your search.
          </p>
        )}
      </div>

      {maxHint && (
        <p className="text-sm font-semibold text-destructive">
          You can compare up to {MAX_COMPARE_CERTS} certifications at once. Remove one to add another.
        </p>
      )}
    </div>
  );
}

function FamilyChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-xl text-sm font-bold transition-colors border',
        selected
          ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20'
          : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-orange/40',
      )}
    >
      {label}
    </button>
  );
}
