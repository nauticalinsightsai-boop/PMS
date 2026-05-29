'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  GripVertical,
  Plus,
  Save,
  Send,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { SyncStatusIndicator, type SyncStatus } from '@/components/shared/SyncStatusIndicator';
import {
  FIELD_KEYS,
  defaultCertificationsHubConfig,
  defaultCertificationsRegistry,
  parseCertificationsHubConfig,
  parseCertificationsRegistry,
  validateFieldContent,
  type CertificationsHubConfig,
  type CertificationsRegistry,
  type CertificationRegistryEntry,
  type PathwayFamilyTab,
} from '@pms/site-content';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { siteUrl } from '@/lib/site-config';
import { previewStorageKey } from '@/lib/usePublishedSiteDocument';

const FAMILIES: PathwayFamilyTab[] = ['PMI', 'PRINCE2', 'SixSigma'];

function moveItem<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function FlagshipDragList({
  familyId,
  certIds,
  options,
  onChange,
}: {
  familyId: string;
  certIds: [string, string, string];
  options: string[];
  onChange: (ids: [string, string, string]) => void;
}) {
  return (
    <div className="space-y-2">
      {certIds.map((certId, idx) => (
        <div
          key={`${familyId}-${idx}`}
          className="flex items-center gap-2 p-2 rounded-xl border border-white/10 bg-white/5"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-xs font-bold text-muted-foreground w-6">{idx + 1}</span>
          <select
            value={certId}
            onChange={(e) => {
              const ids = [...certIds] as [string, string, string];
              ids[idx] = e.target.value;
              onChange(ids);
            }}
            className="flex-1 border rounded-lg px-2 py-1.5 text-sm bg-transparent"
          >
            {options.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={idx === 0}
            onClick={() => onChange(moveItem(certIds, idx, idx - 1) as [string, string, string])}
            className="p-1 disabled:opacity-30"
            aria-label="Move up"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={idx === certIds.length - 1}
            onClick={() => onChange(moveItem(certIds, idx, idx + 1) as [string, string, string])}
            className="p-1 disabled:opacity-30"
            aria-label="Move down"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

export function CertificationsHubEditor() {
  const [tab, setTab] = useState<'hub' | 'registry'>('hub');
  const [hub, setHub] = useState(() => defaultCertificationsHubConfig());
  const [registry, setRegistry] = useState(() => defaultCertificationsRegistry());
  const [baseline, setBaseline] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizard, setWizard] = useState({
    id: '',
    name: '',
    familyId: 'PMI' as CertificationRegistryEntry['familyId'],
    desc: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      const hubFallback = defaultCertificationsHubConfig();
      const registryFallback = defaultCertificationsRegistry();

      try {
        const rows = await WebsiteDataService.getData('draft');
        if (cancelled) return;

        const hubRow = rows.find((r) => r.field_key === FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG);
        const regRow = rows.find((r) => r.field_key === FIELD_KEYS.CERTIFICATIONS_REGISTRY);
        const nextHub = hubRow?.content ? parseCertificationsHubConfig(hubRow.content) : hubFallback;
        const nextReg = regRow?.content ? parseCertificationsRegistry(regRow.content) : registryFallback;
        setHub(nextHub);
        setRegistry(nextReg);
        setBaseline(JSON.stringify({ hub: nextHub, registry: nextReg }));
        setUpdatedAt(hubRow?.updated_at ? new Date(hubRow.updated_at) : undefined);
        setSyncStatus('synced');
      } catch (error) {
        console.error('Failed to load certifications CMS', error);
        if (cancelled) return;
        setHub(hubFallback);
        setRegistry(registryFallback);
        setBaseline(JSON.stringify({ hub: hubFallback, registry: registryFallback }));
        setLoadError(
          'Could not load draft data from Supabase. Showing defaults — saves may fail until connection is fixed.',
        );
        setSyncStatus('error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const certIdOptions = useMemo(
    () => registry.entries.filter((e) => !e.archived).map((e) => e.id),
    [registry.entries],
  );

  const hasChanges = baseline !== JSON.stringify({ hub, registry });

  const saveBoth = async (publish: boolean) => {
    const hubCheck = validateFieldContent(FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG, hub);
    const regCheck = validateFieldContent(FIELD_KEYS.CERTIFICATIONS_REGISTRY, registry);
    if (!hubCheck.success || !regCheck.success) {
      setSyncStatus('error');
      alert('Validation failed — check hub and registry fields.');
      return;
    }
    setSyncStatus('syncing');
    try {
      await WebsiteDataService.saveDraft(FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG, hub as unknown as Record<string, unknown>);
      await WebsiteDataService.saveDraft(FIELD_KEYS.CERTIFICATIONS_REGISTRY, registry as unknown as Record<string, unknown>);
      if (publish) {
        await WebsiteDataService.publish(FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG);
        await WebsiteDataService.publish(FIELD_KEYS.CERTIFICATIONS_REGISTRY);
      }
      setBaseline(JSON.stringify({ hub, registry }));
      setSyncStatus('synced');
      setUpdatedAt(new Date());
    } catch {
      setSyncStatus('error');
    }
  };

  const openPreview = () => {
    localStorage.setItem(previewStorageKey(FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG), JSON.stringify(hub));
    localStorage.setItem(previewStorageKey(FIELD_KEYS.CERTIFICATIONS_REGISTRY), JSON.stringify(registry));
    window.open(`${siteUrl.replace(/\/$/, '')}/certifications?sitePreview=1&previewKey=${FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG}`, '_blank');
  };

  const addCert = () => {
    const id = wizard.id.trim().toLowerCase().replace(/\s+/g, '-');
    if (!id || !wizard.name.trim()) return;
    if (registry.entries.some((e) => e.id === id)) {
      alert('Cert ID already exists.');
      return;
    }
    setRegistry((r) => ({
      ...r,
      entries: [
        ...r.entries,
        {
          id,
          name: wizard.name.trim(),
          familyId: wizard.familyId,
          desc: wizard.desc.trim(),
          hidden: false,
          archived: false,
          sortOrder: r.entries.length,
          detailHeroTitle: `${wizard.name.trim()} Pathway`,
          detailHeroSubtitle: wizard.desc.trim(),
        },
      ],
    }));
    setWizardOpen(false);
    setWizard({ id: '', name: '', familyId: 'PMI', desc: '' });
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading certifications CMS…</div>;

  const editingEntry = editingId ? registry.entries.find((e) => e.id === editingId) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {loadError && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
          {loadError}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Certifications CMS</h1>
        <div className="flex flex-wrap items-center gap-2">
          <SyncStatusIndicator status={syncStatus} lastSynced={updatedAt} />
          <CTAButton variant="outline" onClick={openPreview} className="gap-2">
            <Eye className="h-4 w-4" /> Preview
          </CTAButton>
          <CTAButton variant="outline" onClick={() => saveBoth(false)} disabled={!hasChanges} className="gap-2">
            <Save className="h-4 w-4" /> Save draft
          </CTAButton>
          <CTAButton onClick={() => saveBoth(true)} className="gap-2">
            <Send className="h-4 w-4" /> Publish
          </CTAButton>
        </div>
      </div>

      <div className="flex gap-2">
        {(['hub', 'registry'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize ${
              tab === t ? 'bg-brand-orange/15 text-brand-orange' : 'text-muted-foreground'
            }`}
          >
            {t === 'hub' ? 'Hub & flagships' : `Registry (${registry.entries.length})`}
          </button>
        ))}
      </div>

      {tab === 'hub' && (
        <GlassCard className="p-6 space-y-6">
          <section className="space-y-3">
            <h2 className="font-bold">Hero</h2>
            {(['badge', 'title', 'subtitle'] as const).map((key) => (
              <input
                key={key}
                value={hub.hero[key]}
                onChange={(e) => setHub((c) => ({ ...c, hero: { ...c.hero, [key]: e.target.value } }))}
                placeholder={key}
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
            ))}
          </section>
          {FAMILIES.map((familyId) => (
            <section key={familyId} className="space-y-3 border-t pt-4">
              <h2 className="font-bold">{familyId} — flagship row (drag to reorder)</h2>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hub.families[familyId]!.visible}
                  onChange={(e) =>
                    setHub((c) => ({
                      ...c,
                      families: {
                        ...c.families,
                        [familyId]: { ...c.families[familyId]!, visible: e.target.checked },
                      },
                    }))
                  }
                />
                Visible on hub
              </label>
              <FlagshipDragList
                familyId={familyId}
                certIds={hub.families[familyId]!.flagshipCertIds}
                options={certIdOptions.filter((id) => {
                  const entry = registry.entries.find((e) => e.id === id);
                  return entry?.familyId === familyId || entry?.familyId === 'FoundationDirect';
                }).length
                  ? certIdOptions.filter((id) => registry.entries.find((e) => e.id === id)?.familyId === familyId)
                  : certIdOptions}
                onChange={(ids) =>
                  setHub((c) => ({
                    ...c,
                    families: { ...c.families, [familyId]: { ...c.families[familyId]!, flagshipCertIds: ids } },
                  }))
                }
              />
            </section>
          ))}
        </GlassCard>
      )}

      {tab === 'registry' && (
        <GlassCard className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {registry.entries.length} pathways. Hide/archive or edit detail-page marketing copy.
            </p>
            <CTAButton size="sm" onClick={() => setWizardOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" /> Add pathway
            </CTAButton>
          </div>

          {wizardOpen && (
            <div className="p-4 rounded-2xl border border-amber-500/40 bg-amber-500/5 space-y-3">
              <p className="text-xs text-amber-600 font-medium">
                New marketing records only. Checkout/pricing still requires regional-catalogue.json entries.
              </p>
              <input
                value={wizard.id}
                onChange={(e) => setWizard((w) => ({ ...w, id: e.target.value }))}
                placeholder="cert-id (e.g. new-pathway)"
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
              <input
                value={wizard.name}
                onChange={(e) => setWizard((w) => ({ ...w, name: e.target.value }))}
                placeholder="Display name"
                className="w-full border rounded-xl px-3 py-2 text-sm"
              />
              <select
                value={wizard.familyId}
                onChange={(e) =>
                  setWizard((w) => ({ ...w, familyId: e.target.value as CertificationRegistryEntry['familyId'] }))
                }
                className="w-full border rounded-xl px-3 py-2 text-sm"
              >
                <option value="PMI">PMI</option>
                <option value="PRINCE2">PRINCE2</option>
                <option value="SixSigma">Lean Six Sigma</option>
                <option value="FoundationDirect">Foundation Direct</option>
              </select>
              <textarea
                value={wizard.desc}
                onChange={(e) => setWizard((w) => ({ ...w, desc: e.target.value }))}
                placeholder="Short description"
                className="w-full border rounded-xl px-3 py-2 text-sm h-20"
              />
              <div className="flex gap-2">
                <CTAButton size="sm" onClick={addCert}>
                  Add to registry
                </CTAButton>
                <CTAButton size="sm" variant="outline" onClick={() => setWizardOpen(false)}>
                  Cancel
                </CTAButton>
              </div>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-2">
            {registry.entries.map((entry, idx) => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center gap-2 p-3 rounded-xl border border-white/10 text-sm"
              >
                <span className="font-mono font-bold min-w-[8rem]">{entry.id}</span>
                <span className="flex-1 truncate">{entry.name}</span>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={!entry.hidden}
                    onChange={(e) =>
                      setRegistry((r) => {
                        const entries = [...r.entries];
                        entries[idx] = { ...entries[idx], hidden: !e.target.checked };
                        return { ...r, entries };
                      })
                    }
                  />
                  Listed
                </label>
                <button
                  type="button"
                  className="text-brand-orange font-bold text-xs"
                  onClick={() => setEditingId(entry.id)}
                >
                  Edit marketing
                </button>
              </div>
            ))}
          </div>

          {editingEntry && (
            <div className="p-4 rounded-2xl border border-brand-orange/30 space-y-3 mt-4">
              <h3 className="font-bold">Detail page — {editingEntry.id}</h3>
              {(
                [
                  ['detailHeroTitle', 'Hero title'],
                  ['detailHeroSubtitle', 'Hero subtitle'],
                  ['outputValue', 'Primary value line'],
                  ['recommendedCta', 'Recommended CTA'],
                  ['targetAudience', 'Target audience'],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block space-y-1">
                  <span className="text-xs font-bold uppercase">{label}</span>
                  <textarea
                    value={editingEntry[key] ?? ''}
                    onChange={(e) =>
                      setRegistry((r) => ({
                        ...r,
                        entries: r.entries.map((en) =>
                          en.id === editingEntry.id ? { ...en, [key]: e.target.value } : en,
                        ),
                      }))
                    }
                    className="w-full border rounded-xl px-3 py-2 text-sm h-16"
                  />
                </label>
              ))}
              <CTAButton size="sm" variant="outline" onClick={() => setEditingId(null)}>
                Done
              </CTAButton>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
