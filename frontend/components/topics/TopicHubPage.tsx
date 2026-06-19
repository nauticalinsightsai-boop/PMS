import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import { Pmp2026ComplianceNote } from '@/components/pmp/Pmp2026ComplianceNote';
import type { TopicHubContent } from '@/content/topics/types';
import { getTopicFaqsForHub } from '@/content/topics';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { getTopicHubBreadcrumbs } from '@/content/site-architecture/routes';
import { TopicHubJsonLd } from '@/components/seo/TopicHubJsonLd';
import { RelatedGuidesLinks } from '@/components/seo/RelatedGuidesLinks';
import { PagePrimaryCta } from '@/components/marketing/PagePrimaryCta';
import { getPhase2RelatedBlock } from '@/content/seo/phase-2-page-seo';
import { ConversionViewTracker } from '@/components/analytics/ConversionViewTracker';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { cn } from '@/lib/utils';

function topicShortName(h1: string): string {
  return h1.replace(/. PM Structure knowledge hub$/i, '').trim();
}

export function TopicHubPage({ hub }: { hub: TopicHubContent }) {
  const name = topicShortName(hub.h1);
  const relatedFaqs = getTopicFaqsForHub(hub);
  const prepPages = [...hub.resources, ...(hub.relatedCourses ?? [])];
  const phase2Related = getPhase2RelatedBlock(hub.path);
  const breadcrumbs = getTopicHubBreadcrumbs(hub);

  return (
    <>
      <ConversionViewTracker event={CONVERSION_EVENTS.VIEW_TOPIC_HUB} slug={hub.slug} />
      <TopicHubJsonLd hub={hub} relatedFaqs={relatedFaqs} />
      <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="purple" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
          <Breadcrumbs items={breadcrumbs} />

          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-10">
            {hub.h1}
          </h1>

          <section className="mb-10">
            <h2 className="font-heading text-xl font-bold mb-3">What is {name}?</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hub.whatIs}</p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-xl font-bold mb-3">
              Why {name} matters for PMP preparation
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hub.whyMatters}</p>
          </section>

          {hub.howExamReadiness ? (
            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-3">
                How {name} appears in PMP exam readiness
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {hub.howExamReadiness}
              </p>
            </section>
          ) : null}

          <section className="mb-10">
            <h2 className="font-heading text-xl font-bold mb-3">PM Structure viewpoint</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hub.viewpoint}</p>
          </section>

          {hub.sourceTodo ? (
            <section className="mb-10 rounded-lg border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-4">
              <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-800 dark:text-amber-200 mb-2">
                Verification notes
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{hub.sourceTodo}</p>
            </section>
          ) : null}

          <section className="mb-10">
            <h2 className="font-heading text-xl font-bold mb-4">Related PMP preparation pages</h2>
            <ul className="space-y-2">
              {prepPages.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-brand-purple hover:underline font-medium">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {hub.relatedAnswers.length ? (
            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-4">Related questions</h2>
              <ul className="space-y-2">
                {hub.relatedAnswers.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="text-brand-purple hover:underline font-medium">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {relatedFaqs.length ? (
            <section className="mb-10" aria-label="Related FAQs">
              <h2 className="font-heading text-xl font-bold mb-4">Related FAQs</h2>
              <div className="space-y-5">
                {relatedFaqs.map((faq) => (
                  <article key={faq.question}>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{faq.answer}</p>
                  </article>
                ))}
              </div>
              <p className="mt-4 text-sm">
                <Link href="/pmp-faq" className="text-brand-purple hover:underline font-medium">
                  View all PMP FAQs
                </Link>
              </p>
            </section>
          ) : null}

          <section className="mb-10">
            <h2 className="font-heading text-xl font-bold mb-3">Recommended next step</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
              Continue with the pathway or guide that best matches your exam timeline and readiness.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <PagePrimaryCta
                href={hub.ctaHref}
                label={hub.ctaLabel}
                funnelLabel={`topic_${hub.slug}`}
              />
              <Link href="/pmp-faq" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                PMP FAQs
              </Link>
              <Link href="/answers" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                Direct answers
              </Link>
            </div>
          </section>

          {hub.references?.length ? (
            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-3">References</h2>
              <ul className="space-y-2 text-sm">
                {hub.references.map((ref) => (
                  <li key={ref.href}>
                    <Link href={ref.href} className="text-brand-purple hover:underline">
                      {ref.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {phase2Related ? (
            <RelatedGuidesLinks
              title={phase2Related.title}
              links={phase2Related.links}
              currentPath={hub.path}
            />
          ) : null}

          {hub.slug === 'pmp-exam-2026' ? (
            <Pmp2026ComplianceNote className="mb-10" showSourceLinks />
          ) : null}

          <p className="text-sm text-slate-500 border-t pt-6">{PMP_INDEPENDENT_DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}