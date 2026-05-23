import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPrivacyGccCountryPage } from '@/components/pages/legal/LegalPrivacyPage';
import { GCC_COUNTRY_SLUGS, type GccCountryLegalSlug } from '@/content/legal';
import { BRAND } from '@/lib/brand-voice';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country } = await params;
  return { title: `Privacy Policy (GCC — ${country.toUpperCase()}) | ${BRAND.name}` };
}

export default async function Page({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const slug = country.toLowerCase() as GccCountryLegalSlug;
  if (!GCC_COUNTRY_SLUGS.includes(slug)) notFound();
  return <LegalPrivacyGccCountryPage country={slug} />;
}
