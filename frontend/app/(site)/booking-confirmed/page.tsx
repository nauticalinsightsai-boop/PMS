import type { Metadata } from 'next';
import { Suspense } from 'react';
import BookingConfirmedClient from './BookingConfirmedClient';

export const metadata: Metadata = {
  title: 'Booking confirmed',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BookingConfirmedClient />
    </Suspense>
  );
}
