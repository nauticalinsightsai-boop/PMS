import Link from 'next/link';
import { PUBLIC_SITE_PAGES, dashboardPageEditorPath } from '@/constants/publicSitePages';
import { siteUrl } from '@/lib/site-config';

export default function SiteSystemHub() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">Website pages</h1>
        <p className="text-gw-text-secondary text-sm max-w-xl">
          Each item matches a page on the public site ({siteUrl}). Select a page to edit its
          content and SEO.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PUBLIC_SITE_PAGES.map((page) => {
          const Icon = page.icon;
          return (
            <Link
              key={page.slug}
              href={dashboardPageEditorPath(page.slug)}
              className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-gw-accent-primary/10 hover:border-gw-accent-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-gw-accent-primary/10 text-gw-accent-primary">
                  <Icon size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-lg group-hover:text-gw-accent-primary transition-colors">
                    {page.label}
                  </h2>
                  <p className="text-xs text-gw-text-secondary mt-1 font-mono">{page.path}</p>
                  {page.inMainNav && (
                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-widest text-gw-accent-primary">
                      Main nav
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
