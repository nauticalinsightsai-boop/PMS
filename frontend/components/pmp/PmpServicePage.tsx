import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import type { PmpServiceContent } from '@/content/pmp/types';
import { PmpServiceJsonLd } from '@/components/seo/PmpServiceJsonLd';
import { PmpEnrollmentTierLinks } from '@/components/pmp/PmpEnrollmentTierLinks';
import { PmpFaqPreview } from '@/components/pmp/PmpFaqPreview';
import { PmpPathwayComparisonTable } from '@/components/pmp/PmpPathwayComparisonTable';
import { PmpRelatedFaqs } from '@/components/pmp/PmpRelatedFaqs';
import { cn } from '@/lib/utils';

export function PmpServicePage({ service }: { service: PmpServiceContent }) {
  const isEnrollment = service.kind === 'enrollment';

  return (
    <>
      <PmpServiceJsonLd service={service} />
      <section className={cn(sectionSurface('warm', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="warm" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
            <nav className="text-sm text-slate-500 mb-6">
              <Link href="/pmp" className="hover:text-brand-orange">
                PMP
              </Link>
              <span className="mx-2">/</span>
              <span>{service.h1}</span>
            </nav>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-6">{service.h1}</h1>

            <div className="rounded-xl border border-brand-orange/20 bg-brand-orange/5 p-5 mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-brand-orange mb-2">
                Direct answer
              </h2>
              <p className="text-slate-700 dark:text-slate-300">{service.directAnswer}</p>
            </div>

            {service.sections.map((section) => (
              <section key={section.id} className="mb-8">
                <h2 className="text-xl font-bold mb-3">{section.heading}</h2>
                <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">{section.body}</p>
              </section>
            ))}

            {isEnrollment ? (
              <section className="mb-10">
                <h2 className="text-xl font-bold mb-4">Enroll by tier</h2>
                <PmpEnrollmentTierLinks />
              </section>
            ) : null}

            {!isEnrollment ? (
              <>
                <h2 className="text-xl font-bold mb-4">Related pathways</h2>
                <PmpPathwayComparisonTable highlight={service.path} />
              </>
            ) : null}

            {service.faqs?.length ? <PmpFaqPreview faqs={service.faqs} /> : null}

            <PmpRelatedFaqs relatedPage={service.path} />

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              {service.ctaHref && service.ctaLabel ? (
                <Link href={service.ctaHref} className={buttonVariants({ size: 'lg' })}>
                  {service.ctaLabel}
                </Link>
              ) : null}
              <Link href="/pmp" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                PMP hub
              </Link>
            </div>

            <p className="text-sm text-slate-500 border-t pt-6">{PMP_INDEPENDENT_DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
