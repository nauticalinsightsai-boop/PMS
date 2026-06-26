'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  GripVertical,
  Plus,
  Save,
  Search,
  Send,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { DashboardPageHeader } from '@/components/layout/DashboardPageHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';
import { previewStorageKey } from '@/lib/usePublishedSiteDocument';
import {
  CertificationRegistryEntryEditor,
  emptyCertificationEntry,
} from '@/components/pages/admin/CertificationRegistryEntryEditor';

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
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2"
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
  const [registryQuery, setRegistryQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

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
          'Could not load draft data from Supabase. Showing defaults: saves may fail until connection is fixed.',
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
    () => registry.entries.filter((e) => !e.archived && !e.hidden).map((e) => e.id),
    [registry.entries],
  );

  const filteredEntries = useMemo(() => {
    const q = registryQuery.trim().toLowerCase();
    return registry.entries
      .filter((e) => (showArchived ? true : !e.archived))
      .filter((e) => {
        if (!q) return true;
        return (
          e.id.toLowerCase().includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.familyId.toLowerCase().includes(q) ||
          e.desc.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [registry.entries, registryQuery, showArchived]);

  const hasChanges = baseline !== JSON.stringify({ hub, registry });

  const saveBoth = async (publish: boolean) => {
    const hubCheck = validateFieldContent(FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG, hub);
    const regCheck = validateFieldContent(FIELD_KEYS.CERTIFICATIONS_REGISTRY, registry);
    if (!hubCheck.success || !regCheck.success) {
      setSyncStatus('error');
      alert('Validation failed: check hub and registry fields.');
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
    const entry = emptyCertificationEntry(
      {
        id,
        name: wizard.name.trim(),
        familyId: wizard.familyId,
        desc: wizard.desc.trim(),
      },
      registry.entries.length,
    );
    setRegistry((r) => ({
      ...r,
      entries: [...r.entries, entry],
    }));
    setWizardOpen(false);
    setWizard({ id: '', name: '', familyId: 'PMI', desc: '' });
    setEditingId(id);
  };

  const updateEntry = (next: CertificationRegistryEntry) => {
    setRegistry((r) => ({
      ...r,
      entries: r.entries.map((e) => (e.id === next.id ? next : e)),
    }));
  };

  const removeEntry = (id: string) => {
    const entry = registry.entries.find((e) => e.id === id);
    if (!entry) return;
    if (!window.confirm(`Permanently remove "${entry.name}" (${id}) from the registry?`)) return;
    setRegistry((r) => ({
      ...r,
      entries: r.entries.filter((e) => e.id !== id).map((e, i) => ({ ...e, sortOrder: i })),
    }));
    if (editingId === id) setEditingId(null);
  };

  const toggleArchive = (id: string) => {
    setRegistry((r) => ({
      ...r,
      entries: r.entries.map((e) => (e.id === id ? { ...e, archived: !e.archived, hidden: e.archived ? e.hidden : true } : e)),
    }));
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading certifications CMS…</div>;

  const editingEntry = editingId ? registry.entries.find((e) => e.id === editingId) : null;

  return (
    <div className="space-y-5">
      {loadError && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          {loadError}
        </p>
      )}

      <DashboardPageHeader
        title="Certifications CMS"
        description="Manage pathway listings, pricing display, dossier copy, and programme media. Save draft, then publish to update the live site."
        actions={
          <>
            <SyncStatusIndicator status={syncStatus} lastSynced={updatedAt} />
            <CTAButton variant="outline" size="sm" onClick={openPreview} className="gap-2 normal-case tracking-normal">
              <Eye className="h-4 w-4" /> Preview
            </CTAButton>
            <CTAButton variant="outline" size="sm" onClick={() => saveBoth(false)} disabled={!hasChanges} className="gap-2 normal-case tracking-normal">
              <Save className="h-4 w-4" /> Save draft
            </CTAButton>
            <CTAButton size="sm" onClick={() => saveBoth(true)} className="gap-2 normal-case tracking-normal">
              <Send className="h-4 w-4" /> Publish
            </CTAButton>
          </>
        }
      />

      <div className="dashboard-segmented w-fit">
        {(['hub', 'registry'] as const).map((t) => (
          <button
            key={t}
            type="button"
            data-active={tab === t}
            onClick={() => setTab(t)}
            className="dashboard-segmented-btn capitalize"
          >
            {t === 'hub' ? 'Hub & flagships' : `Registry (${registry.entries.length})`}
          </button>
        ))}
      </div>

      {tab === 'hub' && (
        <GlassCard variant="flat" animateEntry={false} className="p-5 space-y-6">
          <section className="space-y-3">
            <h2 className="font-bold">Hero</h2>
            {(['badge', 'title', 'subtitle'] as const).map((key) => (
              <input
                key={key}
                value={hub.hero[key]}
                onChange={(e) => setHub((c) => ({ ...c, hero: { ...c.hero, [key]: e.target.value } }))}
                placeholder={key}
                className="dashboard-input"
              />
            ))}
          </section>
          <section className="space-y-3 border-t pt-4">
            <h2 className="font-bold">Listing section</h2>
            {(['title', 'subtitle'] as const).map((key) => (
              <input
                key={key}
                value={hub.listing[key]}
                onChange={(e) =>
                  setHub((c) => ({ ...c, listing: { ...c.listing, [key]: e.target.value } }))
                }
                placeholder={`listing ${key}`}
                className="dashboard-input"
              />
            ))}
          </section>
          {FAMILIES.map((familyId) => (
            <section key={familyId} className="space-y-3 border-t pt-4">
              <h2 className="font-bold">{familyId}: flagship row (drag to reorder)</h2>
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
        <GlassCard variant="flat" animateEntry={false} className="p-5 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <p className="text-sm text-muted-foreground">
              {registry.entries.length} pathways · edit pricing, dossier, and marketing copy. Save draft then
              publish to update the live site.
            </p>
            <CTAButton size="sm" onClick={() => setWizardOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" /> Add pathway
            </CTAButton>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[12rem]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={registryQuery}
                onChange={(e) => setRegistryQuery(e.target.value)}
                placeholder="Search by id, name, family…"
                className="dashboard-input pl-9"
              />
            </div>
            <label className="flex items-center gap-2 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
              />
              Show archived
            </label>
          </div>

          <div className="max-h-[32rem] overflow-y-auto space-y-2">
            {filteredEntries.map((entry) => {
              const idx = registry.entries.findIndex((e) => e.id === entry.id);
              return (
                <div
                  key={entry.id}
                  className={cn(
                    'flex flex-wrap items-center gap-2 rounded-lg border p-3 text-sm transition-colors',
                    entry.archived
                      ? 'border-border/60 bg-muted/20 opacity-70'
                      : 'border-border bg-background hover:bg-muted/30',
                  )}
                >
                  <span className="font-mono font-bold min-w-[7rem] text-xs">{entry.id}</span>
                  <span className="flex-1 min-w-[8rem] truncate font-medium">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">{entry.familyId}</span>
                  {entry.pricing && (
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      F ${entry.pricing.Foundation.price} · P ${entry.pricing.Professional.price} · E $
                      {entry.pricing.Elite.price}
                    </span>
                  )}
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={!entry.hidden}
                      disabled={entry.archived}
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
                    className="text-brand-orange font-bold text-xs px-2 py-1 rounded-lg hover:bg-brand-orange/10"
                    onClick={() => setEditingId(entry.id)}
                  >
                    Edit
                  </button>
                </div>
              );
            })}
            {!filteredEntries.length && (
              <p className="text-sm text-muted-foreground py-6 text-center">No pathways match your filters.</p>
            )}
          </div>
        </GlassCard>
      )}

      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="sm:max-w-lg bg-background border-border">
          <DialogHeader>
            <DialogTitle>Add pathway</DialogTitle>
            <DialogDescription>
              Creates a full registry record with default pricing tiers. Regional checkout still uses
              regional-catalogue.json for live enroll buttons.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <input
              value={wizard.id}
              onChange={(e) => setWizard((w) => ({ ...w, id: e.target.value }))}
              placeholder="cert-id (e.g. new-pathway)"
              className="dashboard-input"
            />
            <input
              value={wizard.name}
              onChange={(e) => setWizard((w) => ({ ...w, name: e.target.value }))}
              placeholder="Display name"
              className="dashboard-input"
            />
            <select
              value={wizard.familyId}
              onChange={(e) =>
                setWizard((w) => ({ ...w, familyId: e.target.value as CertificationRegistryEntry['familyId'] }))
              }
              className="dashboard-input"
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
              className="dashboard-input h-20"
            />
            <div className="flex gap-2 justify-end pt-2">
              <CTAButton size="sm" variant="outline" onClick={() => setWizardOpen(false)}>
                Cancel
              </CTAButton>
              <CTAButton size="sm" onClick={addCert}>
                Add to registry
              </CTAButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingEntry)} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[min(92vh,920px)] w-[min(96vw,56rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none"
        >
          {editingEntry ? (
            <CertificationRegistryEntryEditor
              entry={editingEntry}
              onChange={updateEntry}
              onClose={() => setEditingId(null)}
              onRemove={() => removeEntry(editingEntry.id)}
              onArchive={() => toggleArchive(editingEntry.id)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}