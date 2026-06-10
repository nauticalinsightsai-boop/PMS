import Link from 'next/link';
import { getFaqsForPmpSurface } from '@/content/faq';

export function PmpRelatedFaqs({
  relatedPage,
  relatedCourse,
  heading = 'Related questions',
  limit = 5,
}: {
  relatedPage: string;
  relatedCourse?: string;
  heading?: string;
  limit?: number;
}) {
  const faqs = getFaqsForPmpSurface(relatedPage, relatedCourse, limit);
  if (!faqs.length) return null;

  return (
    <section className="mb-10" aria-labelledby="pmp-related-faqs-heading">
      <h2 id="pmp-related-faqs-heading" className="font-heading text-xl font-bold mb-4">
        {heading}
      </h2>
      <dl className="space-y-5">
        {faqs.map((faq) => (
          <div key={faq.id}>
            <dt className="font-semibold text-slate-900 dark:text-white mb-1">{faq.question}</dt>
            <dd className="text-slate-600 dark:text-slate-400">
              {faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')}
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm">
        <Link href="/pmp-faq" className="text-brand-purple hover:underline font-medium">
          Browse all PMP FAQs
        </Link>
      </p>
    </section>
  );
}
