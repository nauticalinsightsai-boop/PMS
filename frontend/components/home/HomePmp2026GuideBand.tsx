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

export function HomePmp2026GuideBand() {
  return (
    <section className="relative z-10 pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-16 md:pb-16" aria-labelledby="home-pmp-2026-guide-heading">
      <div className="container mx-auto">
        <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-700/60 bg-slate-900 px-5 py-6 shadow-xl shadow-slate-900/20 sm:rounded-3xl sm:px-8 sm:py-8 dark:border-slate-700/50 dark:bg-[#0c1224] dark:shadow-black/30">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:text-left">
            <div className="min-w-0 max-w-xl">
              <h2
                id="home-pmp-2026-guide-heading"
                className="font-heading text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl md:text-[1.75rem]"
              >
                PMP exam 2026: what&apos;s changing?
              </h2>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400 sm:mt-3 sm:text-base">
                Independent guides for the 2026 transition, study plans, and domain focus areas.
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
                      : 'border border-slate-600/80 bg-slate-900/40 text-slate-100 hover:border-slate-500 hover:bg-slate-800/60',
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
