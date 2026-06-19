import Link from 'next/link';
import { HTML_SITEMAP_SECTIONS } from '@/content/sitemap/html-sitemap-sections';
import { buildPageMetadata } from '@/lib/site-metadata';

export const metadata = buildPageMetadata({
  title: 'Sitemap',
  description:
    'Find PM Structure public certification pathways, PMP 2026 readiness pages, answer guides, FAQ, community, membership, services, and legal pages.',
  path: '/sitemap',
});

export default function SitemapPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-obsidian dark:text-white mb-4">PM Structure Sitemap</h1>
      <p className="text-carbon dark:text-slate-400 mb-10 leading-relaxed">
        Use this sitemap to find PM Structure&apos;s public certification pathways, PMP 2026 readiness pages,
        answer guides, FAQ, community, membership, services, and legal pages.
      </p>
      <div className="flex flex-col gap-10">
        {HTML_SITEMAP_SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-obsidian dark:text-white mb-3">{section.title}</h2>
            <ul className="flex flex-col gap-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-brand-purple hover:text-brand-orange transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
