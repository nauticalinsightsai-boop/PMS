import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMP_INDEPENDENT_DISCLAIMER } from '@/content/pmp/disclaimer';
import type { TopicHubContent } from '@/content/topics/types';
import { TopicHubJsonLd } from '@/components/seo/TopicHubJsonLd';
import { cn } from '@/lib/utils';

export function TopicHubPage({ hub }: { hub: TopicHubContent }) {
  return (
    <>
      <TopicHubJsonLd hub={hub} />
      <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="purple" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
            <nav className="text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-purple">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/topics" className="hover:text-brand-purple">
                Topics
              </Link>
              <span className="mx-2">/</span>
              <span className="text-slate-700 dark:text-slate-300">{hub.h1}</span>
            </nav>

            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-10">
              {hub.h1}
            </h1>

            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-3">What is this topic?</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hub.whatIs}</p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-3">Why it matters for PMP prep</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hub.whyMatters}</p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-3">PM Structure viewpoint</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{hub.viewpoint}</p>
            </section>

            <section className="mb-10">
              <h2 className="font-heading text-xl font-bold mb-4">Guides &amp; pathways</h2>
              <ul className="space-y-2">
                {hub.resources.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="text-brand-purple hover:underline font-medium">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {hub.relatedAnswers.length ? (
              <section className="mb-10">
                <h2 className="font-heading text-xl font-bold mb-4">Related answers</h2>
                <ul className="space-y-2">
                  {hub.relatedAnswers.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="text-brand-purple hover:underline font-medium">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href={hub.ctaHref} className={buttonVariants({ size: 'lg' })}>
                {hub.ctaLabel}
              </Link>
              <Link href="/answers" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
                Direct answers
              </Link>
            </div>

            <p className="text-sm text-slate-500 border-t pt-6">{PMP_INDEPENDENT_DISCLAIMER}</p>
        </div>
      </section>
    </>
  );
}
