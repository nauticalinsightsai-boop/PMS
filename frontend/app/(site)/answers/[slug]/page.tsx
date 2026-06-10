import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnswerPage } from '@/components/answers/AnswerPage';
import { getAnswerPage } from '@/content/answers/pages';
import { getPublishedAnswerPages, isAnswerPublished } from '@/content/answers';
import { buildPageMetadata } from '@/lib/site-metadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedAnswerPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAnswerPage(slug);
  if (!page) return {};
  const title = page.title.includes('| PM Structure')
    ? page.title
    : `${page.title} | PM Structure`;
  return buildPageMetadata({
    title,
    description: page.description,
    path: page.path,
    ...(page.status && !isAnswerPublished(page) ? { robots: { index: false, follow: false } } : {}),
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage(slug);
  if (!page) notFound();
  return <AnswerPage page={page} />;
}
