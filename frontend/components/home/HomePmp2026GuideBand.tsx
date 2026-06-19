import Link from 'next/link';
import { cn } from '@/lib/utils';

const GUIDE_LINKS: { href: string; label: string; primary?: boolean }[] = [
  { href: '/pmp-exam-2026', label: 'PMP 2026 guide', primary: true },
  { href: '/pmp', label: 'PMP hub' },
  { href: '/answers', label: 'Direct answers' },
  { href: '/topics', label: 'Topic hubs' },
];

const pillBase =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors';

const GUIDE_BAND_SHELL =
  'mx-auto w-full max-w-7xl rounded-2xl border px-5 py-6 sm:rounded-3xl sm:px-8 sm:py-8 ' +
  'border-slate-200 bg-white shadow-lg shadow-slate-900/5 ' +
  'dark:border-slate-700/50 dark:bg-[#0c1224] dark:shadow-xl dark:shadow-black/30';

const GUIDE_BAND_PILL_SECONDARY =
  'border border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 hover:bg-slate-100 ' +
  'dark:border-slate-600/80 dark:bg-slate-900/40 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-800/60';

export function HomePmp2026GuideBand() {
  return (
    <section className="relative z-10 pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-16 md:pb-16" aria-labelledby="home-pmp-2026-guide-heading">
      <div className="container mx-auto">
        <div className={GUIDE_BAND_SHELL}>
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:text-left">
            <div className="min-w-0 lg:flex-1">
              <h2
                id="home-pmp-2026-guide-heading"
                className="font-heading text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-2xl md:text-[1.75rem] lg:whitespace-nowrap"
              >
                PMP exam 2026: what&apos;s changing?
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400 sm:mt-3 sm:text-base">
                Guides for the 2026 transition, study plans, and domain focus areas.
              </p>
            </div>
            <nav
              className="flex flex-wrap justify-center gap-2 sm:gap-2.5 lg:shrink-0 lg:justify-end"
              aria-label="PMP 2026 guides"
            >
              {GUIDE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    pillBase,
                    link.primary
                      ? 'bg-brand-purple text-white hover:bg-brand-purple/90'
                      : GUIDE_BAND_PILL_SECONDARY,
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
