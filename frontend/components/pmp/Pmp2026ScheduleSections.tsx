'use client';

import Link from 'next/link';
import { m } from 'motion/react';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { FaqAnswer } from '@/components/faq/FaqAccordionList';
import { Button } from '@/components/ui/button';
import {
  T169_ENGINEER_FAQS,
  T169_MOCK_TRACKING_CTA,
  T169_TRUST_FAQS,
} from '@/content/pmp/flagship-t169';
import { PMP_ROADMAP_CTA_LABEL } from '@/lib/pmp-roadmap-cta';
import { trackConversionEvent, CONVERSION_EVENTS } from '@/lib/analytics/conversion-events';

const SECTION_PY = 'py-16 sm:py-20 md:py-24';

function FaqBlock({
  id,
  title,
  faqs,
  tone,
}: {
  id: string;
  title: string;
  faqs: ReadonlyArray<{ question: string; answer: string }>;
  tone: 'purple' | 'soft';
}) {
  return (
    <section id={id} className={sectionSurface(tone, SECTION_PY)}>
      <SectionAmbience tone={tone} />
      <div className="container relative z-10 mx-auto max-w-3xl px-4">
        <h2 className="font-heading text-section mb-8 font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h2>
        <div className="space-y-8">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
              <div className="font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                <FaqAnswer text={faq.answer} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Pmp2026ScheduleSections() {
  return (
    <>
      <FaqBlock
        id="pmp-engineer-faq"
        title="PMP for engineers: focused questions"
        faqs={T169_ENGINEER_FAQS}
        tone="soft"
      />

      <section id="pmp-mock-tracking-cta" className={sectionSurface('purple', SECTION_PY)}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto max-w-3xl px-4 text-center">
          <m.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-section mb-4 font-bold tracking-tight text-slate-900 dark:text-white">
              {T169_MOCK_TRACKING_CTA.heading}
            </h2>
            <p className="mb-8 text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              {T169_MOCK_TRACKING_CTA.body}
            </p>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                className="h-12 rounded-full bg-brand-orange px-8 font-bold text-white hover:bg-brand-hover"
              >
                <Link
                  href={T169_MOCK_TRACKING_CTA.primaryHref}
                  onClick={() =>
                    trackConversionEvent(CONVERSION_EVENTS.CLICK_PMP_DIAGNOSTIC, {
                      placement: 'mock_tracking_cta',
                    })
                  }
                >
                  {T169_MOCK_TRACKING_CTA.primaryLabel}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-brand-purple/30 px-8 font-bold"
              >
                <Link href={T169_MOCK_TRACKING_CTA.secondaryHref}>{T169_MOCK_TRACKING_CTA.secondaryLabel}</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
              Prefer a full roadmap first?{' '}
              <Link href="/certifications/pmp#cert-roadmap-form" className="font-bold text-brand-orange hover:underline">
                {PMP_ROADMAP_CTA_LABEL}
              </Link>
            </p>
          </m.div>
        </div>
      </section>

      <FaqBlock
        id="pmp-trust-faq"
        title="Trust and expectations"
        faqs={T169_TRUST_FAQS}
        tone="soft"
      />
    </>
  );
}
