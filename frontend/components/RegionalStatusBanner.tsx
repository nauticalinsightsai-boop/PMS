'use client';

import { AlertCircle } from 'lucide-react';
import { REGION_COPY } from '@/lib/brand-voice';
import type { OfferingStatus } from '@/types/regional-catalogue';

interface RegionalStatusBannerProps {
  status: OfferingStatus;
  message?: string | null;
}

export function RegionalStatusBanner({ status, message }: RegionalStatusBannerProps) {
  if (status === 'hidden') return null;

  const text =
    message ??
    (status === 'scholarship_unavailable' ? REGION_COPY.masteryUnavailable : null);

  if (!text && status !== 'scholarship_verify') return null;

  return (
    <div className="mb-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-center text-sm text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
      <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <p className="font-medium leading-relaxed">{text}</p>
    </div>
  );
}
