'use client';

import dynamic from 'next/dynamic';

const Providers = dynamic(
  () => import('@/components/Providers').then((m) => ({ default: m.Providers })),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0D]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    ),
  },
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
