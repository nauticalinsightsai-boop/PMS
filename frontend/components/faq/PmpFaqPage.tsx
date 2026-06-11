'use client';

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import {
  getFaqsByPmpCategory,
  getPmpCategoryLabel,
  PMP_FAQ_HUB_H2_GROUPS,
} from '@/content/faq';
import { FaqAccordionList } from '@/components/faq/FaqAccordionList';
import { ConversionViewTracker } from '@/components/analytics/ConversionViewTracker';
import { CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';

export function PmpFaqPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <ConversionViewTracker event={CONVERSION_EVENTS.VIEW_PMP_FAQ} />
      <section
        className={sectionSurface(
          'purple',
          'py-16 md:py-24 border-b border-sandstone/60 dark:border-slate-800',
        )}
      >
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <div className="inline-flex p-3 rounded-2xl bg-brand-purple/10 text-brand-purple mb-6">
            <HelpCircle className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-6">
            PMP Frequently Asked Questions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
            PMP exam 2026 transition, domains, readiness, pathways, pricing, and compliance: answered
            for PM Structure candidates.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/pmp-readiness-diagnostic" className={buttonVariants({ variant: 'brand' })}>
              PMP readiness diagnostic
            </Link>
            <Link href="/pmp-exam-2026" className={buttonVariants({ variant: 'outline' })}>
              PMP exam 2026 hub
            </Link>
            <Link href="/faq" className={buttonVariants({ variant: 'outline' })}>
              All site FAQs
            </Link>
          </div>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-20')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto max-w-3xl space-y-14">
          {PMP_FAQ_HUB_H2_GROUPS.map((group) => {
            const sections = group.categoryIds
              .map((catId) => ({
                catId,
                items: getFaqsByPmpCategory(catId),
              }))
              .filter((s) => s.items.length > 0);
            if (!sections.length) return null;
            return (
              <div key={group.h2}>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">{group.h2}</h2>
                <div className="space-y-10">
                  {sections.map(({ catId, items }) => (
                    <section key={catId} id={`pmp-faq-${catId}`} className="scroll-mt-24">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                        {getPmpCategoryLabel(catId)}
                      </h3>
                      <FaqAccordionList items={items} />
                    </section>
                  ))}
                </div>
              </div>
            );
          })}

          <p className="text-sm text-slate-500 border-t pt-6">{PMP_INDEPENDENT_DISCLAIMER}</p>
          <p className="text-sm">
            <Link href="/topics" className="text-brand-purple hover:underline">
              Topic hubs
            </Link>
            {' · '}
            <Link href="/legal/pricing-disclaimers#independent-platform" className="text-brand-purple hover:underline">
              Independent platform notice
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}