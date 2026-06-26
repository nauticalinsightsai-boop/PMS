import { Suspense } from 'react';
import { HomeCmsEditor } from '@/components/pages/admin/HomeCmsEditor';

function HomeEditorFallback() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-orange" />
    </div>
  );
}

export default function HomeCmsPage() {
  return (
    <Suspense fallback={<HomeEditorFallback />}>
      <HomeCmsEditor />
    </Suspense>
  );
}
