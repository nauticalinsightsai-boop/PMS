'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, HelpCircle, Mail, MessageCircle } from 'lucide-react';
import { globalContentString, type GlobalContentMap } from '@/lib/cms/global-content';
import { CTAS } from '@/lib/brand-voice';
import { PMS_SUPPORT_EMAIL, getPmsWhatsAppDisplay, getPmsWhatsAppUrl, isWhatsAppConfigured } from '@/config/pms-site';
import { WebsiteCalendlyButton } from '@/components/calendly/WebsiteCalendlyButton';
import { TrackedContactLink } from '@/components/analytics/TrackedContactLink';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PricingComplianceNote } from '@/components/PricingComplianceNote';
import {
  FAQ_CLUSTERS,
  FAQ_HUB_SECTIONS,
  getAllFaqs,
  getFaqsByCluster,
} from '@/content/faq';
import type { FaqClusterId, FaqEntry } from '@/content/faq';
import { FaqAccordionList } from '@/components/faq/FaqAccordionList';
import { PageHeroWithImage } from '@/components/marketing/PageMarketingImage';
import { MARKETING_PAGE_IMAGES } from '@/lib/marketing-stock-images';

const DEFAULT_TAB = FAQ_HUB_SECTIONS[0]?.id ?? 'about-pathways';

export function FAQ({ globalContent }: { globalContent?: GlobalContentMap }) {
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
          <PageHeroWithImage image={MARKETING_PAGE_IMAGES.faq}>
            <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-flex p-3 rounded-2xl bg-brand-purple/10 text-brand-purple mb-6">
                <HelpCircle className="h-8 w-8" />
              </div>
              {globalContentString(globalContent, 'faq_badge', '') ? (
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-purple mb-4">
                  {globalContentString(globalContent, 'faq_badge', '')}
                </p>
              ) : null}
              <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-6">
                {globalContentString(globalContent, 'faq_title', 'Frequently Asked Questions')}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mb-4 max-w-lg mx-auto lg:mx-0">
                {globalContentString(
                  globalContent,
                  'faq_subtitle',
                  'PMP 2026 exam prep, certification pathways, regional pricing, membership, delivery, and policies.',
                )}
              </p>
              <p className="mb-8">
                <Link
                  href="/pmp-faq"
                  className="text-brand-purple font-semibold hover:underline text-sm"
                >
                  View all PMP FAQs →
                </Link>
              </p>
              <div className="relative max-w-md mx-auto lg:mx-0">
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
          </PageHeroWithImage>
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
                className="w-full !inline-flex flex-nowrap overflow-x-auto h-auto gap-1 mb-10 justify-center scrollbar-thin"
                aria-label="FAQ categories"
              >
                {FAQ_HUB_SECTIONS.map((section) => (
                  <TabsTrigger
                    key={section.id}
                    value={section.id}
                    className="flex-none shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-2"
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
            <TrackedContactLink
              href={`mailto:${PMS_SUPPORT_EMAIL}`}
              contactMethod="email"
              contactContext="support"
              ctaText={PMS_SUPPORT_EMAIL}
              className="text-brand-orange font-bold hover:underline"
            >
              {PMS_SUPPORT_EMAIL}
            </TrackedContactLink>{' '}
            for billing, access, privacy, and policy questions: or message us on WhatsApp. Browse our{' '}
            <Link href="/legal" className="text-brand-orange font-bold hover:underline">
              legal hub
            </Link>{' '}
            for full terms.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="brand" className="gap-2" asChild>
              <TrackedContactLink
                href={`mailto:${PMS_SUPPORT_EMAIL}`}
                contactMethod="email"
                contactContext="support"
                ctaText="Email support"
              >
                <Mail className="h-4 w-4" />
                Email support
              </TrackedContactLink>
            </Button>
            {isWhatsAppConfigured() ? (
              <Button variant="outline" className="gap-2" asChild>
                <TrackedContactLink
                  href={getPmsWhatsAppUrl()}
                  contactMethod="whatsapp"
                  contactContext="support"
                  ctaText={`WhatsApp ${getPmsWhatsAppDisplay()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp {getPmsWhatsAppDisplay()}
                </TrackedContactLink>
              </Button>
            ) : null}
            <WebsiteCalendlyButton
              tier="discovery"
              variant="brand"
              funnelLabel="faq_talk_to_mentor"
              utm={{ utm_source: 'pmstructure', utm_medium: 'faq', utm_campaign: 'hero_consultation' }}
            >
              {CTAS.talkToAMentor}
            </WebsiteCalendlyButton>
          </div>
        </div>
      </section>
    </div>
  );
}