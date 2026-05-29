import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogArticlePage } from '@/components/pages/BlogArticle';
import { getBlogArticle, getPublishedBlogArticles } from '@/lib/blog/posts';
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
  return {
    title: `${article.title} | ${BRAND.name}`,
    description: article.excerpt,
  };
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

  return <BlogArticlePage article={article} relatedArticles={more} />;
}
