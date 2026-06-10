import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsletterArticlePage } from '@/components/pages/NewsletterArticle';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { getNewsletterArticle, getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { buildPageMetadata } from '@/lib/site-metadata';
import { BRAND } from '@/lib/brand-voice';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getPublishedNewsletterArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

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
  const related = all
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 2);
  const more =
    related.length > 0 ? related : all.filter((a) => a.slug !== article.slug).slice(0, 2);

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
      <NewsletterArticlePage article={article} relatedArticles={more} />
    </>
  );
}
