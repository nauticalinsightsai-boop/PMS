'use client';

import React, { useMemo, useState } from 'react';
import { Archive, ExternalLink, Trash2 } from 'lucide-react';
import { CTAButton } from '@/components/ui/CTAButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  offeringIdForCertTier,
  type CertificationRegistryEntry,
} from '@pms/site-content';
import { ProgrammeAssetsUploader } from '@/components/pages/admin/ProgrammeAssetsUploader';
import { siteUrl } from '@/lib/site-config';
import { cn } from '@/lib/utils';

const FAMILY_OPTIONS: CertificationRegistryEntry['familyId'][] = [
  'PMI',
  'PRINCE2',
  'SixSigma',
  'FoundationDirect',
];

const EDITOR_TABS = [
  { id: 'basics', label: 'Basics', hint: 'Hub card & listing' },
  { id: 'pricing', label: 'Pricing', hint: 'Display tiers' },
  { id: 'hero', label: 'Hero & CTA', hint: 'Detail page hero' },
  { id: 'exam', label: 'Exam & dossier', hint: 'Detail sections' },
  { id: 'outcomes', label: 'Outcomes', hint: 'Pathway bullets' },
  { id: 'video', label: 'Video', hint: 'Preview modal' },
  { id: 'documents', label: 'Documents', hint: 'PDFs & roadmap' },
] as const;

type EditorTab = (typeof EDITOR_TABS)[number]['id'];

function defaultPricing(): NonNullable<CertificationRegistryEntry['pricing']> {
  return {
    Foundation: { duration: '1 wk', price: 0 },
    Professional: { duration: '4 wks', price: 0 },
    Elite: { duration: '8 wks', price: 0 },
  };
}

function linesToArray(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[] | undefined): string {
  return (value ?? []).join('\n');
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {children}
    </label>
  );
}

function SectionIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 rounded-xl border border-border bg-muted/25 px-4 py-4 sm:px-5">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 sm:p-5 space-y-4', className)}>
      {children}
    </div>
  );
}

const inputClass = 'dashboard-input';
const textareaClass = `${inputClass} min-h-[4.5rem] resize-y`;

export function CertificationRegistryEntryEditor({
  entry,
  onChange,
  onClose,
  onRemove,
  onArchive,
}: {
  entry: CertificationRegistryEntry;
  onChange: (next: CertificationRegistryEntry) => void;
  onClose: () => void;
  onRemove: () => void;
  onArchive: () => void;
}) {
  const [tab, setTab] = useState<EditorTab>('basics');
  const pricing = entry.pricing ?? defaultPricing();
  const pathway = entry.pathwayOutcomes ?? {};
  const isWideTab = tab === 'video' || tab === 'documents';

  const videoLiveCount = useMemo(() => {
    const assets = entry.programmeAssets ?? {};
    return (['foundation', 'professional', 'mastery'] as const).filter((tier) => {
      const offeringId = offeringIdForCertTier(entry.id, tier);
      const row = assets[offeringId];
      return Boolean(row?.videoUrl || row?.videoEmbedUrl?.trim());
    }).length;
  }, [entry.id, entry.programmeAssets]);

  const patch = (partial: Partial<CertificationRegistryEntry>) => onChange({ ...entry, ...partial });

  const patchPricing = (
    tier: keyof NonNullable<CertificationRegistryEntry['pricing']>,
    field: 'duration' | 'price',
    value: string,
  ) => {
    patch({
      pricing: {
        ...pricing,
        [tier]: {
          ...pricing[tier],
          [field]: field === 'price' ? Number(value) || 0 : value,
        },
      },
    });
  };

  const livePageUrl = `${siteUrl.replace(/\/$/, '')}/certifications/${entry.id}`;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-brand-orange/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide text-brand-orange">
              {entry.familyId}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{entry.id}</span>
            {entry.archived ? (
              <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">
                Archived
              </span>
            ) : null}
            {!entry.hidden ? (
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                Listed
              </span>
            ) : null}
          </div>
          <h3 id="pathway-editor-title" className="truncate font-heading text-xl font-bold tracking-tight">
            {entry.name || entry.id}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{entry.desc || 'No short description yet.'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={livePageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-brand-orange/40 hover:text-brand-orange"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View live page
          </a>
          <CTAButton size="sm" variant="outline" onClick={onArchive} className="gap-1">
            <Archive className="h-3.5 w-3.5" />
            {entry.archived ? 'Restore' : 'Archive'}
          </CTAButton>
          <CTAButton size="sm" variant="outline" onClick={onRemove} className="gap-1 text-red-600">
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </CTAButton>
          <CTAButton size="sm" onClick={onClose}>
            Done
          </CTAButton>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as EditorTab)}
        className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden"
      >
        <div className="shrink-0 border-b border-border bg-card/80 px-4 sm:px-6">
          <TabsList
            variant="line"
            className="h-auto w-full justify-start gap-0.5 overflow-x-auto bg-transparent p-0 py-1 no-scrollbar"
          >
            {EDITOR_TABS.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className="group shrink-0 flex-none flex-col items-start gap-0 rounded-lg px-3 py-2.5 text-left data-active:bg-accent/60"
              >
                <span className="text-xs font-semibold sm:text-sm">{item.label}</span>
                <span className="hidden text-[10px] text-muted-foreground group-data-active:text-foreground/70 sm:block">
                  {item.hint}
                  {item.id === 'video' ? ` · ${videoLiveCount}/3 live` : ''}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-muted/15 px-4 py-5 sm:px-6 md:py-6">
          <div className={cn('mx-auto w-full', isWideTab ? 'max-w-6xl' : 'max-w-3xl')}>
            <TabsContent value="basics" className="mt-0 outline-none">
              <SectionIntro
                title="Basics"
                description="Name, family, and hub card appearance on /certifications. Publish the registry for changes to appear on the live site."
              />
              <Panel>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Cert ID (slug)" hint="Fixed after creation">
                    <input value={entry.id} readOnly className={cn(inputClass, 'opacity-70')} />
                  </Field>
                  <Field label="Family">
                    <select
                      value={entry.familyId}
                      onChange={(e) =>
                        patch({ familyId: e.target.value as CertificationRegistryEntry['familyId'] })
                      }
                      className={inputClass}
                    >
                      {FAMILY_OPTIONS.map((id) => (
                        <option key={id} value={id}>
                          {id}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Display name">
                  <input
                    value={entry.name}
                    onChange={(e) => patch({ name: e.target.value })}
                    className={inputClass}
                  />
                </Field>
                <Field label="Short description" hint="Shown on hub cards and search">
                  <textarea
                    value={entry.desc}
                    onChange={(e) => patch({ desc: e.target.value })}
                    className={textareaClass}
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Brand color" hint="Hex for accents">
                    <input
                      value={entry.color ?? ''}
                      onChange={(e) => patch({ color: e.target.value })}
                      placeholder="#6D28D9"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Gradient class" hint="Tailwind gradient utilities">
                    <input
                      value={entry.gradient ?? ''}
                      onChange={(e) => patch({ gradient: e.target.value })}
                      placeholder="from-[#D8B4FE] to-[#6D28D9]"
                      className={inputClass}
                    />
                  </Field>
                </div>
                <label className="flex items-center gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={!entry.hidden}
                    onChange={(e) => patch({ hidden: !e.target.checked })}
                  />
                  Listed on certifications hub
                </label>
              </Panel>
            </TabsContent>

            <TabsContent value="pricing" className="mt-0 outline-none">
              <SectionIntro
                title="Display pricing"
                description="Reference pricing for internal planning. Live checkout and tuition chips on the site still use regional-catalogue.json."
              />
              <div className="space-y-3">
                {(['Foundation', 'Professional', 'Elite'] as const).map((tier) => (
                  <Panel key={tier} className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr] sm:items-end">
                    <p className="text-sm font-bold sm:col-span-3">{tier} tier</p>
                    <Field label="Duration label">
                      <input
                        value={pricing[tier].duration}
                        onChange={(e) => patchPricing(tier, 'duration', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Reference price (USD)">
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={pricing[tier].price}
                        onChange={(e) => patchPricing(tier, 'price', e.target.value)}
                        className={inputClass}
                      />
                    </Field>
                  </Panel>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hero" className="mt-0 outline-none">
              <SectionIntro
                title="Detail page hero"
                description="Headline and value props at the top of /certifications/[id]. Maps to the public certification detail hero."
              />
              <Panel className="space-y-4">
                {(
                  [
                    ['detailHeroTitle', 'Hero title'],
                    ['detailHeroSubtitle', 'Hero subtitle'],
                    ['outputValue', 'Primary value line'],
                    ['recommendedCta', 'Recommended CTA'],
                    ['targetAudience', 'Target audience'],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <textarea
                      value={entry[key] ?? ''}
                      onChange={(e) => patch({ [key]: e.target.value })}
                      className={textareaClass}
                    />
                  </Field>
                ))}
              </Panel>
            </TabsContent>

            <TabsContent value="exam" className="mt-0 outline-none">
              <SectionIntro
                title="Exam & dossier"
                description="Prerequisites, exam format, fees, and learning outcomes on the certification detail page."
              />
              <Panel className="space-y-4">
                {(
                  [
                    ['prerequisites', 'Prerequisites'],
                    ['examFormat', 'Exam format'],
                    ['registrationSteps', 'Registration steps'],
                    ['officialFee', 'Official exam fee'],
                    ['trainingPriceRange', 'Training price range'],
                    ['regionalDemand', 'Regional demand'],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={label}>
                    <textarea
                      value={entry[key] ?? ''}
                      onChange={(e) => patch({ [key]: e.target.value })}
                      className={textareaClass}
                    />
                  </Field>
                ))}
                <Field label="Learning outcomes" hint="One per line">
                  <textarea
                    value={arrayToLines(entry.learningOutcomes)}
                    onChange={(e) => patch({ learningOutcomes: linesToArray(e.target.value) })}
                    className={cn(textareaClass, 'min-h-[6rem]')}
                  />
                </Field>
                <Field label="Suggested resources" hint="One per line">
                  <textarea
                    value={arrayToLines(entry.suggestedResources)}
                    onChange={(e) => patch({ suggestedResources: linesToArray(e.target.value) })}
                    className={textareaClass}
                  />
                </Field>
              </Panel>
            </TabsContent>

            <TabsContent value="outcomes" className="mt-0 outline-none">
              <SectionIntro
                title="Pathway tier outcomes"
                description="Bullet lists shown on pathway tier cards and preview modals on the detail page."
              />
              <div className="space-y-4">
                {(
                  [
                    ['foundation', 'Foundation tier'],
                    ['professional', 'Professional tier'],
                    ['mastery', 'Mastery / Elite tier'],
                  ] as const
                ).map(([key, label]) => (
                  <Panel key={key}>
                    <Field label={label} hint="One outcome per line">
                      <textarea
                        value={arrayToLines(pathway[key])}
                        onChange={(e) =>
                          patch({
                            pathwayOutcomes: {
                              ...pathway,
                              [key]: linesToArray(e.target.value),
                            },
                          })
                        }
                        className={cn(textareaClass, 'min-h-[5rem]')}
                      />
                    </Field>
                  </Panel>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="video" className="mt-0 outline-none">
              <SectionIntro
                title="Overview videos"
                description="Upload MP4/WebM to Cloudflare R2 or paste a YouTube/Vimeo embed URL for each tier. Self-hosted files are served from your R2 bucket on the live certification page."
              />
              <ProgrammeAssetsUploader entry={entry} onChange={onChange} mode="video" />
            </TabsContent>

            <TabsContent value="documents" className="mt-0 outline-none">
              <SectionIntro
                title="Programme documents"
                description="PDF guides, session slides, and roadmap images for each tier — stored on Cloudflare R2 and shown alongside video in the pathway preview modal."
              />
              <ProgrammeAssetsUploader entry={entry} onChange={onChange} mode="documents" />
            </TabsContent>
          </div>
        </div>

        <div className="shrink-0 border-t border-border bg-card px-4 py-3 text-xs text-muted-foreground sm:px-6">
          Save draft, then <strong className="font-semibold text-foreground">Publish</strong> on the certifications
          page to update the live site. Videos and documents require both upload and publish.
        </div>
      </Tabs>
    </div>
  );
}

export function emptyCertificationEntry(
  partial: Pick<CertificationRegistryEntry, 'id' | 'name' | 'familyId' | 'desc'>,
  sortOrder: number,
): CertificationRegistryEntry {
  return {
    ...partial,
    hidden: false,
    archived: false,
    sortOrder,
    pricing: defaultPricing(),
    detailHeroTitle: `${partial.name} Pathway`,
    detailHeroSubtitle: partial.desc,
    outputValue: '',
    recommendedCta: '',
    targetAudience: '',
    prerequisites: '',
    examFormat: '',
    registrationSteps: '',
    officialFee: '',
    trainingPriceRange: '',
    learningOutcomes: [],
    pathwayOutcomes: { foundation: [], professional: [], mastery: [] },
    suggestedResources: [],
    regionalDemand: '',
  };
}
