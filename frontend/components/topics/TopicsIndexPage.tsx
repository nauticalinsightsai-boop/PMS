import Link from 'next/link';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { TOPIC_HUB_GROUPS, getTopicHubsForGroup } from '@/content/topics';
import { TopicsIndexJsonLd } from '@/components/seo/TopicsIndexJsonLd';
import { cn } from '@/lib/utils';

export function TopicsIndexPage() {
  return (
    <>
      <TopicsIndexJsonLd />
      <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="purple" />
        <div className="container max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Project Management Topics
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            Knowledge hubs connect PMP guides, direct answers, pathways, and FAQs for structured
            discovery and AI citation.
          </p>

          <div className="space-y-12">
            {TOPIC_HUB_GROUPS.map((group) => {
              const hubs = getTopicHubsForGroup(group.slugs);
              if (!hubs.length) return null;
              return (
                <section key={group.h2}>
                  <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-4">
                    {group.h2}
                  </h2>
                  <ul className="space-y-3">
                    {hubs.map((hub) => (
                      <li key={hub.slug}>
                        <Link
                          href={hub.path}
                          className="block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-colors"
                        >
                          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {hub.h1}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {hub.description}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>

          <p className="mt-10 text-sm text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/pmp" className="text-brand-purple hover:underline">
              PMP hub
            </Link>
            <Link href="/pmp-faq" className="text-brand-purple hover:underline">
              PMP FAQs
            </Link>
            <Link href="/answers" className="text-brand-purple hover:underline">
              Direct answers
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
