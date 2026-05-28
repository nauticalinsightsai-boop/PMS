import { Suspense } from 'react';
import { Compare } from '@/components/pages/Compare';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Compare certifications',
  description: 'Compare PMP, CAPM, PRINCE2, and other pathways by price, audience, and format.',
  path: '/certifications/compare',
});

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <Compare />
    </Suspense>
  );
}
