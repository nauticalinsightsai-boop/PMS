import { Suspense } from 'react';
import { Compare } from '@/components/pages/Compare';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <Compare />
    </Suspense>
  );
}
