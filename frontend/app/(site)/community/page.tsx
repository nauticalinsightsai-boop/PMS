import { Suspense } from 'react';
import { Community } from '@/components/pages/Community';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white dark:bg-slate-950" />}>
      <Community />
    </Suspense>
  );
}
