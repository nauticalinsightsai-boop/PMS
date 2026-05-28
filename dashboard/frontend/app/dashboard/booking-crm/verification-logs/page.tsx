'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { VerificationLogs } from '@/components/pages/admin/VerificationLogs';

export default function VerificationLogsPage() {
  return (
    <DashboardLayout>
      <VerificationLogs />
    </DashboardLayout>
  );
}
