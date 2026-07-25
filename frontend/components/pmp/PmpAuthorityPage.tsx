import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_ACCREDITATION_NOTE, PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import type { PmpPageContent } from '@/content/pmp/types';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { getPmpPageBreadcrumbs } from '@/content/site-architecture/routes';
import { PmpPageJsonLd } from '@/components/seo/PmpPageJsonLd';
import { PmpRelatedFaqs } from '@/components/pmp/PmpRelatedFaqs';
import { PmpPriorityAnswers } from '@/components/pmp/PmpPriorityAnswers';
import { PMP_EXAM_2026_PRIORITY_ANSWERS } from '@/content/answers/priority-answers';
import { ConversionViewTracker } from '@/components/analytics/ConversionViewTracker';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { FaqAnswer } from '@/components/faq/FaqAccordionList';
import { ComparePathwaysCtaLink, PmpRoadmapCtaLink } from '@/components/pmp/PmpRoadmapCtaLink';
import { PmpExam2026LiveBanner } from '@/components/pmp/PmpExam2026LiveBanner';
import { PmpViewContentTracker } from '@/components/analytics/PmpViewContentTracker';
import { PMP_PATHWAY_PAGE } from '@/content/pmp/pathway-page';
import { CTAS } from '@/lib/brand-voice';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle } from 'lucide-react';

function MarkdownBlock({
  text,
  listVariant = 'default',
}: {
  text: string;
  listVariant?: 'check' | 'cross' | 'default';
}) {
  const ListIcon =
    listVariant === 'check' ? CheckCircle2 : listVariant === 'cross' ? XCircle : null;

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-table:my-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            if (href?.startsWith('/')) {
              return (
                <Link href={href} className="text-brand-purple hover:underline font-medium">
                  {children}
                </Link>
              );
            }
            return (
              <a href={href} rel="noopener noreferrer" className="text-brand-purple hover:underline">
                {children}
              </a>
            );
          },
          ul: ({ children }) => (
            <ul className="not-prose my-4 list-none space-y-3 pl-0">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-3 text-sm font-medium leading-relaxed text-slate-700 sm:text-base dark:text-slate-300">
              {ListIcon ? (
                <ListIcon
                  className={cn(
                    'mt-0.5 h-5 w-5 shrink-0',
                    listVariant === 'check' ? 'text-brand-orange' : 'text-slate-400',
                  )}
                  aria-hidden
                />
              ) : (
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-orange"
                  aria-hidden
                />
              )}
              <span className="min-w-0 flex-1">{children}</span>
            </li>
          ),
          table: ({ children }) => (
            <div className="not-prose my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full min-w-[20rem] border-collapse text-left text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 font-bold text-slate-900 dark:text-white">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border-t border-slate-100 px-4 py-3 font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300">
              {children}
            </td>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export function PmpAuthorityPage({ page }: { page: PmpPageContent }) {
  const viewEvent =
    page.slug === 'pmp-exam-2026' ? CONVERSION_EVENTS.VIEW_PMP_EXAM_2026 : null;
  const breadcrumbs = getPmpPageBreadcrumbs(page);

  return (
    <>
      {viewEvent ? <ConversionViewTracker event={viewEvent} /> : null}
      <PmpPageJsonLd page={page} />
      <PmpViewContentTracker
        contentName={page.h1}
        contentIds={['pmp', page.slug]}
      />
      {page.slug === 'pmp-exam-2026' || page.slug.includes('2026') ? <PmpExam2026LiveBanner /> : null}
      <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="purple" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
            <Breadcrumbs items={breadcrumbs} />

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {page.h1}
            </h1>

            <div className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-5 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-purple mb-2">
                Direct answer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{page.directAnswer}</p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
            <PmpRoadmapCtaLink size="lg" />
            <ComparePathwaysCtaLink size="lg" />
            </div>

            {page.path === '/pmp-exam-2026' ? (
              <div className="mb-10 rounded-xl border border-brand-orange/25 bg-brand-orange/5 p-5">
                <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-brand-orange">
                  Structured pathway
                </h2>
                <p className="mb-4 text-sm font-medium leading-relaxed text-slate-700 dark:text-slate-300">
                  Roadmap steps, 90-day focus, tier options, engineer FAQs, and mock-tracking guidance live on
                  the dedicated pathway page so this guide stays focused on exam facts and eligibility.
                </p>
                <Link
                  href={PMP_PATHWAY_PAGE.path}
                  className={buttonVariants({ size: 'lg', variant: 'outline' })}
                >
                  {PMP_PATHWAY_PAGE.shortLabel}
                </Link>
              </div>
            ) : null}

            {page.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-10">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {section.heading}
                </h2>
                <MarkdownBlock
                  text={section.body}
                  listVariant={
                    section.id === 'who-for'
                      ? 'check'
                      : section.id === 'who-not-for'
                        ? 'cross'
                        : 'default'
                  }
                />
              </section>
            ))}

            {page.faqs?.length ? (
              <section className="mb-10" aria-label="Frequently asked questions">
                <h2 className="font-heading text-xl font-bold mb-4">Common questions</h2>
                <div className="space-y-6">
                  {page.faqs.map((faq) => (
                    <article key={faq.question}>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                      <div className="text-slate-600 dark:text-slate-400">
                        <FaqAnswer text={faq.answer} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {page.path === '/pmp-exam-2026' ? (
              <PmpPriorityAnswers
                links={PMP_EXAM_2026_PRIORITY_ANSWERS}
                heading="2026 transition: direct answers"
              />
            ) : null}

            {page.path !== '/pmp-exam-2026' ? (
              <PmpRelatedFaqs relatedPage={page.path} />
            ) : null}

            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-4">Explore next</h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {page.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-brand-purple hover:underline font-medium">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10">
              <PmpRoadmapCtaLink size="lg" />
              <Link
                href="/certifications/compare"
                className={buttonVariants({ size: 'lg', variant: 'outline' })}
              >
                {CTAS.comparePathways}
              </Link>
              {page.path !== '/pmp-exam-2026' ? (
                <Link
                  href="/pmp-exam-2026"
                  className={buttonVariants({ size: 'lg', variant: 'outline' })}
                >
                  PMP 2026 guide
                </Link>
              ) : (
                <Link
                  href="/certifications/pmp"
                  className={buttonVariants({ size: 'lg', variant: 'outline' })}
                >
                  View PMP pathway
                </Link>
              )}
            </div>

            <aside className="text-sm text-slate-500 dark:text-slate-400 border-t pt-6 space-y-3">
              <p>{PMP_INDEPENDENT_DISCLAIMER}</p>
              <p>
                <Link href="/legal/pricing-disclaimers#independent-platform" className="text-brand-purple hover:underline">
                  Independent platform notice
                </Link>
              </p>
              <p>{PMP_ACCREDITATION_NOTE}</p>
            </aside>
        </div>
      </section>
    </>
  );
}