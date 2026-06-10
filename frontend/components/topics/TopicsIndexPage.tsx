import Link from 'next/link';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { TOPIC_HUBS } from '@/content/topics/hubs';
import { cn } from '@/lib/utils';

export function TopicsIndexPage() {
  return (
    <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
      <SectionAmbience tone="purple" />
      <div className="container max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Knowledge hubs — PMP &amp; project management
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            Topic hubs connect guides, answers, pathways, and FAQs for structured discovery and AI
            citation.
          </p>

          <ul className="space-y-4">
            {TOPIC_HUBS.map((hub) => (
              <li key={hub.slug}>
                <Link
                  href={hub.path}
                  className="block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-colors"
                >
                  <h2 className="font-semibold text-slate-900 dark:text-white mb-2">{hub.h1}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{hub.description}</p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-slate-500">
            <Link href="/pmp" className="text-brand-purple hover:underline">
              PMP hub
            </Link>
            {' · '}
            <Link href="/answers" className="text-brand-purple hover:underline">
              Direct answers
            </Link>
          </p>
      </div>
    </section>
  );
}
