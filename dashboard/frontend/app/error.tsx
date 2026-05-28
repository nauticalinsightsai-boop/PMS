'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-shell-gradient px-6 text-center">
      <div className="cta-consultation w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-8">
        P
      </div>
      <h1 className="text-section text-3xl mb-2">Something went wrong</h1>
      <p className="text-muted-foreground text-sm max-w-md mb-8">
        An unexpected error occurred in the admin app. You can try again or return to the dashboard.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={reset}
          className="cta-consultation rounded-full px-6 py-2.5 text-sm font-semibold"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted"
        >
          Dashboard home
        </Link>
      </div>
    </div>
  );
}
