import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import type { AnswerPageContent } from '@/content/answers/types';
import { AnswerJsonLd } from '@/components/seo/AnswerJsonLd';
import { cn } from '@/lib/utils';

export function AnswerPage({ page }: { page: AnswerPageContent }) {
  return (
    <>
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
                  <li key={step}>{step}</li>
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

            {page.faqs?.length ? (
              <section className="mb-10" aria-label="Follow-up questions">
                <h2 className="font-heading text-xl font-bold mb-4">Follow-up questions</h2>
                <div className="space-y-5">
                  {page.faqs.map((faq) => (
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
              <Link href="/faq?tab=pmp-2026" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
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
