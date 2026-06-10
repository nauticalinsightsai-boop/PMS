import type { PmpFaq } from '@/content/pmp/types';

export function PmpFaqPreview({ faqs, heading = 'Frequently asked questions' }: { faqs: PmpFaq[]; heading?: string }) {
  if (!faqs.length) return null;

  return (
    <section className="mb-10" aria-labelledby="pmp-faq-preview-heading">
      <h2 id="pmp-faq-preview-heading" className="text-xl font-bold mb-4">
        {heading}
      </h2>
      <dl className="space-y-5">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <dt className="font-semibold text-slate-900 dark:text-white mb-1">{faq.question}</dt>
            <dd className="text-slate-600 dark:text-slate-400">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
