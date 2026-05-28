'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, HelpCircle, Mail } from 'lucide-react';
import { useWebsiteData } from '@/services/WebsiteDataService';
import { CTAS } from '@/lib/brand-voice';
import { PMS_SUPPORT_EMAIL } from '@/config/pms-site';
import { RegisterModal } from '@/components/RegisterModal';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PricingComplianceNote } from '@/components/PricingComplianceNote';
import {
  FAQ_CLUSTERS,
  FAQ_HUB_SECTIONS,
  getAllFaqs,
  getFaqsByCluster,
} from '@/content/faq';
import type { FaqClusterId, FaqEntry } from '@/content/faq';

const DEFAULT_TAB = FAQ_HUB_SECTIONS[0]?.id ?? 'about-pathways';

export function FAQ() {
  const { get } = useWebsiteData();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = React.useState(
    FAQ_HUB_SECTIONS.some((s) => s.id === tabFromUrl) ? tabFromUrl! : DEFAULT_TAB,
  );
  const [query, setQuery] = React.useState('');
  const q = query.trim().toLowerCase();
  const isSearching = q.length > 0;

  React.useEffect(() => {
    if (tabFromUrl && FAQ_HUB_SECTIONS.some((s) => s.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.location.hash.startsWith('#faq-')) return;
    const clusterId = window.location.hash.replace('#faq-', '') as FaqClusterId;
    const section = FAQ_HUB_SECTIONS.find((s) => s.clusterIds.includes(clusterId));
    if (section) setActiveTab(section.id);
  }, []);

  const searchResults = React.useMemo(() => {
    if (!isSearching) return [] as FaqEntry[];
    return getAllFaqs().filter(
      (f) =>
        f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
    );
  }, [isSearching, q]);

  return (
    <div className="flex flex-col min-h-screen">
      <section
        className={sectionSurface(
          'cool',
          'py-16 md:py-24 border-b border-sandstone/60 dark:border-slate-800',
        )}
      >
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-3 rounded-2xl bg-brand-purple/10 text-brand-purple mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {get('faq_title', 'Frequently Asked Questions')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
              {get(
                'faq_subtitle',
                'Certification pathways, regional pricing, membership, delivery, and policies.',
              )}
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                className="pl-10 h-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search FAQ"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-20')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto max-w-3xl">
          {isSearching ? (
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                Search results ({searchResults.length})
              </h2>
              {searchResults.length === 0 ? (
                <p className="text-center text-slate-500">No matching questions. Try another term.</p>
              ) : (
                <FaqAccordionList items={searchResults} />
              )}
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList
                variant="line"
                className="w-full flex flex-wrap h-auto gap-1 mb-10 justify-center"
                aria-label="FAQ categories"
              >
                {FAQ_HUB_SECTIONS.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="text-xs sm:text-sm px-3 py-2"
                  >
                    {section.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {FAQ_HUB_SECTIONS.map((section) => (
                <TabsContent key={section.id} value={section.id} className="mt-0 outline-none">
                  <div className="space-y-14">
                    {section.clusterIds.map((clusterId) => {
                      const cluster = FAQ_CLUSTERS.find((c) => c.id === clusterId);
                      if (!cluster) return null;
                      const items = getFaqsByCluster(clusterId);
                      if (items.length === 0) return null;
                      return (
                        <section key={clusterId} id={`faq-${clusterId}`} className="scroll-mt-24">
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                            {cluster.title}
                          </h2>
                          <FaqAccordionList items={items} />
                        </section>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}

          <div className="mt-12 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="text-lg font-bold mb-4">Regional pricing policy</h2>
            <PricingComplianceNote />
          </div>
        </div>
      </section>

      <section className={sectionSurface('warm', 'py-20')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            Email{' '}
            <a
              href={`mailto:${PMS_SUPPORT_EMAIL}`}
              className="text-brand-orange font-bold hover:underline"
            >
              {PMS_SUPPORT_EMAIL}
            </a>{' '}
            for billing, access, privacy, and policy questions. Browse our{' '}
            <Link href="/legal" className="text-brand-orange font-bold hover:underline">
              legal hub
            </Link>{' '}
            for full terms.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`mailto:${PMS_SUPPORT_EMAIL}`}>
              <Button variant="brand" className="gap-2">
                <Mail className="h-4 w-4" />
                Email support
              </Button>
            </a>
            <RegisterModal
              trigger={<Button variant="brand">{CTAS.navConsultation}</Button>}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FaqAccordionList({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion
      {...({ type: 'single', collapsible: true } as React.ComponentProps<typeof Accordion>)}
      className="w-full space-y-4"
    >
      {items.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={faq.id}
          id={faq.id}
          className="bg-white dark:bg-slate-900 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm scroll-mt-24"
        >
          <AccordionTrigger className="text-left font-bold min-h-11 py-6 hover:text-brand-purple hover:no-underline">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-slate-600 dark:text-slate-400 pb-6 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <FaqAnswer text={faq.answer} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/** Parses lead paragraph, bullet lines (•), and [text](url) links. */
function FaqAnswer({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/);
  return (
    <div className="space-y-3">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.length > 0);
        const bullets = lines.filter((l) => l.trimStart().startsWith('•'));
        const nonBullets = lines.filter((l) => !l.trimStart().startsWith('•'));
        return (
          <div key={bi}>
            {nonBullets.map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-2' : undefined}>
                <FaqInline text={line} />
              </p>
            ))}
            {bullets.length > 0 ? (
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {bullets.map((line, i) => (
                  <li key={i}>
                    <FaqInline text={line.replace(/^•\s*/, '')} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function FaqInline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (m) {
          const href = m[2];
          const internal = href.startsWith('/');
          return internal ? (
            <Link key={i} href={href} className="text-brand-orange font-bold hover:underline">
              {m[1]}
            </Link>
          ) : (
            <a key={i} href={href} className="text-brand-orange font-bold hover:underline">
              {m[1]}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
