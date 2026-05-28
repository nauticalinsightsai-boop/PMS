import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-shell-gradient px-6 text-center">
      <div className="cta-consultation w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-8">
        P
      </div>
      <h1 className="text-section text-4xl mb-2">Page not found</h1>
      <p className="text-muted-foreground text-sm max-w-md mb-8">
        This admin URL does not exist or has moved. Use the dashboard menu or return home.
      </p>
      <Link
        href="/dashboard"
        className="cta-consultation inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
