import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnswerPage } from '@/components/answers/AnswerPage';
import { getAnswerPage } from '@/content/answers/pages';
import { getPublishedAnswerPages, isAnswerPublished } from '@/content/answers';
import { buildPageMetadata, buildPhase2PageMetadata } from '@/lib/site-metadata';
import { getPhase2Seo, titleNeedsNoSuffix } from '@/content/seo/phase-2-page-seo';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedAnswerPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getAnswerPage(slug);
  if (!page) return {};
  const phase2 = getPhase2Seo(page.path);
  if (phase2) {
    return buildPageMetadata({
      title: phase2.title,
      description: phase2.description,
      path: phase2.canonicalPath,
      noSuffix: titleNeedsNoSuffix(phase2.title),
      ...(page.status && !isAnswerPublished(page) ? { robots: { index: false, follow: false } } : {}),
    });
  }
  return buildPageMetadata({
    title: page.title,
    description: page.description,
    path: page.path,
    noSuffix: page.title.includes('| PM Structure'),
    ...(page.status && !isAnswerPublished(page) ? { robots: { index: false, follow: false } } : {}),
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = getAnswerPage(slug);
  if (!page) notFound();
  return <AnswerPage page={page} />;
}
