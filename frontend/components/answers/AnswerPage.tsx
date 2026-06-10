import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import type { AnswerPageContent } from '@/content/answers/types';
import { getAnswerFaqsForPage } from '@/content/answers';
import {
  isBareInternalPath,
  labelForInternalPath,
  splitStepWithPaths,
  stepContainsInternalPath,
} from '@/content/answers/next-step-labels';
import { AnswerJsonLd } from '@/components/seo/AnswerJsonLd';
import { ConversionViewTracker } from '@/components/analytics/ConversionViewTracker';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { cn } from '@/lib/utils';

function AnswerNextStep({ step }: { step: string }) {
  if (isBareInternalPath(step)) {
    return (
      <Link href={step} className="text-brand-purple hover:underline font-medium">
        {labelForInternalPath(step)}
      </Link>
    );
  }

  if (!stepContainsInternalPath(step)) {
    return <>{step}</>;
  }

  return (
    <>
      {splitStepWithPaths(step).map((part, index) =>
        part.startsWith('/') ? (
          <Link
            key={`${part}-${index}`}
            href={part}
            className="text-brand-purple hover:underline font-medium"
          >
            {labelForInternalPath(part)}
          </Link>
        ) : (
          <span key={`text-${index}`}>{part}</span>
        ),
      )}
    </>
  );
}

export function AnswerPage({ page }: { page: AnswerPageContent }) {
  const linkedFaqs = [...(page.faqs ?? []), ...getAnswerFaqsForPage(page)];
  return (
    <>
      <ConversionViewTracker
        event={CONVERSION_EVENTS.VIEW_ANSWER_PAGE}
        slug={page.slug}
      />
      <AnswerJsonLd page={page} />
      <section className={cn(sectionSurface('cool', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="cool" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
            <nav className="text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-purple">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/answers" className="hover:text-brand-purple">
                Answers
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-700 dark:text-slate-300 line-clamp-1">{page.question}</span>
            </nav>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {page.question}
            </h1>

            <div className="rounded-xl border border-brand-purple/20 bg-brand-purple/5 p-5 mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-purple mb-2">
                Short answer
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{page.shortAnswer}</p>
            </div>

            <section className="mb-10">
              <h2 className="font-heading text-xl sm:text-2xl font-bold mb-4">Detailed answer</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{page.detailedAnswer}</p>
            </section>

            {page.whoApplies ? (
              <section className="mb-10">
                <h2 className="font-heading text-xl font-bold mb-3">Who this applies to</h2>
                <p className="text-slate-600 dark:text-slate-400">{page.whoApplies}</p>
              </section>
            ) : null}

            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-3">Next steps</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                {page.nextSteps.map((step) => (
                  <li key={step}>
                    <AnswerNextStep step={step} />
                  </li>
                ))}
              </ul>
            </section>

            {page.relatedCourses.length ? (
              <section className="mb-8">
                <h2 className="font-heading text-xl font-bold mb-3">Related pathways</h2>
                <ul className="space-y-2">
                  {page.relatedCourses.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-brand-purple hover:underline font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.relatedPages.length ? (
              <section className="mb-8">
                <h2 className="font-heading text-xl font-bold mb-3">Related guides</h2>
                <ul className="space-y-2">
                  {page.relatedPages.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-brand-purple hover:underline font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.relatedAnswers.length ? (
              <section className="mb-10">
                <h2 className="font-heading text-xl font-bold mb-3">Related answers</h2>
                <ul className="space-y-2">
                  {page.relatedAnswers.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-brand-purple hover:underline font-medium">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.cautions?.length ? (
              <section className="mb-10">
                <h2 className="font-heading text-xl font-bold mb-3">Common mistakes</h2>
                <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                  {page.cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {page.references?.length ? (
              <section className="mb-10">
                <h2 className="font-heading text-xl font-bold mb-3">References &amp; verification notes</h2>
                <ul className="space-y-2 text-sm">
                  {page.references.map((ref) => (
                    <li key={ref.url}>
                      <a href={ref.url} className="text-brand-purple hover:underline" rel="noopener noreferrer">
                        {ref.label}
                      </a>
                    </li>
                  ))}
                </ul>
                {page.sourceTodo ? (
                  <p className="text-xs text-slate-500 mt-3">TODO: {page.sourceTodo}</p>
                ) : null}
              </section>
            ) : null}

            {linkedFaqs.length ? (
              <section className="mb-10" aria-label="Follow-up questions">
                <h2 className="font-heading text-xl font-bold mb-4">Related FAQs</h2>
                <div className="space-y-5">
                  {linkedFaqs.map((faq) => (
                    <article key={faq.question}>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href={page.ctaHref} className={buttonVariants({ size: 'lg' })}>
                {page.ctaLabel}
              </Link>
              <Link href="/pmp-faq" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                PMP FAQs
              </Link>
              <Link href="/answers" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                All answers
              </Link>
            </div>

            <p className="text-sm text-slate-500 border-t pt-6">
              {PMP_INDEPENDENT_DISCLAIMER}{' '}
              <Link href="/legal/pricing-disclaimers#independent-platform" className="text-brand-purple hover:underline">
                Independent platform notice
              </Link>
            </p>
        </div>
      </section>
    </>
  );
}
