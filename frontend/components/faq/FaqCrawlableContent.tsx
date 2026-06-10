import { getAllFaqs } from '@/content/faq';

/** Plain-text FAQ block for crawlers; accordion UI may collapse answers in the DOM. */
export function FaqCrawlableContent() {
  const faqs = getAllFaqs();

  return (
    <section aria-label="FAQ full text" className="sr-only">
      {faqs.map((faq) => (
        <article key={faq.id}>
          <h2>{faq.question}</h2>
          <p>{faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')}</p>
        </article>
      ))}
    </section>
  );
}
