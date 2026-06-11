import Link from 'next/link';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { ANSWER_PAGES } from '@/content/answers/pages';
import { cn } from '@/lib/utils';

export function AnswersIndexPage() {
  return (
    <section className={cn(sectionSurface('cool', 'py-16 sm:py-20'))}>
      <SectionAmbience tone="cool" />
      <div className="container max-w-3xl mx-auto px-4 relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Direct answers. PMP &amp; pathways
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
            Concise answers for search and AI citation. Each page links to deeper guides, pathways, and
            FAQs on PM Structure.
          </p>

          <ul className="space-y-4">
            {ANSWER_PAGES.map((page) => (
              <li key={page.slug}>
                <Link
                  href={page.path}
                  className="block rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-colors"
                >
                  <h2 className="font-semibold text-slate-900 dark:text-white mb-2">{page.question}</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{page.shortAnswer}</p>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-slate-500">
            More context: <Link href="/pmp" className="text-brand-purple hover:underline">PMP hub</Link>
            {' · '}
            <Link href="/faq?tab=pmp-2026" className="text-brand-purple hover:underline">PMP FAQs</Link>
          </p>
      </div>
    </section>
  );
}