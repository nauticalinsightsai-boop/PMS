import type { Metadata } from 'next';
import {
  PMS_OG_IMAGE_PATH,
  PMS_SITE_DESCRIPTION,
  PMS_SITE_NAME,
  PMS_SITE_URL,
} from '@/config/pms-site';
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
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${PMS_SITE_URL}${p}`;
}

function ogImageUrl(imagePath: string): string {
  return imagePath.startsWith('http') ? imagePath : absoluteUrl(imagePath);
}

export function buildPageMetadata(input: BuildPageMetadataInput): Metadata {
  const description = input.description ?? PMS_SITE_DESCRIPTION;
  const fullTitle = input.noSuffix ? input.title : `${input.title} | ${PMS_SITE_NAME}`;
  const canonical = absoluteUrl(input.path);
  const ogImage = ogImageUrl(input.ogImage ?? PMS_OG_IMAGE_PATH);

  return {
    title: fullTitle,
    description,
    alternates: { canonical },
    robots: input.robots,
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
  return buildPageMetadata({
    title: `${cert.name} exam preparation`,
    description:
      cert.desc ||
      `Structured ${cert.name} readiness pathway with Foundation, Professional, and Mastery tiers on ${PMS_SITE_NAME}.`,
    path: `/certifications/${certId}`,
    ogImage: PMS_OG_IMAGE_PATH,
  });
}

export const defaultSiteMetadata: Metadata = {
  metadataBase: new URL(PMS_SITE_URL),
  title: {
    default: `${PMS_SITE_NAME} — Project readiness`,
    template: `%s | ${PMS_SITE_NAME}`,
  },
  description: PMS_SITE_DESCRIPTION,
};
