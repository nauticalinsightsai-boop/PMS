import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NewsletterAuthorPage } from '@/components/pages/NewsletterAuthor';
import { getNewsletterAuthor, getPublishedNewsletterAuthors } from '@/lib/newsletter/authors';
import { getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { buildPageMetadata } from '@/lib/site-metadata';
import { BRAND } from '@/lib/brand-voice';
import { findAuthorForArticle } from '@pms/site-content/newsletter-authors';

/** Read Supabase on request so new authors are not stuck as cached 404s. */
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getNewsletterAuthor(slug);
  if (!author) return { title: `Author | ${BRAND.name}` };
  return buildPageMetadata({
    title: `${author.name}${author.title ? ` — ${author.title}` : ''}`,
    description: author.bio || `Articles by ${author.name} on The Structure Report.`,
    path: `/newsletter/author/${slug}`,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const author = await getNewsletterAuthor(slug);
  if (!author) notFound();

  const allArticles = await getPublishedNewsletterArticles();
  const authored = allArticles.filter(
    (article) => findAuthorForArticle(article, [author])?.id === author.id,
  );

  return <NewsletterAuthorPage author={author} articles={authored} />;
}
