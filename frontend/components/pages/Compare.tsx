'use client';

import * as React from 'react';
import Link from 'next/link';
import { WebsiteCalendlyButton } from '@/components/calendly/WebsiteCalendlyButton';
import { useRouter, useSearchParams } from 'next/navigation';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { CompareCertPicker } from '@/components/CompareCertPicker';
import { CompareComparisonMatrix } from '@/components/CompareComparisonMatrix';
import { PmpRoadmapCtaLink } from '@/components/pmp/PmpRoadmapCtaLink';
import {
  compareIdsToQuery,
  getCompareableCertifications,
  parseCompareCertIds,
} from '@/lib/compare-certifications';
import { globalContentString, type GlobalContentMap } from '@/lib/cms/global-content';
import { PageHeroWithImage } from '@/components/marketing/PageMarketingImage';
import { MARKETING_PAGE_IMAGES } from '@/lib/marketing-stock-images';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { getPhase2RelatedBlock } from '@/content/seo/phase-2-page-seo';
import { cn } from '@/lib/utils';

const COMPARE_RELATED = getPhase2RelatedBlock('/certifications/compare');

const SECONDARY_WAITLIST_PATHWAYS = [
  { certId: 'prince2-practitioner', label: 'PRINCE2 Practitioner' },
  { certId: 'pmi-rmp', label: 'PMI-RMP' },
  { certId: 'lss-yellow', label: 'Lean Six Sigma Yellow Belt' },
] as const;

function waitlistContactHref(certId: string): string {
  return `/contact?topic=waitlist&offering=${encodeURIComponent(certId)}`;
}

export function Compare({ globalContent }: { globalContent?: GlobalContentMap }) {
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
        <div className="container relative z-10 mx-auto">
          <PageHeroWithImage image={MARKETING_PAGE_IMAGES.compare}>
            <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                {globalContentString(globalContent, 'compare_badge', 'Comparison matrix')}
              </Badge>
              <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
                {globalContentString(globalContent, 'compare_title', 'Compare project management certifications')}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {globalContentString(
                  globalContent,
                  'compare_subtitle',
                  'Pick up to three pathways from any mix of PMI®, PRINCE2®, and Lean Six Sigma, then review tiers, prep time, and regional tuition in one matrix.',
                )}
              </p>
            </div>
          </PageHeroWithImage>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-16 md:py-20 border-b border-slate-100 dark:border-slate-800')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
            Select certifications to compare
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl font-medium">
            Start with the{' '}
            <Link href="/certifications/pmp" className="font-bold text-brand-orange hover:underline">
              PMP 2026 Readiness Pathway
            </Link>{' '}
            if you are planning for the July 2026 exam transition, then add other pathways for side-by-side review.
          </p>
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
            <>
              <h2 className="sr-only">Comparison matrix</h2>
              <CompareComparisonMatrix certs={compareCerts} />
            </>
          )}
        </div>
      </section>

      <section
        className={sectionSurface('warm', 'py-24 border-t border-sandstone/60 dark:border-slate-800')}
      >
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-6 sm:p-12 md:p-16 rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-[2rem] bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                <Info className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
              <div className="min-w-0 w-full text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 tracking-tight text-balance">
                  Not sure which one to choose?
                </h2>
                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-6 leading-relaxed font-medium">
                  Our certification experts can help you map out a personalized professional
                  development plan based on your experience and career aspirations.
                </p>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 w-full">
                  <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center md:justify-start gap-4 shrink-0 w-full sm:w-auto">
                    <PmpRoadmapCtaLink
                      className="inline-flex h-14 w-full sm:w-auto items-center justify-center whitespace-normal rounded-2xl bg-brand-orange px-6 sm:px-10 text-base sm:text-lg font-bold text-white shadow-md shadow-brand-orange/20 hover:bg-brand-hover"
                      ctaLocation="body"
                    />
                    <WebsiteCalendlyButton
                      tier="advisor"
                      className="w-full sm:w-auto bg-brand-orange hover:bg-brand-hover text-white h-14 px-6 sm:px-10 rounded-2xl text-base sm:text-lg font-bold shadow-md shadow-brand-orange/20"
                      funnelLabel="compare_talk_to_advisor"
                      utm={{ utm_source: 'pmstructure', utm_medium: 'compare', utm_campaign: 'advisor' }}
                    >
                      Talk to an advisor
                    </WebsiteCalendlyButton>
                  </div>
                  {COMPARE_RELATED ? (
                    <RelatedGuidesLinks
                      title={COMPARE_RELATED.title}
                      links={COMPARE_RELATED.links}
                      currentPath="/certifications/compare"
                      collapsible
                      className="w-full lg:w-auto lg:min-w-[18rem] lg:max-w-sm text-left"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={cn(sectionSurface('blend', 'py-14 sm:py-16'))}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Secondary pathways: join the waitlist
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            PMP 2026 is our flagship offer. If you are comparing other certifications, join the
            waitlist and we will notify you when enrollment opens.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch justify-center gap-3">
            {SECONDARY_WAITLIST_PATHWAYS.map((pathway) => (
              <Button
                key={pathway.certId}
                asChild
                variant="outline"
                className="h-12 rounded-2xl border-brand-purple/30 px-6 font-bold"
              >
                <Link href={waitlistContactHref(pathway.certId)}>{pathway.label} waitlist</Link>
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
