import PageSkeleton from '@/components/shared/PageSkeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-shell-gradient p-4 md:p-8">
      <PageSkeleton />
    </div>
  );
}
