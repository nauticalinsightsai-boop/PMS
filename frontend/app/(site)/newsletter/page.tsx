import { Newsletter } from '@/components/pages/Newsletter';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Newsletter & insights',
  description: 'Exam prep tips, agile, and project management insights from PM Structure.',
  path: '/newsletter',
});

export default function Page() {
  return <Newsletter />;
}
