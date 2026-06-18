import type { Metadata } from 'next';
import {
  PMS_FAVICON_DARK_PATH,
  PMS_FAVICON_PATH,
  PMS_OG_IMAGE_PATH,
  PMS_SITE_DESCRIPTION,
  PMS_SITE_NAME,
  PMS_SITE_URL,
} from '@/config/pms-site';
import { canonicalUrl } from '@/lib/canonical';
import { robotsForPath } from '@/lib/indexing-metadata';
import { T176_SEO, T176_SCHEMA } from '@/content/t176-claims';
import * as siteData from '@/data/siteData';

export { PMS_SITE_URL as SITE_URL };

export type BuildPageMetadataInput = {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  robots?: Metadata['robots'];
  noSuffix?: boolean;
};

function absoluteUrl(path: string): string {
  return canonicalUrl(path);
}

function ogImageUrl(imagePath: string): string {
  return imagePath.startsWith('http') ? imagePath : absoluteUrl(imagePath);
}

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const description = input.description ?? PMS_SITE_DESCRIPTION;
  const fullTitle = input.noSuffix ? input.title : `${input.title} | ${PMS_SITE_NAME}`;
  const canonical = absoluteUrl(input.path);
  const ogImage = ogImageUrl(input.ogImage ?? PMS_OG_IMAGE_PATH);
  const robots = input.robots ?? robotsForPath(input.path);

  return {
    title: fullTitle,
    description,
    alternates: { canonical },
    robots,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: PMS_SITE_NAME,
      type: 'website',
      images: [{ url: ogImage, alt: input.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function buildCertMetadata(certId: string): Metadata {
  const cert = siteData.certifications.find((c) => c.id === certId);
  if (!cert) {
    return buildPageMetadata({
      title: 'Certification pathway',
      path: `/certifications/${certId}`,
    });
  }
  const familyDescription =
    cert.familyId === 'PRINCE2'
      ? T176_SEO.prince2Description
      : cert.familyId === 'SixSigma'
        ? T176_SEO.lssDescription
        : cert.id === 'pmp'
          ? T176_SEO.pmpDescription
          : cert.desc ||
            `${T176_SCHEMA.courseDescription} ${cert.name} on ${PMS_SITE_NAME}.`;
  return buildPageMetadata({
    title: `${cert.name} exam preparation`,
    description: familyDescription,
    path: `/certifications/${certId}`,
    ogImage: PMS_OG_IMAGE_PATH,
  });
}

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(PMS_SITE_URL),
  title: {
    default: `${PMS_SITE_NAME}. Project readiness`,
    template: `%s | ${PMS_SITE_NAME}`,
  },
  description: PMS_SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: PMS_FAVICON_PATH, type: 'image/png' },
      { url: PMS_FAVICON_DARK_PATH, type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: PMS_FAVICON_PATH,
    shortcut: PMS_FAVICON_PATH,
  },
};