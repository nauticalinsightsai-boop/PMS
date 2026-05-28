'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookingsOrders } from '@/components/pages/admin/BookingsOrders';

export default function BookingsPage() {
  return (
    <DashboardLayout>
      <BookingsOrders />
    </DashboardLayout>
  );
}
