import { redirect } from 'next/navigation';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';

export default function LegacyNewsletterSubscribersPage() {
  redirect(WEBSITE_CMS_PATHS.newsletterSubscribers);
}
