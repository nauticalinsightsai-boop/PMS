'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  FIELD_KEYS,
  DEFAULT_MEMBERSHIP_PRICING,
  defaultMembershipPageConfig,
  parseMembershipPageConfig,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';
import { getPublicSitePage } from '@/constants/publicSitePages';

export function MembershipPageEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(
      FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG,
      defaultMembershipPageConfig,
      parseMembershipPageConfig,
    );

  const pricing = config.pricing ?? {
    professional: { ...DEFAULT_MEMBERSHIP_PRICING.professional },
    mastery: { ...DEFAULT_MEMBERSHIP_PRICING.mastery },
  };

  const setPrice = (
    tier: 'professional' | 'mastery',
    cycle: 'monthlyUsd' | 'yearlyUsd',
    value: string,
  ) => {
    const amount = Math.max(0, Number(value) || 0);
    setConfig((c) => {
      const base = c.pricing ?? {
        professional: { ...DEFAULT_MEMBERSHIP_PRICING.professional },
        mastery: { ...DEFAULT_MEMBERSHIP_PRICING.mastery },
      };
      return {
        ...c,
        pricing: { ...base, [tier]: { ...base[tier], [cycle]: amount } },
      };
    });
  };

  const priceInputClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-brand-orange/40 focus-visible:ring-2 focus-visible:ring-brand-orange/30';

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG}
      title="Membership page"
      editorDescription={getPublicSitePage('membership')?.editorDescription}
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
          <div>
            <h2 className="font-bold">Pricing (USD)</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Base USD prices. These drive both the price shown on /membership and the amount charged at
              checkout. Regional currency conversion is applied automatically. Starter tier stays free.
            </p>
          </div>
          {(['professional', 'mastery'] as const).map((tier) => (
            <div key={tier} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-sm font-bold capitalize">{tier}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Monthly (USD)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={pricing[tier].monthlyUsd}
                      onChange={(e) => setPrice(tier, 'monthlyUsd', e.target.value)}
                      className={priceInputClass}
                    />
                  </div>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                    Yearly (USD)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">$</span>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={pricing[tier].yearlyUsd}
                      onChange={(e) => setPrice(tier, 'yearlyUsd', e.target.value)}
                      className={priceInputClass}
                    />
                  </div>
                </label>
              </div>
            </div>
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
