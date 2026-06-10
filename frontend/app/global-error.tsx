'use client';

/** Root error boundary — required for Next.js 15 production 500.html generation. */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '32rem' }}>
          <h1>Something went wrong</h1>
          <p>We could not load this page. Please try again.</p>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
