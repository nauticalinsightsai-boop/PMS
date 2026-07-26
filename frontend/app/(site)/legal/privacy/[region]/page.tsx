import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPrivacyRegionPage } from '@/components/pages/legal/LegalPrivacyPage';
import type { LegalRegionSlug } from '@/content/legal/types';
import { buildPageMetadata } from '@/lib/site-metadata';

const VALID: LegalRegionSlug[] = ['eu', 'uk', 'us', 'gcc', 'india', 'pakistan'];

const TITLES: Record<LegalRegionSlug, string> = {
  global: 'Global',
  eu: 'EU / EEA',
  uk: 'United Kingdom',
  us: 'United States',
  gcc: 'GCC',
  india: 'India',
  pakistan: 'Pakistan',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const slug = region as LegalRegionSlug;
  if (!VALID.includes(slug)) {
    return buildPageMetadata({
      title: 'Privacy Policy',
      path: `/legal/privacy/${region}`,
    });
  }
  const label = TITLES[slug];
  return buildPageMetadata({
    title: `Privacy Policy (${label})`,
    description: `Regional privacy notice for ${label}: how PM Structure collects, uses, and protects personal data for learners and site visitors.`,
    path: `/legal/privacy/${slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  if (!VALID.includes(region as LegalRegionSlug)) notFound();
  return <LegalPrivacyRegionPage region={region as LegalRegionSlug} />;
}
