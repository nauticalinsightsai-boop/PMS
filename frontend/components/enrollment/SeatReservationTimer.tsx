'use client';

import * as React from 'react';
import {
  SEAT_RESERVATION_HOLD_MS,
  seatHoldStorageKey,
} from '@/lib/enrollment/seat-reservation';

type Props = {
  offeringId: string;
  className?: string;
};

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function SeatReservationTimer({ offeringId, className = '' }: Props) {
  const [remainingMs, setRemainingMs] = React.useState(SEAT_RESERVATION_HOLD_MS);

  React.useEffect(() => {
    const key = seatHoldStorageKey(offeringId);
    const now = Date.now();
    let deadline = Number(sessionStorage.getItem(key));
    if (!deadline || Number.isNaN(deadline) || deadline <= now) {
      deadline = now + SEAT_RESERVATION_HOLD_MS;
      sessionStorage.setItem(key, String(deadline));
    }

    const tick = () => setRemainingMs(Math.max(0, deadline - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [offeringId]);

  const expired = remainingMs <= 0;

  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/30 ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <p className="font-semibold text-amber-900 dark:text-amber-100">
        {expired ? 'Seat hold expired' : 'Limited seats · hold your spot'}
      </p>
      <p className="mt-1 text-amber-800/90 dark:text-amber-200/90 leading-snug">
        {expired
          ? 'Refresh the page to start a new hold, then complete your deposit payment below.'
          : `Complete your deposit within ${formatRemaining(remainingMs)} to reserve your seat.`}
      </p>
    </div>
  );
}
