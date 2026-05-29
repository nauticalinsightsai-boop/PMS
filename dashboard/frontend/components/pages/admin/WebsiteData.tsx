'use client';

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Send,
  History,
  Settings2,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { SyncStatusIndicator, SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { useWebsiteDataRealtime } from '@/hooks/useWebsiteDataRealtime';
import { FIELD_KEYS } from '@pms/site-content/keys';
import { CmsSaveNotice } from '@/components/pages/admin/CmsSaveNotice';
import { getCmsSaveBlockReason, toSyncErrorMessage } from '@/lib/cms/save-guard';
import { motion, AnimatePresence } from 'motion/react';
import { siteUrl } from '@/lib/site-config';
import {
  WEBSITE_PAGE_CONFIGS,
  type WebsitePageSlug,
} from '@/constants/websitePageConfigs';

interface WebsiteDataEditorProps {
  initialPage?: WebsitePageSlug;
}

export const WebsiteDataEditor: React.FC<WebsiteDataEditorProps> = ({
  initialPage = 'home',
}) => {
  const [activePage, setActivePage] = useState<WebsitePageSlug>(initialPage);
  const [content, setContent] = useState<Record<string, string>>({});
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [syncErrorDetail, setSyncErrorDetail] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await WebsiteDataService.getData('draft');
      const contentMap: Record<string, string> = {};
      data.forEach((item) => {
        if (item.field_key === FIELD_KEYS.GLOBAL_CONTENT && typeof item.content === 'object' && item.content !== null) {
          Object.assign(contentMap, item.content as Record<string, string>);
        }
      });
      setContent(contentMap);
      setSyncStatus('synced');
      setLastSynced(new Date());
    } catch (err) {
      console.error('Error fetching website data:', err);
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
      if (syncStatus === 'pending') {
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
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [content, syncStatus]);

  const handleChange = (field: string, value: string) => {
    setContent((prev) => ({ ...prev, [field]: value }));
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
      await WebsiteDataService.publish('global_content');
      setSyncStatus('synced');
      setLastSynced(new Date());
      alert('Website content published successfully!');
    } catch (err) {
      setSyncErrorDetail(toSyncErrorMessage(err, 'Failed to publish.'));
      setSyncStatus('error');
    }
  };

  const pageConfig = WEBSITE_PAGE_CONFIGS[activePage];
  const livePageUrl = `${siteUrl.replace(/\/$/, '')}${pageConfig.publicPath}`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CmsSaveNotice />
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{pageConfig.label}</h1>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Globe size={12} className="text-brand-orange" />
            Edits content for{' '}
            <a
              href={livePageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-orange hover:underline inline-flex items-center gap-1"
            >
              {pageConfig.publicPath}
              <ExternalLink size={10} />
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={livePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            View live page <ExternalLink size={12} />
          </a>
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
            <Send size={14} className="mr-2" /> Publish all pages
          </CTAButton>
        </div>
      </header>

      <div className="max-w-4xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {pageConfig.sections.map((section) => (
                <GlassCard key={section.id} variant="raised" className="p-8">
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                    <h3 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tight">
                      <Settings2 size={20} className="text-brand-orange" /> {section.label}
                    </h3>
                    <button
                      type="button"
                      className="text-[10px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 uppercase tracking-widest"
                    >
                      <History size={12} /> Restore
                    </button>
                  </div>

                  <div className="space-y-6">
                    {section.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          {field.label}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={content[field.key] || ''}
                            placeholder={`Enter ${field.label}...`}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm leading-relaxed focus:ring-2 focus:ring-brand-orange outline-none transition-all h-32"
                          />
                        ) : (
                          <input
                            type="text"
                            value={content[field.key] || ''}
                            placeholder={`Enter ${field.label}...`}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-brand-orange outline-none transition-all"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              ))}

              {activePage === 'certifications' && (
                <GlassCard className="p-6" variant="surface">
                  <p className="text-sm text-muted-foreground">
                    Individual certification detail pages (<code>/certifications/[id]</code>) use
                    pathway data from the certifications catalog. Edit listing copy here; detail
                    layouts are driven by site data.
                  </p>
                </GlassCard>
              )}

              <GlassCard className="p-8" variant="surface">
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="text-brand-orange" size={20} />
                  <h3 className="text-xl font-bold">Search visibility</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Meta title
                      </label>
                      <input
                        type="text"
                        value={content[`${activePage}_meta_title`] || ''}
                        onChange={(e) => handleChange(`${activePage}_meta_title`, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-brand-orange outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                        Meta description
                      </label>
                      <textarea
                        value={content[`${activePage}_meta_desc`] || ''}
                        onChange={(e) => handleChange(`${activePage}_meta_desc`, e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:ring-1 focus:ring-brand-orange outline-none h-24"
                      />
                    </div>
                  </div>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4">
                      Snippet preview
                    </p>
                    <p className="text-blue-500 font-medium text-base leading-tight">
                      {content[`${activePage}_meta_title`] || pageConfig.label} | PM Structure
                    </p>
                    <p className="text-green-600 text-[10px]">{livePageUrl}</p>
                    <p className="text-muted-foreground text-[10px] line-clamp-2 mt-1">
                      {content[`${activePage}_meta_desc`] ||
                        'Certification pathways for project professionals.'}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
      </div>
    </div>
  );
};
