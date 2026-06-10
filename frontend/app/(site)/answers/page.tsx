import type { Metadata } from 'next';
import { AnswersIndexPage } from '@/components/answers/AnswersIndexPage';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = buildPageMetadata({
  title: 'Direct answers — PMP exam preparation',
  description:
    'Direct-question answers on PMP 2026 changes, readiness, domains, pathways, pricing, and LMS access on PM Structure.',
  path: '/answers',
});

export default function Page() {
  return <AnswersIndexPage />;
}
