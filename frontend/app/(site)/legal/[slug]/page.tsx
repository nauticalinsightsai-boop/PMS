import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import { DYNAMIC_LEGAL_SLUGS, getLegalDocumentBySlug } from '@/content/legal';
import { buildPageMetadata } from '@/lib/site-metadata';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DYNAMIC_LEGAL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getLegalDocumentBySlug(slug);
  if (!doc) return {};
  return buildPageMetadata({
    title: doc.title,
    description: doc.jurisdictionNote,
    path: `/legal/${slug}`,
  });
}

export default async function LegalSlugPage({ params }: Props) {
  const { slug } = await params;
  const document = getLegalDocumentBySlug(slug);
  if (!document) notFound();
  return <LegalDocumentLayout document={document} />;
}
