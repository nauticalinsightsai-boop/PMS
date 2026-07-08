import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsletterArticlePage } from '@/components/pages/NewsletterArticle';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { getNewsletterArticle, getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { pickRelatedNewsletterArticles } from '@/lib/newsletter/related-articles';
import { buildPageMetadata } from '@/lib/site-metadata';
import { BRAND } from '@/lib/brand-voice';

/** Always read Supabase on request so newly published slugs are not stuck as cached 404s. */
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsletterArticle(slug);
  if (!article) return { title: `Article | ${BRAND.name}` };
  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/newsletter/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsletterArticle(slug);
  if (!article) notFound();

  const all = await getPublishedNewsletterArticles();
  const relatedArticles = pickRelatedNewsletterArticles(article, all);

  const path = `/newsletter/${article.slug}`;
  return (
    <>
      <ArticleJsonLd
        path={path}
        headline={article.title}
        description={article.excerpt}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Newsletter', path: '/newsletter' },
          { name: article.title, path },
        ]}
      />
      <NewsletterArticlePage article={article} relatedArticles={relatedArticles} />
    </>
  );
}
