'use client';

import Link from 'next/link';
import { legalHubCards } from '@/content/legal';
import { PAGE_HERO_PADDING, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { ArrowRight } from 'lucide-react';
import { BRAND } from '@/lib/brand-voice';

export function LegalHub() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className={sectionSurface('cool', 'border-b border-sandstone/60 dark:border-slate-800')}
      >
        <SectionAmbience tone="cool" />
        <div className={`container relative z-10 mx-auto ${PAGE_HERO_PADDING}`}>
          <h1 className="font-heading text-hero font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Legal &amp; compliance
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-medium leading-relaxed">
            Policies governing use of {BRAND.name}, your data, cookies, services, and pricing
            disclosures.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {legalHubCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md hover:border-brand-orange/40 transition-all"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-orange transition-colors">
                {card.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium flex-1">
                {card.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-orange">
                Read policy
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
