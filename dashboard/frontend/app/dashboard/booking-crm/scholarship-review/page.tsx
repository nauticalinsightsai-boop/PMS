'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ScholarshipReviewQueue } from '@/components/pages/admin/ScholarshipReviewQueue';

export default function ScholarshipReviewQueuePage() {
  return (
    <DashboardLayout>
      <ScholarshipReviewQueue />
      <p className="mt-4 text-sm text-muted-foreground max-w-xl">
        Matrix spreadsheet editor is Phase 2 (deferred).
      </p>
    </DashboardLayout>
  );
}
