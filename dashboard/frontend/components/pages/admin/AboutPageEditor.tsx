'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  FIELD_KEYS,
  defaultAboutPageConfig,
  parseAboutPageConfig,
  type AboutPageConfig,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';
import { getPublicSitePage } from '@/constants/publicSitePages';

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

export function AboutPageEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(FIELD_KEYS.ABOUT_PAGE_CONFIG, defaultAboutPageConfig, parseAboutPageConfig);

  const setHero = (patch: Partial<AboutPageConfig['hero']>) => {
    setConfig((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  };

  const setMission = (patch: Partial<AboutPageConfig['mission']>) => {
    setConfig((c) => ({ ...c, mission: { ...c.mission, ...patch } }));
  };

  const setStory = (patch: Partial<AboutPageConfig['story']>) => {
    setConfig((c) => ({ ...c, story: { ...c.story, ...patch } }));
  };

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.ABOUT_PAGE_CONFIG}
      title="About page"
      editorDescription={getPublicSitePage('about')?.editorDescription}
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      loadError={loadError}
      lastSynced={updatedAt}
      publicPreviewPath="/about"
    >
      <GlassCard className="space-y-6 p-6">
        <section className="space-y-3">
          <h2 className="font-bold">Hero</h2>
          <p className="text-sm text-muted-foreground">
            Shown at the top of /about. Subtitle is the main hero paragraph visitors see.
          </p>
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
          <h2 className="font-bold">Mission</h2>
          <Field label="Title">
            <input
              value={config.mission.title}
              onChange={(e) => setMission({ title: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Subtitle">
            <textarea
              value={config.mission.subtitle}
              onChange={(e) => setMission({ subtitle: e.target.value })}
              rows={2}
              className={inputClass}
            />
          </Field>
          <Field label="Body (optional)">
            <textarea
              value={config.mission.body ?? ''}
              onChange={(e) => setMission({ body: e.target.value })}
              rows={3}
              className={inputClass}
            />
          </Field>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-4">
          <h2 className="font-bold">Our Story</h2>
          <Field label="Section title">
            <input
              value={config.story.title}
              onChange={(e) => setStory({ title: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Paragraph 1">
            <textarea
              value={config.story.text1}
              onChange={(e) => setStory({ text1: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </Field>
          <Field label="Paragraph 2">
            <textarea
              value={config.story.text2}
              onChange={(e) => setStory({ text2: e.target.value })}
              rows={4}
              className={inputClass}
            />
          </Field>
        </section>
      </GlassCard>
    </SiteDocumentEditorShell>
  );
}
