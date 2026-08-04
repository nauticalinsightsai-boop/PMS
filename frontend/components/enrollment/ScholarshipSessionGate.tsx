'use client';

import * as React from 'react';
import {
  evaluateScholarshipSession,
  parseScholarshipSessionRecord,
  scholarshipStorageKey,
  startScholarshipSession,
  type ScholarshipSessionState,
} from '@/lib/enrollment/scholarship-offer';

type Props = {
  offeringId: string;
  children: (ctx: {
    checkoutAllowed: boolean;
    status: ScholarshipSessionState['status'];
  }) => React.ReactNode;
  className?: string;
};

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function readState(offeringId: string, now = Date.now()): ScholarshipSessionState {
  if (typeof window === 'undefined') return { status: 'ready' };
  const key = scholarshipStorageKey(offeringId);
  const existing = parseScholarshipSessionRecord(window.localStorage.getItem(key));
  const evaluated = evaluateScholarshipSession(existing, now);
  if (evaluated.status === 'ready') {
    const next = startScholarshipSession(now);
    window.localStorage.setItem(key, JSON.stringify(next));
    return evaluateScholarshipSession(next, now);
  }
  return evaluated;
}

export function ScholarshipSessionGate({ offeringId, children, className = '' }: Props) {
  const [state, setState] = React.useState<ScholarshipSessionState>({ status: 'ready' });
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setState(readState(offeringId));
    setHydrated(true);
    const id = window.setInterval(() => {
      setState(readState(offeringId));
    }, 1000);
    return () => window.clearInterval(id);
  }, [offeringId]);

  if (!hydrated) {
    return (
      <div className={className}>
        <div
          className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/30"
          role="status"
        >
          <p className="font-semibold text-amber-900 dark:text-amber-100">Preparing scholarship session…</p>
        </div>
      </div>
    );
  }

  const checkoutAllowed = state.status === 'active';

  return (
    <div className={`space-y-4 ${className}`.trim()}>
      <div
        className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/30"
        role="status"
        aria-live="polite"
      >
        {state.status === 'active' ? (
          <>
            <p className="font-semibold text-amber-900 dark:text-amber-100">
              Scholarship session active · {formatRemaining(state.remainingMs)}
            </p>
            <p className="mt-1 text-amber-800/90 dark:text-amber-200/90 leading-snug">
              Complete mentor-led checkout within the timer. Refreshing keeps this same 15-minute hold.
            </p>
          </>
        ) : state.status === 'cooldown' ? (
          <>
            <p className="font-semibold text-amber-900 dark:text-amber-100">Scholarship session ended</p>
            <p className="mt-1 text-amber-800/90 dark:text-amber-200/90 leading-snug">
              You can start a new scholarship session in {formatRemaining(state.remainingMs)} on this
              browser.
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold text-amber-900 dark:text-amber-100">Scholarship session ready</p>
            <p className="mt-1 text-amber-800/90 dark:text-amber-200/90 leading-snug">
              Starting a 15-minute checkout hold…
            </p>
          </>
        )}
      </div>
      {children({ checkoutAllowed, status: state.status })}
    </div>
  );
}
