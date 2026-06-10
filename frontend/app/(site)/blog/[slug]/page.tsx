import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticlePage } from '@/components/pages/BlogArticle';
import { ArticleJsonLd } from '@/components/seo/ArticleJsonLd';
import { getBlogArticle, getPublishedBlogArticles } from '@/lib/blog/posts';
import { buildPageMetadata } from '@/lib/site-metadata';
import { BRAND } from '@/lib/brand-voice';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getPublishedBlogArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) return { title: `Article | ${BRAND.name}` };
  return buildPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = await getBlogArticle(slug);
  if (!article) notFound();

  const all = await getPublishedBlogArticles();
  const related = all
    .filter((a) => a.slug !== article.slug && a.category === article.category)
    .slice(0, 2);
  const more =
    related.length > 0 ? related : all.filter((a) => a.slug !== article.slug).slice(0, 2);

  const path = `/blog/${article.slug}`;
  return (
    <>
      <ArticleJsonLd
        path={path}
        headline={article.title}
        description={article.excerpt}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: article.title, path },
        ]}
      />
      <BlogArticlePage article={article} relatedArticles={more} />
    </>
  );
}
