import {
  getPmpFaqsPublished,
  getPmpCategoryLabel,
  PMP_FAQ_HUB_H2_GROUPS,
  resolveFaqFullAnswer,
  resolveFaqShortAnswer,
  resolvePmpCategoryId,
} from '@/content/faq';

/** Plain-text PMP FAQ block for crawlers on /pmp-faq. */
export function PmpFaqCrawlableContent() {
  const published = getPmpFaqsPublished();

  return (
    <section aria-label="PMP FAQ full text" className="sr-only">
      {PMP_FAQ_HUB_H2_GROUPS.map((group) => {
        const items = group.categoryIds.flatMap((catId) =>
          published.filter((f) => resolvePmpCategoryId(f) === catId),
        );
        if (!items.length) return null;
        return (
          <div key={group.h2}>
            <h2>{group.h2}</h2>
            {items.map((faq) => (
              <article key={faq.id}>
                <h3>{faq.question}</h3>
                <p>{resolveFaqShortAnswer(faq)}</p>
                <div>{resolveFaqFullAnswer(faq).replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')}</div>
                {resolvePmpCategoryId(faq) ? (
                  <p>Category: {getPmpCategoryLabel(resolvePmpCategoryId(faq)!)}</p>
                ) : null}
              </article>
            ))}
          </div>
        );
      })}
    </section>
  );
}
