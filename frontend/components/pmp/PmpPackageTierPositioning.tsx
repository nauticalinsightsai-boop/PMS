import Link from 'next/link';
import { PMP_PACKAGE_TIER_POSITIONING } from '@/content/pmp/program-offer';
import { sectionSurface } from '@/components/SectionAmbience';
import { cn } from '@/lib/utils';

const SECTION_PY = 'py-16 sm:py-20 md:py-24';

export function PmpPackageTierPositioning({ className }: { className?: string }) {
  return (
    <section
      id="pmp-tier-pathways"
      className={cn(sectionSurface('soft', SECTION_PY), className)}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading text-section font-bold mb-6 tracking-tight leading-none text-slate-900 dark:text-white">
          The <span className="text-brand-orange">Certification</span> Journey
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Choose the tier that matches your current experience and career goals. Each step is designed
          for maximum impact.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {(['foundation', 'professional', 'mastery'] as const).map((tierKey) => {
            const tier = PMP_PACKAGE_TIER_POSITIONING[tierKey];
            return (
              <div
                key={tierKey}
                className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-6"
              >
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{tier.title}</h3>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  {tier.positioning}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {PMP_PACKAGE_TIER_POSITIONING.fallback}{' '}
          <Link href="/faq" className="font-bold text-brand-orange hover:underline">
            Compare tiers in FAQ
          </Link>
        </p>
      </div>
    </section>
  );
}
