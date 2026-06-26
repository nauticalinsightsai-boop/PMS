import type { Metadata } from 'next';
import { buildPageMetadata, type BuildPageMetadataInput } from '@/lib/site-metadata';
import { fetchPublishedGlobalContent } from '@/lib/cms/fetch-published-document';

/**
 * Build page metadata, overlaying CMS SEO overrides from global_content
 * (`<slug>_meta_title`, `<slug>_meta_desc`) managed in the dashboard SEO Control page.
 * Falls back to the static defaults when no override is published.
 */
export async function buildPageMetadataWithCms(
  slug: string,
  input: BuildPageMetadataInput,
): Promise<Metadata> {
  const globalContent = await fetchPublishedGlobalContent();
  const cmsTitle = globalContent[`${slug}_meta_title`]?.trim();
  const cmsDescription = globalContent[`${slug}_meta_desc`]?.trim();

  return buildPageMetadata({
    ...input,
    title: cmsTitle || input.title,
    description: cmsDescription || input.description,
  });
}
