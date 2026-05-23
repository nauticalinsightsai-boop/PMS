import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsletterArticlePage } from '@/components/pages/NewsletterArticle';
import { getNewsletterArticle, newsletterArticles } from '@/data/newsletterArticles';
import { BRAND } from '@/lib/brand-voice';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return newsletterArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getNewsletterArticle(slug);
  if (!article) return { title: `Article | ${BRAND.name}` };
  return {
    title: `${article.title} | ${BRAND.name}`,
    description: article.excerpt,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const article = getNewsletterArticle(slug);
  if (!article) notFound();
  return <NewsletterArticlePage article={article} />;
}
