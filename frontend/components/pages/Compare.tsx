'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { CompareCertPicker } from '@/components/CompareCertPicker';
import { CompareComparisonMatrix } from '@/components/CompareComparisonMatrix';
import { PricingComplianceNote } from '@/components/PricingComplianceNote';
import {
  compareIdsToQuery,
  getCompareableCertifications,
  parseCompareCertIds,
} from '@/lib/compare-certifications';

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
      router.replace(qs ? `/certifications/compare?${qs}` : '/certifications/compare', { scroll: false });
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
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
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
            Switch between PMI®, PRINCE2®, or Lean Six Sigma, pick up to three pathways, and
            review tiers, prep time, and regional tuition in one matrix.
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
            <CompareComparisonMatrix certs={compareCerts} />
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
