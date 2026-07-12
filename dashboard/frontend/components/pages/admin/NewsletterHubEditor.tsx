'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  FIELD_KEYS,
  defaultNewsletterHubConfig,
  parseNewsletterHubConfig,
  type NewsletterHubConfig,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-brand-orange/40 focus-visible:ring-2 focus-visible:ring-brand-orange/30';
const labelClass = 'text-[11px] font-bold uppercase tracking-wide text-muted-foreground';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function NewsletterHubEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(
      FIELD_KEYS.NEWSLETTER_HUB_CONFIG,
      defaultNewsletterHubConfig,
      parseNewsletterHubConfig,
    );

  const setHero = (patch: Partial<NewsletterHubConfig['hero']>) => {
    setConfig((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  };

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.NEWSLETTER_HUB_CONFIG}
      title="Newsletter hub"
      editorDescription="Controls the /newsletter landing hero. Posts and authors are edited separately."
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      loadError={loadError}
      lastSynced={updatedAt}
      publicPreviewPath="/newsletter"
    >
      <GlassCard className="space-y-6 p-6">
        <section className="space-y-3">
          <h2 className="font-bold">Hero</h2>
          <Field label="Badge">
            <input
              value={config.hero.badge}
              onChange={(e) => setHero({ badge: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Title">
            <input
              value={config.hero.title}
              onChange={(e) => setHero({ title: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Subtitle">
            <textarea
              value={config.hero.subtitle}
              onChange={(e) => setHero({ subtitle: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </Field>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-4">
          <h2 className="font-bold">Article source</h2>
          <Field label="Published articles load from">
            <select
              value={config.source}
              onChange={(e) =>
                setConfig((c) => ({
                  ...c,
                  source: e.target.value === 'file' ? 'file' : 'supabase',
                }))
              }
              className={inputClass}
            >
              <option value="supabase">Supabase CMS (recommended)</option>
              <option value="file">File seed only</option>
            </select>
          </Field>
        </section>
      </GlassCard>
    </SiteDocumentEditorShell>
  );
}
