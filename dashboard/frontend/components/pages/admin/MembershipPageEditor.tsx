'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  FIELD_KEYS,
  defaultMembershipPageConfig,
  parseMembershipPageConfig,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';

export function MembershipPageEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(
      FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG,
      defaultMembershipPageConfig,
      parseMembershipPageConfig,
    );

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG}
      title="Membership page"
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      loadError={loadError}
      lastSynced={updatedAt}
      publicPreviewPath="/membership"
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
          <h2 className="font-bold">Tier visibility</h2>
          {config.tiers.map((tier, idx) => (
            <div key={tier.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl border">
              <span className="font-bold capitalize">{tier.id}</span>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={tier.visible}
                  onChange={(e) =>
                    setConfig((c) => {
                      const tiers = [...c.tiers];
                      tiers[idx] = { ...tiers[idx], visible: e.target.checked };
                      return { ...c, tiers };
                    })
                  }
                />
                Visible
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={tier.highlight ?? false}
                  onChange={(e) =>
                    setConfig((c) => {
                      const tiers = c.tiers.map((t, i) => ({
                        ...t,
                        highlight: i === idx ? e.target.checked : false,
                      }));
                      return { ...c, tiers };
                    })
                  }
                />
                Highlight card
              </label>
            </div>
          ))}
        </section>
      </GlassCard>
    </SiteDocumentEditorShell>
  );
}
