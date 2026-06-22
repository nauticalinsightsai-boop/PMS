import Link from 'next/link';
import { PMP_EXAM_2026_LIVE_BANNER } from '@/content/pmp/flagship-t169';

export function PmpExam2026LiveBanner({ className = '' }: { className?: string }) {
  return (
    <div
      role="status"
      className={`border-b border-brand-orange/25 bg-gradient-to-r from-brand-orange/10 via-amber-50/80 to-brand-orange/10 px-4 py-3 text-center text-sm font-medium leading-relaxed text-slate-800 dark:from-brand-orange/15 dark:via-slate-900 dark:to-brand-orange/10 dark:text-slate-200 ${className}`}
    >
      <p className="mx-auto max-w-4xl">
        {PMP_EXAM_2026_LIVE_BANNER.message}{' '}
        <Link
          href={PMP_EXAM_2026_LIVE_BANNER.ctaHref}
          className="font-bold text-brand-orange hover:underline"
        >
          {PMP_EXAM_2026_LIVE_BANNER.ctaLabel} →
        </Link>
      </p>
    </div>
  );
}
