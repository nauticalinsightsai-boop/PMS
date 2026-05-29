'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  FIELD_KEYS,
  defaultCommunityPageConfig,
  parseCommunityPageConfig,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';

export function CommunityPageEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(
      FIELD_KEYS.COMMUNITY_PAGE_CONFIG,
      defaultCommunityPageConfig,
      parseCommunityPageConfig,
    );

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.COMMUNITY_PAGE_CONFIG}
      title="Community page"
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      loadError={loadError}
      lastSynced={updatedAt}
      publicPreviewPath="/community"
    >
      <GlassCard className="p-6 space-y-6">
        <section className="space-y-3">
          <h2 className="font-bold">Hero</h2>
          {(['badge', 'title', 'subtitle'] as const).map((key) => (
            <input
              key={key}
              value={config.hero[key]}
              onChange={(e) => setConfig((c) => ({ ...c, hero: { ...c.hero, [key]: e.target.value } }))}
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />
          ))}
        </section>
        <section className="space-y-3 border-t pt-4">
          <h2 className="font-bold">Network block</h2>
          <input
            value={config.network.title}
            onChange={(e) => setConfig((c) => ({ ...c, network: { ...c.network, title: e.target.value } }))}
            placeholder="Network title"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
          <textarea
            value={config.network.subtitle}
            onChange={(e) => setConfig((c) => ({ ...c, network: { ...c.network, subtitle: e.target.value } }))}
            className="w-full border rounded-xl px-3 py-2 text-sm h-20"
          />
          <input
            type="number"
            value={config.network.memberCount ?? 0}
            onChange={(e) =>
              setConfig((c) => ({
                ...c,
                network: { ...c.network, memberCount: Number(e.target.value) || 0 },
              }))
            }
            placeholder="Member count"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
          <input
            value={config.network.ctaText}
            onChange={(e) => setConfig((c) => ({ ...c, network: { ...c.network, ctaText: e.target.value } }))}
            placeholder="CTA text"
            className="w-full border rounded-xl px-3 py-2 text-sm"
          />
        </section>
        {config.storeIntro && (
          <section className="space-y-3 border-t pt-4">
            <h2 className="font-bold">Store tab intro</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={config.storeIntro.visible}
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    storeIntro: { ...c.storeIntro!, visible: e.target.checked },
                  }))
                }
              />
              Show store intro
            </label>
            <input
              value={config.storeIntro.title}
              onChange={(e) =>
                setConfig((c) => ({ ...c, storeIntro: { ...c.storeIntro!, title: e.target.value } }))
              }
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />
          </section>
        )}
      </GlassCard>
    </SiteDocumentEditorShell>
  );
}
