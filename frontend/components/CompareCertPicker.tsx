'use client';

import * as React from 'react';
import { Search, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { CertificationSummary } from '@/types/site';
import {
  MAX_COMPARE_CERTS,
  filterCertsForPicker,
  inferCompareFamilyFromSelection,
  toggleCompareSelection,
} from '@/lib/compare-certifications';
import {
  FAMILY_FEATURED_CERT_IDS,
  PATHWAY_FAMILY_TABS,
  type PathwayFamilyTab,
} from '@/lib/certification-enrollment';

const FAMILY_LABEL: Record<PathwayFamilyTab, string> = {
  PMI: 'PMI®',
  PRINCE2: 'PRINCE2®',
  SixSigma: 'Lean Six Sigma',
};

export function CompareCertPicker({
  certifications,
  selectedIds,
  onChange,
}: {
  certifications: CertificationSummary[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const allowedIds = React.useMemo(
    () => new Set(certifications.map((c) => c.id)),
    [certifications],
  );

  const [query, setQuery] = React.useState('');
  const [familyFilter, setFamilyFilter] = React.useState<PathwayFamilyTab>(() =>
    inferCompareFamilyFromSelection(selectedIds, certifications),
  );
  const [maxHint, setMaxHint] = React.useState(false);

  const filtered = React.useMemo(
    () =>
      filterCertsForPicker(certifications, {
        familyId: familyFilter,
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

  const handleFamilyChange = (family: PathwayFamilyTab) => {
    setFamilyFilter(family);
    setQuery('');
  };

  const clearAll = () => {
    setMaxHint(false);
    onChange([]);
  };

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
            Pick up to {MAX_COMPARE_CERTS} pathways across PMI®, PRINCE2®, and Lean Six Sigma.
            Use the family tabs to browse each catalogue — your selection is kept when you switch.
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

      <div
        role="tablist"
        aria-label="Certification family"
        className="flex flex-wrap gap-2"
      >
        {PATHWAY_FAMILY_TABS.map((familyId) => (
          <FamilyChip
            key={familyId}
            label={FAMILY_LABEL[familyId]}
            selected={familyFilter === familyId}
            onClick={() => handleFamilyChange(familyId)}
          />
        ))}
      </div>

      {selectedCerts.length > 0 && (
        <div className="rounded-2xl border border-brand-orange/20 bg-brand-orange/[0.04] dark:bg-brand-orange/10 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Your comparison ({selectedCerts.length}/{MAX_COMPARE_CERTS})
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-destructive dark:text-slate-400 dark:hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCerts.map((cert) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => handleToggle(cert.id)}
                className="inline-flex items-center justify-center gap-2 pl-3 pr-2 py-2 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-brand-orange/30 text-sm font-bold text-center hover:border-brand-orange/60 shadow-sm transition-colors"
                aria-label={`Remove ${cert.name} from comparison`}
              >
                <span className="text-[9px] font-black uppercase tracking-wider text-brand-orange">
                  {FAMILY_LABEL[cert.familyId as PathwayFamilyTab] ?? cert.familyId}
                </span>
                <span>{cert.name}</span>
                <span className="rounded-full bg-brand-orange/15 p-1 text-brand-orange">
                  <X className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 sm:p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${FAMILY_LABEL[familyFilter]} pathways…`}
            className="w-full h-14 pl-11 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-950/50 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
          />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Browsing {FAMILY_LABEL[familyFilter]} — suggested:{' '}
          {FAMILY_FEATURED_CERT_IDS[familyFilter]
            .map((id) => certifications.find((c) => c.id === id)?.name)
            .filter(Boolean)
            .join(' · ')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[min(24rem,50vh)] overflow-y-auto pr-1 scrollbar-thin">
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
                  'flex min-h-[4.25rem] flex-col items-center justify-center rounded-2xl border px-4 py-3 text-center transition-all',
                  selected
                    ? 'border-brand-orange bg-brand-orange/5 shadow-sm ring-1 ring-brand-orange/30'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-600 bg-white dark:bg-slate-900',
                  disabled && 'opacity-40 cursor-not-allowed',
                )}
              >
                <p className="text-[9px] font-black uppercase tracking-wider text-brand-orange mb-1">
                  {FAMILY_LABEL[cert.familyId as PathwayFamilyTab] ?? cert.familyId}
                </p>
                <p className="font-bold text-slate-900 dark:text-white leading-tight">{cert.name}</p>
                {selected && (
                  <span className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-orange text-white p-0.5">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8 font-medium">
            No certifications match your search in {FAMILY_LABEL[familyFilter]}.
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
        'inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-bold text-center transition-colors border',
        selected
          ? 'bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/20'
          : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-brand-orange/40',
      )}
    >
      {label}
    </button>
  );
}
