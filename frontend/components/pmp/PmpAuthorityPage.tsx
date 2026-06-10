import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_ACCREDITATION_NOTE, PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import type { PmpPageContent } from '@/content/pmp/types';
import { PmpPageJsonLd } from '@/components/seo/PmpPageJsonLd';
import { PmpRelatedFaqs } from '@/components/pmp/PmpRelatedFaqs';
import { PmpPriorityAnswers } from '@/components/pmp/PmpPriorityAnswers';
import { PMP_EXAM_2026_PRIORITY_ANSWERS } from '@/content/answers/priority-answers';
import { ConversionViewTracker } from '@/components/analytics/ConversionViewTracker';
import { TrackedConversionLink } from '@/components/analytics/TrackedConversionLink';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { cn } from '@/lib/utils';

function MarkdownBlock({ text }: { text: string }) {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}

export function PmpAuthorityPage({ page }: { page: PmpPageContent }) {
  const viewEvent =
    page.slug === 'pmp-exam-2026' ? CONVERSION_EVENTS.VIEW_PMP_EXAM_2026 : null;

  return (
    <>
      {viewEvent ? <ConversionViewTracker event={viewEvent} /> : null}
      <PmpPageJsonLd page={page} />
      <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="purple" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
            <nav className="text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-purple">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/pmp" className="hover:text-brand-purple">
                PMP
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-700 dark:text-slate-300">{page.h1}</span>
            </nav>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {page.h1}
            </h1>

            <div className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-5 mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-purple mb-2">
                Direct answer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{page.directAnswer}</p>
            </div>

            {page.sections.map((section) => (
              <section key={section.id} id={section.id} className="mb-10">
                <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  {section.heading}
                </h2>
                <MarkdownBlock text={section.body} />
              </section>
            ))}

            {page.faqs?.length ? (
              <section className="mb-10" aria-label="Frequently asked questions">
                <h2 className="font-heading text-xl font-bold mb-4">Common questions</h2>
                <div className="space-y-6">
                  {page.faqs.map((faq) => (
                    <article key={faq.question}>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            {page.path === '/pmp-exam-2026' ? (
              <PmpPriorityAnswers
                links={PMP_EXAM_2026_PRIORITY_ANSWERS}
                heading="2026 transition — direct answers"
              />
            ) : null}

            <PmpRelatedFaqs relatedPage={page.path} />

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
              <Link href="/certifications/pmp" className={buttonVariants({ size: 'lg' })}>
                View PMP pathway
              </Link>
              {page.path !== '/pmp-exam-2026' ? (
                <Link
                  href="/pmp-exam-2026"
                  className={buttonVariants({ size: 'lg', variant: 'outline' })}
                >
                  PMP 2026 guide
                </Link>
              ) : null}
              <TrackedConversionLink
                href="/pmp-readiness-diagnostic"
                event={CONVERSION_EVENTS.CLICK_PMP_DIAGNOSTIC}
                className={buttonVariants({ size: 'lg', variant: 'outline' })}
              >
                Readiness diagnostic
              </TrackedConversionLink>
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
