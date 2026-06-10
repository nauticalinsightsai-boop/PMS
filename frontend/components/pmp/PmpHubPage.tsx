import Link from 'next/link';
import { TrackedConversionLink } from '@/components/analytics/TrackedConversionLink';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_HUB_CARDS } from '@/content/pmp/pages';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import { PmpPathwayComparisonTable } from '@/components/pmp/PmpPathwayComparisonTable';
import { PmpRelatedFaqs } from '@/components/pmp/PmpRelatedFaqs';
import { PmpPriorityAnswers } from '@/components/pmp/PmpPriorityAnswers';
import { PMP_HUB_PRIORITY_ANSWERS } from '@/content/answers/priority-answers';
import { cn } from '@/lib/utils';

export function PmpHubPage() {
  return (
    <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
      <SectionAmbience tone="purple" />
      <div className="container max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            PMP exam preparation hub
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl">
            Independent guides for the 2026 PMP exam transition, domain focus areas, study planning,
            and pathway selection on PM Structure.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {PMP_HUB_CARDS.map((card) => (
              <Link
                key={card.path}
                href={card.path}
                className="block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-colors"
              >
                <h2 className="font-semibold text-slate-900 dark:text-white mb-2">{card.title}</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">{card.description}</p>
              </Link>
            ))}
          </div>

          <PmpPriorityAnswers links={PMP_HUB_PRIORITY_ANSWERS} />

          <h2 className="text-xl font-bold mb-4">Pathways &amp; support</h2>
          <PmpPathwayComparisonTable />

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
            <TrackedConversionLink
              href="/pmp-readiness-diagnostic"
              event={CONVERSION_EVENTS.CLICK_PMP_DIAGNOSTIC}
              className={buttonVariants({ variant: 'outline' })}
            >
              Readiness diagnostic
            </TrackedConversionLink>
            <Link href="/pmp-enrollment" className={buttonVariants({ variant: 'outline' })}>
              Enrollment hub
            </Link>
            <Link href="/pmp-scenario-practice" className={buttonVariants({ variant: 'outline' })}>
              Scenario practice
            </Link>
            <Link href="/pmp-mock-exam" className={buttonVariants({ variant: 'outline' })}>
              Mock exams
            </Link>
          </div>

          <PmpRelatedFaqs relatedPage="/pmp" limit={8} heading="PMP frequently asked questions" />

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
            <Link href="/pmp-faq" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              PMP FAQ
            </Link>
            <Link href="/certifications/pmp" className={buttonVariants({ size: 'lg' })}>
              PMP certification pathway
            </Link>
            <Link href="/answers" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              Direct answers
            </Link>
            <Link href="/topics" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              Topic hubs
            </Link>
          </div>

          <p className="text-sm text-slate-500 mt-10 border-t pt-6">{PMP_INDEPENDENT_DISCLAIMER}</p>
      </div>
    </section>
  );
}
