'use client';

import React from 'react';
import { Archive, Trash2 } from 'lucide-react';
import { CTAButton } from '@/components/ui/CTAButton';
import type { CertificationRegistryEntry } from '@pms/site-content';

const FAMILY_OPTIONS: CertificationRegistryEntry['familyId'][] = [
  'PMI',
  'PRINCE2',
  'SixSigma',
  'FoundationDirect',
];

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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass = 'w-full border rounded-xl px-3 py-2 text-sm bg-transparent';
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
  const pricing = entry.pricing ?? defaultPricing();
  const pathway = entry.pathwayOutcomes ?? {};

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

  return (
    <div className="p-4 rounded-2xl border border-brand-orange/30 space-y-5 mt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-bold text-lg">{entry.name || entry.id}</h3>
        <div className="flex flex-wrap gap-2">
          <CTAButton size="sm" variant="outline" onClick={onArchive} className="gap-1">
            <Archive className="h-3.5 w-3.5" />
            {entry.archived ? 'Restore' : 'Archive'}
          </CTAButton>
          <CTAButton size="sm" variant="outline" onClick={onRemove} className="gap-1 text-red-600">
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </CTAButton>
          <CTAButton size="sm" variant="outline" onClick={onClose}>
            Done
          </CTAButton>
        </div>
      </div>

      <section className="space-y-3">
        <h4 className="font-semibold text-sm">Basics</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Cert ID (slug)">
            <input
              value={entry.id}
              readOnly
              className={`${inputClass} opacity-70`}
              title="ID cannot change after creation"
            />
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
        <Field label="Short description (hub card)">
          <textarea
            value={entry.desc}
            onChange={(e) => patch({ desc: e.target.value })}
            className={textareaClass}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Brand color (hex)">
            <input
              value={entry.color ?? ''}
              onChange={(e) => patch({ color: e.target.value })}
              placeholder="#6D28D9"
              className={inputClass}
            />
          </Field>
          <Field label="Gradient class">
            <input
              value={entry.gradient ?? ''}
              onChange={(e) => patch({ gradient: e.target.value })}
              placeholder="from-[#D8B4FE] to-[#6D28D9]"
              className={inputClass}
            />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!entry.hidden}
            onChange={(e) => patch({ hidden: !e.target.checked })}
          />
          Listed on certifications hub
        </label>
      </section>

      <section className="space-y-3 border-t pt-4">
        <h4 className="font-semibold text-sm">Display pricing (USD, hub cards)</h4>
        <p className="text-xs text-muted-foreground">
          Checkout amounts still come from regional-catalogue.json. These values appear on pathway cards.
        </p>
        {(['Foundation', 'Professional', 'Elite'] as const).map((tier) => (
          <div key={tier} className="grid gap-2 sm:grid-cols-3 items-end p-3 rounded-xl border border-white/10">
            <span className="text-sm font-bold sm:col-span-3">{tier}</span>
            <Field label="Duration">
              <input
                value={pricing[tier].duration}
                onChange={(e) => patchPricing(tier, 'duration', e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Price (USD)">
              <input
                type="number"
                min={0}
                step={1}
                value={pricing[tier].price}
                onChange={(e) => patchPricing(tier, 'price', e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        ))}
      </section>

      <section className="space-y-3 border-t pt-4">
        <h4 className="font-semibold text-sm">Detail page hero</h4>
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
      </section>

      <section className="space-y-3 border-t pt-4">
        <h4 className="font-semibold text-sm">Exam & dossier</h4>
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
        <Field label="Learning outcomes (one per line)">
          <textarea
            value={arrayToLines(entry.learningOutcomes)}
            onChange={(e) => patch({ learningOutcomes: linesToArray(e.target.value) })}
            className={`${textareaClass} min-h-[6rem]`}
          />
        </Field>
        <Field label="Suggested resources (one per line)">
          <textarea
            value={arrayToLines(entry.suggestedResources)}
            onChange={(e) => patch({ suggestedResources: linesToArray(e.target.value) })}
            className={textareaClass}
          />
        </Field>
      </section>

      <section className="space-y-3 border-t pt-4">
        <h4 className="font-semibold text-sm">Pathway tier outcomes (one bullet per line)</h4>
        {(
          [
            ['foundation', 'Foundation tier'],
            ['professional', 'Professional tier'],
            ['mastery', 'Mastery / Elite tier'],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
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
              className={`${textareaClass} min-h-[5rem]`}
            />
          </Field>
        ))}
      </section>
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
