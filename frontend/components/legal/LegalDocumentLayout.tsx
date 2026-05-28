'use client';

import Link from 'next/link';
import type { LegalDocument } from '@/content/legal/types';
import { LegalSectionList } from './LegalSectionList';
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { cn } from '@/lib/utils';
import { LegalRelatedLinks } from './LegalRelatedLinks';

export function LegalDocumentLayout({
  document,
  backHref = '/legal',
  backLabel = 'All policies',
  headerExtra,
  children,
}: {
  document: LegalDocument;
  backHref?: string;
  backLabel?: string;
  headerExtra?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const tocSections = document.sections.filter(
    (s) => !s.id.endsWith('-divider') && s.heading.length > 0,
  );

  return (
    <article className="flex flex-col min-h-screen">
      <section
        className={cn(
          sectionSurface('cool', 'border-b border-sandstone/60 dark:border-slate-800'),
          PAGE_HERO_PADDING,
        )}
      >
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <Link
            href={backHref}
            className="text-sm font-bold text-brand-orange hover:text-brand-hover mb-6 inline-block"
          >
            ← {backLabel}
          </Link>
          <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            {document.title}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2">
            Last updated: {document.lastUpdated}
          </p>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
            {document.jurisdictionNote}
          </p>
          {headerExtra ? <div className="mt-8">{headerExtra}</div> : null}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {tocSections.length > 3 && (
              <nav
                aria-label="Table of contents"
                className="lg:w-56 shrink-0 lg:sticky lg:top-24 lg:self-start"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  On this page
                </p>
                <ul className="space-y-2 text-sm font-medium">
                  {tocSections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors line-clamp-2"
                      >
                        {s.heading.replace(/^\d+\.\s*/, '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="flex-1 min-w-0 max-w-3xl">
              <LegalSectionList sections={document.sections} />
              {children}
              <LegalRelatedLinks />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
