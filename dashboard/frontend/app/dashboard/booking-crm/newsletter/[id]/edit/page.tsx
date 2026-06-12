import { redirect } from 'next/navigation';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';

export default async function LegacyEditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(WEBSITE_CMS_PATHS.newsletterEdit(id));
}
