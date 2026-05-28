import { Contact } from '@/components/pages/Contact';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Contact & consultation',
  description: 'Book a pathway consultation or contact PM Structure support.',
  path: '/contact',
});

export default function Page() {
  return <Contact />;
}
