'use client';

import React, { useMemo, useState } from 'react';
import { Eye, Save, Send } from 'lucide-react';
import { CTAButton } from '@/components/ui/CTAButton';
import { SyncStatusIndicator, type SyncStatus } from '@/components/shared/SyncStatusIndicator';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { validateFieldContent } from '@pms/site-content';
import { previewStorageKey } from '@/lib/usePublishedSiteDocument';
import { siteUrl } from '@/lib/site-config';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import { PageEditorIntro } from '@/components/layout/PageEditorIntro';

type Props<T> = {
  fieldKey: string;
  title: string;
  editorDescription?: string;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  baseline: string;
  setBaseline: (v: string) => void;
  isLoading: boolean;
  loadError?: string | null;
  lastSynced?: Date;
  publicPreviewPath: string;
  previewMessageType?: string;
  children: React.ReactNode;
};

export function SiteDocumentEditorShell<T extends Record<string, unknown>>({
  fieldKey,
  title,
  editorDescription,
  data,
  setData,
  baseline,
  setBaseline,
  isLoading,
  loadError,
  lastSynced,
  publicPreviewPath,
  previewMessageType,
  children,
}: Props<T>) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  const hasChanges = useMemo(() => JSON.stringify(data) !== baseline, [data, baseline]);

  React.useEffect(() => {
    setSyncStatus((current) => {
      if (current === 'syncing' || current === 'error') return current;
      return hasChanges ? 'pending' : 'synced';
    });
  }, [hasChanges]);

  const handleSaveDraft = async () => {
    setSyncStatus('syncing');
    try {
      await WebsiteDataService.saveDraft(fieldKey, data as unknown as Record<string, unknown>);
      setBaseline(JSON.stringify(data));
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  const handlePublish = async () => {
    const check = validateFieldContent(fieldKey, data);
    if (!check.success) {
      setSyncStatus('error');
      alert(`Publish blocked: ${fieldKey} failed validation.`);
      return;
    }
    setSyncStatus('syncing');
    try {
      await WebsiteDataService.saveDraft(fieldKey, data as unknown as Record<string, unknown>);
      await WebsiteDataService.publish(fieldKey);
      setBaseline(JSON.stringify(data));
      setSyncStatus('synced');
    } catch {
      setSyncStatus('error');
    }
  };

  const openPreview = () => {
    const msgType = previewMessageType ?? `pms:site-preview:${fieldKey}`;
    localStorage.setItem(previewStorageKey(fieldKey), JSON.stringify(data));
    const url = `${siteUrl.replace(/\/$/, '')}${publicPreviewPath}?sitePreview=1&previewKey=${encodeURIComponent(fieldKey)}`;
    const win = window.open(url, '_blank');
    window.setTimeout(() => {
      win?.postMessage({ type: msgType, fieldKey, content: data }, siteUrl.replace(/\/$/, ''));
    }, 800);
  };

  if (isLoading) {
    return <div className="p-8 text-slate-500">Loading {title}…</div>;
  }

  return (
    <div className="space-y-5">
      {loadError && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          {loadError}
        </p>
      )}
      <DashboardPageHeader
        title={title}
        description={editorDescription ? undefined : `Publish to update ${publicPreviewPath} on the live site.`}
        actions={
          <>
            <SyncStatusIndicator status={syncStatus} lastSynced={lastSynced} />
            <CTAButton variant="outline" onClick={openPreview} className="gap-2">
              <Eye className="h-4 w-4" /> Preview
            </CTAButton>
            <CTAButton variant="outline" onClick={handleSaveDraft} disabled={!hasChanges} className="gap-2">
              <Save className="h-4 w-4" /> Save draft
            </CTAButton>
            <CTAButton onClick={handlePublish} className="gap-2">
              <Send className="h-4 w-4" /> Publish
            </CTAButton>
          </>
        }
      />
      {editorDescription ? (
        <PageEditorIntro publicPath={publicPreviewPath} description={editorDescription} />
      ) : null}
      {children}
    </div>
  );
}
