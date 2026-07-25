import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPrivacyGccCountryPage } from '@/components/pages/legal/LegalPrivacyPage';
import { GCC_COUNTRY_SLUGS, type GccCountryLegalSlug } from '@/content/legal';
import { buildPageMetadata } from '@/lib/site-metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  const code = country.toUpperCase();
  return buildPageMetadata({
    title: `Privacy Policy (GCC: ${code})`,
    description: `Privacy policy details for GCC country code ${code}.`,
    path: `/legal/privacy/gcc/${country.toLowerCase()}`,
  });
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const slug = country.toLowerCase() as GccCountryLegalSlug;
  if (!GCC_COUNTRY_SLUGS.includes(slug)) notFound();
  return <LegalPrivacyGccCountryPage country={slug} />;
}
