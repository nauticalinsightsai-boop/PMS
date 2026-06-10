import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import { PMP_LMS_NOTE, PMP_PRICING_NOTE } from '@/content/pmp/shared';
import type { PmpCourseContent } from '@/content/pmp/courses';
import { PmpCourseJsonLd } from '@/components/seo/PmpCourseJsonLd';
import { PmpFaqPreview } from '@/components/pmp/PmpFaqPreview';
import { PmpPathwayComparisonTable } from '@/components/pmp/PmpPathwayComparisonTable';
import { PmpRelatedFaqs } from '@/components/pmp/PmpRelatedFaqs';
import { cn } from '@/lib/utils';

export function PmpCoursePage({ course }: { course: PmpCourseContent }) {
  return (
    <>
      <PmpCourseJsonLd course={course} />
      <section className={cn(sectionSurface('warm', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="warm" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
            <nav className="text-sm text-slate-500 mb-6">
              <Link href="/pmp" className="hover:text-brand-orange">
                PMP
              </Link>
              <span className="mx-2">/</span>
              <span>{course.h1}</span>
            </nav>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-6">{course.h1}</h1>

            <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-5 mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-2">
                Direct answer
              </h2>
              <p className="text-slate-700 dark:text-slate-300">{course.directAnswer}</p>
            </div>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-3">Who this pathway is for</h2>
              <p className="text-slate-600 dark:text-slate-400">{course.forLearners}</p>
              {course.notForLearners ? (
                <p className="text-slate-500 dark:text-slate-500 mt-3 text-sm">
                  <span className="font-medium">May not fit:</span> {course.notForLearners}
                </p>
              ) : null}
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-3">Learning outcomes</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                {course.outcomes.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold mb-3">What is included</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-400">
                {course.modules.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-xl font-bold mb-3">Current vs new PMP exam relevance</h2>
              <p className="text-slate-600 dark:text-slate-400">{course.examRelevance}</p>
              <p className="mt-3 text-sm">
                <Link href="/pmp-exam-2026" className="text-brand-orange hover:underline">
                  Read the PMP 2026 guide
                </Link>
                {' · '}
                <Link href="/pmp-readiness-diagnostic" className="text-brand-orange hover:underline">
                  Take the readiness diagnostic
                </Link>
              </p>
            </section>

            <h2 className="text-xl font-bold mb-4">Compare pathways</h2>
            <PmpPathwayComparisonTable highlight={course.path} />

            <section className="mb-8 rounded-lg border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-lg font-bold mb-2">Regional pricing</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{PMP_PRICING_NOTE}</p>
            </section>

            <section className="mb-10 rounded-lg border border-slate-200 dark:border-slate-800 p-5">
              <h2 className="text-lg font-bold mb-2">LMS access after enrollment</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{PMP_LMS_NOTE}</p>
            </section>

            <PmpFaqPreview faqs={course.faqs} />

            <PmpRelatedFaqs relatedPage="/pmp-exam-2026" relatedCourse={course.path} />

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href={course.enrollPath} className={buttonVariants({ size: 'lg' })}>
                Enroll in {course.tier} tier
              </Link>
              <Link
                href="/pmp-readiness-diagnostic"
                className={buttonVariants({ size: 'lg', variant: 'outline' })}
              >
                Readiness diagnostic
              </Link>
              <Link
                href="/certifications/pmp"
                className={buttonVariants({ size: 'lg', variant: 'outline' })}
              >
                Certification overview
              </Link>
            </div>

            <p className="text-sm text-slate-500 border-t pt-6">{PMP_INDEPENDENT_DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
