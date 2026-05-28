'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ConsultationQueue } from '@/components/pages/admin/ConsultationQueue';

export default function ConsultationsPage() {
  return (
    <DashboardLayout>
      <ConsultationQueue />
    </DashboardLayout>
  );
}
