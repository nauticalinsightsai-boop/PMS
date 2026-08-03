'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { trackGaEvent } from '@/lib/analytics/send-ga-event';
import { stableAnalyticsEventId } from '@/lib/analytics/event-id';
import { consumeBookingConfirmation } from '@/lib/analytics/booking-confirmation';

/**
 * Calendly thank-you / redirect target.
 * Fires the canonical confirmed-booking conversion once per invitee (refresh-safe).
 */
export default function BookingConfirmedClient() {
  const searchParams = useSearchParams();
  const ran = useRef(false);

  const inviteeUuid =
    searchParams.get('invitee_uuid') ||
    searchParams.get('invitee_uri')?.split('/').pop() ||
    searchParams.get('event_uuid') ||
    '';
  const bookingToken = searchParams.get('booking_token') || '';

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    let confirmation: ReturnType<typeof consumeBookingConfirmation>;
    try {
      confirmation = consumeBookingConfirmation(inviteeUuid, bookingToken, sessionStorage);
    } catch {
      return;
    }
    if (confirmation !== 'track') return;

    const eventId = stableAnalyticsEventId('booking', inviteeUuid);
    trackGaEvent('booking_confirmed', {
      booking_status: 'confirmed',
      content_type: 'calendly',
      event_id: eventId,
    });
  }, [bookingToken, inviteeUuid]);

  return (
    <div className="container mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Booking confirmed
      </h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Thanks - your mentor session is scheduled. Check your email for the calendar invite and
        joining details.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
