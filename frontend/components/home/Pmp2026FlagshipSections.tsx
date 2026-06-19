'use client';

import { m } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { Pmp2026ComplianceNote } from '@/components/pmp/Pmp2026ComplianceNote';
import { PmpRoadmapCtaLink } from '@/components/pmp/PmpRoadmapCtaLink';
import {
  T169_FAQS,
  T169_NINETY_DAY_FOCUS,
  T169_ROADMAP_STEPS,
  T169_WHO_FOR,
  T169_WHO_NOT_FOR,
} from '@/content/pmp/flagship-t169';
import { FaqAnswer } from '@/components/faq/FaqAccordionList';

const SECTION_PY = 'py-16 sm:py-20 md:py-24';

export function Pmp2026FlagshipSections() {
  return (
    <>
      <section className={sectionSurface('purple', SECTION_PY)}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto px-4">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-brand-purple/10 text-brand-purple border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              {T169_NINETY_DAY_FOCUS.label}
            </Badge>
            <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              {T169_NINETY_DAY_FOCUS.heading}
            </h2>
            {T169_NINETY_DAY_FOCUS.body.split('\n\n').map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-medium"
              >
                {paragraph}
              </p>
            ))}
            <ul className="space-y-3 mb-8">
              {T169_NINETY_DAY_FOCUS.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-5 w-5 text-brand-purple shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <PmpRoadmapCtaLink
              className="w-full sm:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-base shadow-lg"
            />
            <Pmp2026ComplianceNote className="mt-8" showSourceLinks />
          </m.div>
        </div>
      </section>

      <section className={`${SECTION_PY} bg-white dark:bg-slate-950`}>
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-10 tracking-tight">
            {T169_ROADMAP_STEPS.heading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
            {T169_ROADMAP_STEPS.steps.map((step, index) => (
              <m.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6 sm:p-8"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange text-sm font-bold mb-4">
                  {index + 1}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {step.body}
                </p>
              </m.div>
            ))}
          </div>
          <Pmp2026ComplianceNote />
        </div>
      </section>

      <section className={sectionSurface('soft', SECTION_PY)}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                {T169_WHO_FOR.heading}
              </h2>
              <ul className="space-y-3 mb-8">
                {T169_WHO_FOR.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
                {T169_WHO_NOT_FOR.heading}
              </h2>
              <ul className="space-y-3 mb-8">
                {T169_WHO_NOT_FOR.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                    <XCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Pmp2026ComplianceNote />
        </div>
      </section>

      <section className={`${SECTION_PY} bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900`}>
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-heading text-section font-bold mb-8 tracking-tight">
            PMP 2026 readiness: common questions
          </h2>
          <div className="space-y-8 mb-8">
            {T169_FAQS.map((faq) => (
              <article key={faq.question}>
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <div className="text-slate-300 dark:text-slate-600 font-medium leading-relaxed">
                  <FaqAnswer text={faq.answer} />
                </div>
              </article>
            ))}
          </div>
          <Pmp2026ComplianceNote
            className="border-slate-700 bg-slate-800/60 text-slate-300 dark:border-slate-200 dark:bg-white dark:text-slate-600"
          />
        </div>
      </section>
    </>
  );
}
