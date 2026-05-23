'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GCC_COUNTRY_SLUGS,
  PRIVACY_REGION_OPTIONS,
  type GccCountryLegalSlug,
  type LegalRegionSlug,
} from '@/content/legal';
import { cn } from '@/lib/utils';

const GCC_LABELS: Record<GccCountryLegalSlug, string> = {
  ae: 'UAE',
  sa: 'Saudi Arabia',
  qa: 'Qatar',
  bh: 'Bahrain',
  kw: 'Kuwait',
  om: 'Oman',
};

function activeRegionFromPath(pathname: string): LegalRegionSlug {
  if (pathname === '/legal/privacy') return 'global';
  const match = pathname.match(/^\/legal\/privacy\/([^/]+)/);
  if (!match) return 'global';
  const slug = match[1] as LegalRegionSlug;
  if (slug === 'gcc') return 'gcc';
  return PRIVACY_REGION_OPTIONS.some((o) => o.slug === slug) ? slug : 'global';
}

export function LegalRegionSwitcher() {
  const pathname = usePathname();
  const activeRegion = activeRegionFromPath(pathname);
  const showGccCountries =
    activeRegion === 'gcc' || pathname.startsWith('/legal/privacy/gcc/');

  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        role="tablist"
        aria-label="Privacy policy region"
      >
        {PRIVACY_REGION_OPTIONS.map(({ slug, label, href }) => {
          const active =
            slug === activeRegion ||
            (slug === 'gcc' && pathname.startsWith('/legal/privacy/gcc/'));
          return (
            <Link
              key={slug}
              href={href}
              role="tab"
              aria-selected={active}
              className={cn(
                'min-h-10 px-4 py-2 rounded-xl text-sm font-bold transition-all',
                active
                  ? 'bg-brand-orange text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-brand-orange',
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
      {showGccCountries && (
        <div className="flex flex-wrap gap-2" aria-label="GCC country supplements">
          <Link
            href="/legal/privacy/gcc"
            className={cn(
              'text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors',
              pathname === '/legal/privacy/gcc'
                ? 'border-brand-orange text-brand-orange bg-brand-orange/10'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-brand-orange',
            )}
          >
            GCC overview
          </Link>
          {GCC_COUNTRY_SLUGS.map((c) => (
            <Link
              key={c}
              href={`/legal/privacy/gcc/${c}`}
              className={cn(
                'text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors',
                pathname === `/legal/privacy/gcc/${c}`
                  ? 'border-brand-orange text-brand-orange bg-brand-orange/10'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-brand-orange',
              )}
            >
              {GCC_LABELS[c]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
