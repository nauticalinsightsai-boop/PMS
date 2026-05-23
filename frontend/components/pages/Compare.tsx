'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { CompareCertPicker } from '@/components/CompareCertPicker';
import { CompareTierCell } from '@/components/CompareTierCell';
import { PricingComplianceNote } from '@/components/PricingComplianceNote';
import {
  compareIdsToQuery,
  getCompareableCertifications,
  parseCompareCertIds,
} from '@/lib/compare-certifications';
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

export function Compare() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const compareable = React.useMemo(() => getCompareableCertifications(), []);
  const allowedIds = React.useMemo(
    () => new Set(compareable.map((c) => c.id)),
    [compareable],
  );

  const [selectedIds, setSelectedIds] = React.useState<string[]>(() =>
    parseCompareCertIds(searchParams.get('c'), allowedIds),
  );

  React.useEffect(() => {
    const fromUrl = parseCompareCertIds(searchParams.get('c'), allowedIds);
    setSelectedIds((prev) => {
      if (prev.join(',') === fromUrl.join(',')) return prev;
      return fromUrl;
    });
  }, [searchParams, allowedIds]);

  const syncUrl = React.useCallback(
    (ids: string[]) => {
      const next = compareIdsToQuery(ids);
      const current = searchParams.get('c') ?? '';
      if (current === next) return;
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set('c', next);
      else params.delete('c');
      const qs = params.toString();
      router.replace(qs ? `/compare?${qs}` : '/compare', { scroll: false });
    },
    [router, searchParams],
  );

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
    syncUrl(ids);
  };

  const compareCerts = React.useMemo(
    () =>
      selectedIds
        .map((id) => compareable.find((c) => c.id === id))
        .filter((c): c is CertificationSummary => Boolean(c)),
    [selectedIds, compareable],
  );

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className={sectionSurface(
          'purple',
          'py-24 md:py-32 border-b border-sandstone/60 dark:border-slate-800',
        )}
      >
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto text-center">
          <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            Comparison matrix
          </Badge>
          <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
            Compare <span className="text-brand-orange">certifications</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Pick any certifications we offer, then compare pathway tiers, preparation time, regional
            tuition with global reference, and exam guidance in one view.
          </p>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-16 md:py-20 border-b border-slate-100 dark:border-slate-800')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <CompareCertPicker
            certifications={compareable}
            selectedIds={selectedIds}
            onChange={handleSelectionChange}
          />
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-24')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          {compareCerts.length === 0 ? (
            <div className="text-center py-20 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Select at least one certification
              </p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                Use the picker above to add up to three programmes to your comparison matrix.
              </p>
            </div>
          ) : (
            <div className="scroll-fade-x overflow-x-auto rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 scrollbar-thin">
              <Table>
                <TableHeader className="bg-slate-900 dark:bg-slate-950 text-white">
                  <TableRow className="hover:bg-slate-900 dark:hover:bg-slate-950 border-none">
                    <TableHead className="w-[220px] min-w-[180px] text-white font-bold py-8 px-8 text-lg sticky left-0 z-10 bg-slate-900 dark:bg-slate-950">
                      Compare
                    </TableHead>
                    {compareCerts.map((cert) => (
                      <TableHead
                        key={cert.id}
                        className="text-white font-bold text-center py-8 px-6 min-w-[240px]"
                      >
                        <div className="text-brand-orange text-xs uppercase tracking-widest mb-2">
                          {cert.familyId}
                        </div>
                        <div className="text-xl tracking-tight">{cert.name}</div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {COMPARE_ROWS.map((row, index) => (
                    <TableRow
                      key={row.label}
                      className={
                        index % 2 === 0
                          ? 'bg-white dark:bg-slate-900'
                          : 'bg-slate-50/50 dark:bg-slate-800/30'
                      }
                    >
                      <TableCell className="font-bold py-8 px-8 text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 sticky left-0 z-10 bg-inherit">
                        {row.label}
                      </TableCell>
                      {compareCerts.map((cert) => (
                        <TableCell
                          key={`${cert.id}-${row.label}`}
                          className="text-center py-8 px-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed align-top"
                        >
                          {row.kind === 'tier' ? (
                            <CompareTierCell siteId={cert.id} tier={row.tier} />
                          ) : (
                            <p className="text-sm text-left max-w-md mx-auto">
                              {textCellValue(cert, row.field)}
                            </p>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  <TableRow className="bg-white dark:bg-slate-900">
                    <TableCell className="font-bold py-12 px-8 text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800 sticky left-0 z-10 bg-inherit">
                      View pathway
                    </TableCell>
                    {compareCerts.map((cert) => (
                      <TableCell key={`${cert.id}-cta`} className="text-center py-12 px-6">
                        <Link href={`/certifications/${cert.id}`}>
                          <Button
                            size="lg"
                            className="bg-brand-orange hover:bg-brand-hover text-white font-bold rounded-xl shadow-md shadow-brand-orange/20 dark:bg-brand-orange dark:hover:bg-brand-hover"
                          >
                            Open pathway
                          </Button>
                        </Link>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
          <PricingComplianceNote className="mt-10 max-w-3xl mx-auto" />
        </div>
      </section>

      <section
        className={sectionSurface('warm', 'py-24 border-t border-sandstone/60 dark:border-slate-800')}
      >
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="h-24 w-24 rounded-[2rem] bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                <Info className="h-12 w-12" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Not sure which one to choose?</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium text-lg">
                  Our certification experts can help you map out a personalized professional
                  development plan based on your experience and career aspirations.
                </p>
                <Link href="/contact">
                  <Button className="bg-brand-orange hover:bg-brand-hover text-white h-14 px-10 rounded-2xl font-bold text-lg shadow-md shadow-brand-orange/20">
                    Talk to an advisor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
