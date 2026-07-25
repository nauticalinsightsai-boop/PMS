import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsletterArticlePage } from '@/components/pages/NewsletterArticle';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { getNewsletterArticle, getPublishedNewsletterArticles, getDraftNewsletterArticle } from '@/lib/newsletter/articles';
import type { NewsletterArticle } from '@/lib/newsletter/articles';
import { pickRelatedNewsletterArticles } from '@/lib/newsletter/related-articles';
import { buildPageMetadata } from '@/lib/site-metadata';
import { BRAND } from '@/lib/brand-voice';

/** Always read Supabase on request so newly published slugs are not stuck as cached 404s. */
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

function hasCompletePublicArticleSchemaFields(article: NewsletterArticle): boolean {
  return Boolean(
    article.title.trim() &&
      article.excerpt.trim() &&
      article.image.trim() &&
      article.author.trim() &&
      article.datePublished?.trim() &&
      !Number.isNaN(Date.parse(article.datePublished)) &&
      article.dateModified?.trim() &&
      !Number.isNaN(Date.parse(article.dateModified)),
  );
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isDraftPreview = preview === '1' && process.env.NODE_ENV === 'development';

  const article = isDraftPreview
    ? await getDraftNewsletterArticle(slug)
    : await getNewsletterArticle(slug);

  if (!article) return { title: `Article | ${BRAND.name}` };

  // Drafts are noindex
  const robots = isDraftPreview ? { index: false, follow: false } : undefined;

  return buildPageMetadata({
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    path: `/newsletter/${slug}`,
    ogImage: article.image,
    robots,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isDraftPreview = preview === '1' && process.env.NODE_ENV === 'development';

  const article = isDraftPreview
    ? await getDraftNewsletterArticle(slug)
    : await getNewsletterArticle(slug);

  if (!article) notFound();

  const all = await getPublishedNewsletterArticles();
  const relatedArticles = pickRelatedNewsletterArticles(article, all);

  const path = `/newsletter/${article.slug}`;
  const shouldEmitArticleJsonLd =
    !isDraftPreview || hasCompletePublicArticleSchemaFields(article);
  return (
    <>
      {isDraftPreview && (
        <div style={{
          background: '#f59e0b',
          color: '#000',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.875rem',
        }}>
          DRAFT PREVIEW MODE - NOT INDEXED - DEVELOPMENT ONLY
        </div>
      )}
      {shouldEmitArticleJsonLd && (
        <ArticleJsonLd
          path={path}
          headline={article.title}
          description={article.excerpt}
          image={article.image}
          datePublished={article.datePublished}
          dateModified={article.dateModified}
          author={{
            name: article.author,
            url: article.authorSlug
              ? `/newsletter/author/${article.authorSlug}`
              : article.authorWebsiteUrl,
            personSchemaEligible: article.authorPersonSchemaEligible,
          }}
          breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'Newsletter', path: '/newsletter' },
            { name: article.title, path },
          ]}
        />
      )}
      <NewsletterArticlePage article={article} relatedArticles={relatedArticles} />
    </>
  );
}
