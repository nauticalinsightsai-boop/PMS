import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnswerPage } from '@/components/answers/AnswerPage';
import { ANSWER_SLUGS, getAnswerPage } from '@/content/answers/pages';
import { buildPageMetadata } from '@/lib/site-metadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ANSWER_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAnswerPage(slug);
  if (!page) return {};
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage(slug);
  if (!page) notFound();
  return <AnswerPage page={page} />;
}
