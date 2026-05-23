'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CompareTierCell } from '@/components/CompareTierCell';
import { cn } from '@/lib/utils';
import type { CertificationSummary } from '@/types/site';

type CompareRow =
  | { kind: 'text'; label: string; field: keyof CertificationSummary }
  | { kind: 'tier'; label: string; tier: 'foundation' | 'professional' | 'mastery' };

const COMPARE_ROWS: CompareRow[] = [
  { kind: 'text', label: 'Primary value', field: 'outputValue' },
  { kind: 'text', label: 'Target audience', field: 'targetAudience' },
  { kind: 'tier', label: 'Foundation pathway', tier: 'foundation' },
  { kind: 'tier', label: 'Professional pathway', tier: 'professional' },
  { kind: 'tier', label: 'Mastery pathway', tier: 'mastery' },
  { kind: 'text', label: 'Exam format', field: 'examFormat' },
  { kind: 'text', label: 'Prerequisites', field: 'prerequisites' },
  { kind: 'text', label: 'Official exam fee', field: 'officialFee' },
  { kind: 'text', label: 'Career guidance', field: 'recommendedCTA' },
];

function textCellValue(cert: CertificationSummary, field: keyof CertificationSummary): string {
  const raw = cert[field];
  if (typeof raw === 'string' && raw.trim()) return raw;
  return '—';
}

const MATRIX_GRID_CLASS: Record<number, string> = {
  1: 'grid-cols-[minmax(11rem,13rem)_minmax(0,1fr)]',
  2: 'grid-cols-[minmax(11rem,13rem)_repeat(2,minmax(0,1fr))]',
  3: 'grid-cols-[minmax(11rem,13rem)_repeat(3,minmax(0,1fr))]',
};

export function CompareComparisonMatrix({ certs }: { certs: CertificationSummary[] }) {
  const gridClass = MATRIX_GRID_CLASS[certs.length] ?? MATRIX_GRID_CLASS[3];
  const minWidthClass =
    certs.length === 1
      ? 'min-w-[24rem]'
      : certs.length === 2
        ? 'min-w-[38rem]'
        : 'min-w-[52rem]';

  return (
    <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <div className={cn('w-full', minWidthClass)}>
          {/* Header */}
          <div
            className={cn('grid border-b border-slate-800 bg-slate-900 dark:bg-slate-950', gridClass)}
          >
            <div className="px-6 py-8 font-bold text-lg text-white border-r border-slate-800">
              Compare
            </div>
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="px-5 py-8 text-center border-r border-slate-800 last:border-r-0"
              >
                <p className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2">
                  {cert.familyId}
                </p>
                <p className="text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
                  {cert.name}
                </p>
              </div>
            ))}
          </div>

          {/* Body rows */}
          {COMPARE_ROWS.map((row, index) => {
            const stripe = index % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-800/40';
            return (
              <div
                key={row.label}
                className={cn('grid border-b border-slate-100 dark:border-slate-800', stripe, gridClass)}
              >
                <div
                  className={cn(
                    'px-6 py-6 font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 flex items-start',
                    stripe,
                  )}
                >
                  <span className="text-sm leading-snug">{row.label}</span>
                </div>
                {certs.map((cert) => (
                  <div
                    key={`${cert.id}-${row.label}`}
                    className="px-5 py-6 border-r border-slate-100 dark:border-slate-800 last:border-r-0 min-w-0"
                  >
                    {row.kind === 'tier' ? (
                      <CompareTierCell siteId={cert.id} tier={row.tier} />
                    ) : (
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-normal break-words">
                        {textCellValue(cert, row.field)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          })}

          {/* CTA row */}
          <div className={cn('grid bg-white dark:bg-slate-900', gridClass)}>
            <div className="px-6 py-10 font-bold text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
              View pathway
            </div>
            {certs.map((cert) => (
              <div
                key={`${cert.id}-cta`}
                className="px-5 py-10 flex items-center justify-center border-r border-slate-100 dark:border-slate-800 last:border-r-0"
              >
                <Link href={`/certifications/${cert.id}`} className="w-full max-w-[220px]">
                  <Button
                    size="lg"
                    className="w-full bg-brand-orange hover:bg-brand-hover text-white font-bold rounded-xl shadow-md shadow-brand-orange/20"
                  >
                    Open pathway
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
