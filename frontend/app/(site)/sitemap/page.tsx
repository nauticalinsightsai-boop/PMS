import Link from 'next/link';
import { ExternalLink, FileCode2, Map } from 'lucide-react';
import { buildPageMetadata } from '@/lib/site-metadata';
import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildHtmlSitemapSections,
  getXmlSitemapUrlCount,
} from '@/lib/sitemap/build-html-sitemap-sections';
import { pageHeroSection, SectionAmbience, sectionSurface } from '@/components/SectionAmbience';

export const metadata = buildPageMetadata({
  title: 'Sitemap',
  description:
    'Browse PM Structure public pages: PMP 2026 readiness, certification pathways, answer guides, topic hubs, community, newsletter, and legal policies.',
  path: '/sitemap',
});

export default async function SitemapPage() {
  const [sections, xmlUrlCount] = await Promise.all([
    buildHtmlSitemapSections(),
    Promise.resolve(getXmlSitemapUrlCount()),
  ]);

  const htmlLinkCount = sections.reduce((total, section) => total + section.links.length, 0);
  const xmlSitemapUrl = `${PMS_SITE_URL}/sitemap.xml`;

  return (
    <div className="flex flex-col min-h-screen">
      <section className={pageHeroSection('purple')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto max-w-5xl">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple">
              <Map className="h-7 w-7" aria-hidden />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                PM Structure Sitemap
              </h1>
              <p className="mt-3 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                Browse every major public page on PM Structure: PMP 2026 readiness, certification
                pathways, answer guides, topic hubs, community, newsletter, and legal policies.
              </p>
              <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                {htmlLinkCount} curated links on this page · {xmlUrlCount} URLs in the XML sitemap
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-brand-purple/20 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-brand-purple/30 dark:bg-slate-900/80 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
                  <FileCode2 className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Submit to Google &amp; Bing
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Search engines read the XML sitemap, not this HTML page. Add the URL below in
                    Google Search Console and Bing Webmaster Tools.
                  </p>
                  <p className="mt-3 break-all font-mono text-sm font-semibold text-brand-purple">
                    {xmlSitemapUrl}
                  </p>
                </div>
              </div>
              <a
                href={xmlSitemapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-purple px-5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-purple/90"
              >
                Open XML sitemap
                <ExternalLink className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-12 md:py-16')}>
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
              >
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {section.title}
                </h2>
                <p className="mb-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {section.links.length} {section.links.length === 1 ? 'page' : 'pages'}
                </p>
                <ul className="flex max-h-[22rem] flex-col gap-2 overflow-y-auto pr-1 text-sm">
                  {section.links.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-2 py-1.5 text-slate-700 transition-colors hover:bg-brand-purple/5 hover:text-brand-purple dark:text-slate-300 dark:hover:text-brand-orange"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
            Channel landing pages under{' '}
            <code className="font-semibold text-brand-purple">
              /go/*
            </code>{' '}
            and checkout flows are intentionally omitted from this human sitemap and the{' '}
            <a href={xmlSitemapUrl} className="font-semibold text-brand-purple hover:underline">
              XML sitemap
            </a>
            . Portals carry <span className="font-semibold">noindex</span> and are for lead-gen via
            direct links only, not organic search.
          </p>
        </div>
      </section>
    </div>
  );
}
