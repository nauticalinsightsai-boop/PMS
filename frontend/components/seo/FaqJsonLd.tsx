import { getFaqForSchema } from '@/content/faq';
import { buildFaqPageSchema } from '@/lib/schema';

/** All FAQ entries are mirrored in FaqCrawlableContent (sr-only) on /faq for crawlability. */
export function FaqJsonLd() {
  const items = getFaqForSchema();
  const schema = buildFaqPageSchema(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
