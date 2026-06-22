import { FaqAnswer } from '@/components/faq/FaqAccordionList';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { T169_CONSIDERATION_FAQS } from '@/content/pmp/flagship-t169';

export function PmpConsiderationsSection() {
  return (
    <section id="pmp-considerations" className={sectionSurface('soft', 'py-14 sm:py-16')}>
      <SectionAmbience tone="soft" />
      <div className="container relative z-10 mx-auto max-w-3xl px-4">
        <h2 className="font-heading mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Common considerations before you enroll
        </h2>
        <div className="space-y-6">
          {T169_CONSIDERATION_FAQS.map((faq) => (
            <article key={faq.question}>
              <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
              <div className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                <FaqAnswer text={faq.answer} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
