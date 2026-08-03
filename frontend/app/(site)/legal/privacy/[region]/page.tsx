import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPrivacyRegionPage } from '@/components/pages/legal/LegalPrivacyPage';
import type { LegalRegionSlug } from '@/content/legal/types';
import { buildPageMetadata } from '@/lib/site-metadata';

type PublishedPrivacyRegion = Exclude<LegalRegionSlug, 'global'>;

const VALID: PublishedPrivacyRegion[] = ['eu', 'uk', 'us', 'gcc', 'india', 'pakistan'];

const REGION_METADATA: Record<
  PublishedPrivacyRegion,
  { title: string; description: string; path: string }
> = {
  eu: {
    title: 'Privacy Policy (EU / EEA)',
    description:
      'PM Structure privacy policy for people in the EU and EEA, explaining how personal data is collected, used, stored, and protected.',
    path: '/legal/privacy/eu',
  },
  uk: {
    title: 'Privacy Policy (United Kingdom)',
    description:
      'PM Structure privacy policy for people in the United Kingdom, explaining how personal data is collected, used, stored, and protected.',
    path: '/legal/privacy/uk',
  },
  us: {
    title: 'Privacy Policy (United States)',
    description:
      'PM Structure privacy policy for people in the United States, explaining how personal data is collected, used, stored, and protected.',
    path: '/legal/privacy/us',
  },
  gcc: {
    title: 'Privacy Policy (GCC)',
    description:
      'PM Structure privacy policy for people in the GCC, explaining how personal data is collected, used, stored, and protected.',
    path: '/legal/privacy/gcc',
  },
  india: {
    title: 'Privacy Policy (India)',
    description:
      'PM Structure privacy policy for people in India, explaining how personal data is collected, used, stored, and protected.',
    path: '/legal/privacy/india',
  },
  pakistan: {
    title: 'Privacy Policy (Pakistan)',
    description:
      'PM Structure privacy policy for people in Pakistan, explaining how personal data is collected, used, stored, and protected.',
    path: '/legal/privacy/pakistan',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}): Promise<Metadata> {
  const { region } = await params;
  const slug = region as PublishedPrivacyRegion;
  if (!VALID.includes(slug)) return {};
  return buildPageMetadata(REGION_METADATA[slug]);
}

export default async function Page({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  if (!VALID.includes(region as PublishedPrivacyRegion)) notFound();
  return <LegalPrivacyRegionPage region={region as PublishedPrivacyRegion} />;
}
