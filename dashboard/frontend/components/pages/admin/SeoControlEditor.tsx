'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Search, Send, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { SyncStatusIndicator, SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import { FIELD_KEYS } from '@pms/site-content/keys';
import { CmsSaveNotice } from '@/components/pages/admin/CmsSaveNotice';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { getCmsSaveBlockReason, toSyncErrorMessage } from '@/lib/cms/save-guard';
import { siteUrl } from '@/lib/site-config';
import { cn } from '@/lib/utils';

/** Pages whose meta title/description are wired to the public site metadata. */
const SEO_PAGES: Array<{ slug: string; label: string; path: string; defaultTitle: string }> = [
  { slug: 'about', label: 'About', path: '/about', defaultTitle: 'About PM Structure' },
  {
    slug: 'compare',
    label: 'Compare Certifications',
    path: '/certifications/compare',
    defaultTitle: 'Compare project management certifications',
  },
  { slug: 'faq', label: 'FAQ', path: '/faq', defaultTitle: 'Frequently Asked Questions' },
  { slug: 'contact', label: 'Contact', path: '/contact', defaultTitle: 'Contact & consultation' },
];

const SITE_NAME = 'PM Structure';
const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-brand-orange/40 focus-visible:ring-2 focus-visible:ring-brand-orange/30';
const labelClass = 'text-[11px] font-bold uppercase tracking-wide text-muted-foreground';

export function SeoControlEditor() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [syncErrorDetail, setSyncErrorDetail] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await WebsiteDataService.getData('draft');
      const map: Record<string, string> = {};
      data.forEach((item) => {
        if (
          item.field_key === FIELD_KEYS.GLOBAL_CONTENT &&
          typeof item.content === 'object' &&
          item.content !== null
        ) {
          Object.assign(map, item.content as Record<string, string>);
        }
      });
      setContent(map);
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (err) {
      console.error('Error fetching SEO data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useWebsiteDataRealtime(FIELD_KEYS.GLOBAL_CONTENT, fetchData);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (syncStatus !== 'pending') return;
      const blockReason = getCmsSaveBlockReason();
      if (blockReason) {
        setSyncErrorDetail(blockReason);
        setSyncStatus('error');
        return;
      }
      setSyncStatus('syncing');
      setSyncErrorDetail(null);
      try {
        await WebsiteDataService.saveDraft('global_content', content);
        setSyncStatus('synced');
        setLastSynced(new Date());
      } catch (err) {
        setSyncErrorDetail(toSyncErrorMessage(err, 'Failed to save draft.'));
        setSyncStatus('error');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [content, syncStatus]);

  const handleChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSyncStatus('pending');
  };

  const handlePublish = async () => {
    const blockReason = getCmsSaveBlockReason();
    if (blockReason) {
      setSyncErrorDetail(blockReason);
      setSyncStatus('error');
      return;
    }
    setSyncStatus('syncing');
    setSyncErrorDetail(null);
    try {
      await WebsiteDataService.saveDraft('global_content', content);
      await WebsiteDataService.publish('global_content');
      setSyncStatus('synced');
      setLastSynced(new Date());
      alert('SEO metadata published successfully.');
    } catch (err) {
      setSyncErrorDetail(toSyncErrorMessage(err, 'Failed to publish.'));
      setSyncStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CmsSaveNotice />
      <DashboardPageHeader
        title="SEO Control"
        icon={Search}
        description="Per-page search title and meta description. Publish to update the live site metadata."
        actions={
          <>
            <SyncStatusIndicator
              status={syncStatus}
              lastSynced={lastSynced}
              onManualSync={() => setSyncStatus('pending')}
              errorDetail={syncErrorDetail}
            />
            <CTAButton
              size="sm"
              onClick={handlePublish}
              variant="primary"
              className="bg-green-600 hover:bg-green-700 shadow-green-600/20"
            >
              <Send size={14} className="mr-2" /> Publish SEO
            </CTAButton>
          </>
        }
      />

      <div className="max-w-4xl space-y-5">
        {SEO_PAGES.map((page) => {
          const titleKey = `${page.slug}_meta_title`;
          const descKey = `${page.slug}_meta_desc`;
          const title = content[titleKey] ?? '';
          const description = content[descKey] ?? '';
          const livePageUrl = `${siteUrl.replace(/\/$/, '')}${page.path}`;
          const previewTitle = `${(title || page.defaultTitle).trim()} | ${SITE_NAME}`;

          return (
            <GlassCard key={page.slug} className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{page.label}</h3>
                  <p className="font-mono text-xs text-muted-foreground">{page.path}</p>
                </div>
                <a
                  href={livePageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold hover:border-brand-orange/40 hover:text-brand-orange"
                >
                  View live <ExternalLink size={12} />
                </a>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-4">
                  <label className="block space-y-1.5">
                    <span className={labelClass}>Meta title</span>
                    <input
                      value={title}
                      placeholder={page.defaultTitle}
                      onChange={(e) => handleChange(titleKey, e.target.value)}
                      className={inputClass}
                    />
                    <span
                      className={cn(
                        'block text-[11px]',
                        previewTitle.length > 60 ? 'text-amber-600' : 'text-muted-foreground',
                      )}
                    >
                      {previewTitle.length} chars (aim ≤ 60)
                    </span>
                  </label>
                  <label className="block space-y-1.5">
                    <span className={labelClass}>Meta description</span>
                    <textarea
                      value={description}
                      placeholder="Search-result description for this page…"
                      onChange={(e) => handleChange(descKey, e.target.value)}
                      className={cn(inputClass, 'h-24 resize-y leading-relaxed')}
                    />
                    <span
                      className={cn(
                        'block text-[11px]',
                        description.length > 160 ? 'text-amber-600' : 'text-muted-foreground',
                      )}
                    >
                      {description.length} chars (aim ≤ 160)
                    </span>
                  </label>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Google preview
                  </p>
                  <p className="text-sm font-medium leading-tight text-blue-600 dark:text-blue-400 line-clamp-1">
                    {previewTitle}
                  </p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-500">{livePageUrl}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {description || 'Add a meta description to control the search snippet.'}
                  </p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
