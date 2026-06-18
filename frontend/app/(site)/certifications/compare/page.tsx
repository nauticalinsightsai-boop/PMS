import { Suspense } from 'react';
import { Compare } from '@/components/pages/Compare';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

export const metadata = buildPhase2PageMetadata('/certifications/compare')!;

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <Compare />
    </Suspense>
  );
}
