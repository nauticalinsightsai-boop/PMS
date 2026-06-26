'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  FileText,
  FileVideo,
  ImageIcon,
  Info,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  offeringIdForCertTier,
  type CertificationRegistryEntry,
  type ProgrammeOfferingAssets,
} from '@pms/site-content';
import {
  deleteProgrammeMediaFile,
  uploadProgrammeMediaFile,
} from '@/lib/cms/programme-media-api';

type Tier = 'foundation' | 'professional' | 'mastery';
type AssetKind = 'guide' | 'slides' | 'video' | 'infographic';

const TIER_LABELS: Record<Tier, string> = {
  foundation: 'Foundation',
  professional: 'Professional',
  mastery: 'Mastery / Elite',
};

const ASSET_ROWS: Array<{
  kind: AssetKind;
  label: string;
  hint: string;
  accept: string;
  formats: string;
  urlKey: keyof ProgrammeOfferingAssets;
  pathKey: keyof ProgrammeOfferingAssets;
  Icon: typeof FileText;
}> = [
  {
    kind: 'guide',
    label: 'Programme guide',
    hint: 'PDF in pathway preview modal',
    accept: 'application/pdf,.pdf',
    formats: 'PDF · max 50MB',
    urlKey: 'guidePdfUrl',
    pathKey: 'guidePdfPath',
    Icon: FileText,
  },
  {
    kind: 'slides',
    label: 'Session slides',
    hint: 'Lesson deck for in-modal viewing',
    accept: 'application/pdf,.pdf',
    formats: 'PDF · max 50MB',
    urlKey: 'slidesPdfUrl',
    pathKey: 'slidesPdfPath',
    Icon: FileText,
  },
  {
    kind: 'video',
    label: 'Overview video',
    hint: 'Streamed on the public site',
    accept: 'video/mp4,video/webm,.mp4,.webm',
    formats: 'MP4 or WebM · max 50MB',
    urlKey: 'videoUrl',
    pathKey: 'videoPath',
    Icon: FileVideo,
  },
  {
    kind: 'infographic',
    label: 'Pathway roadmap',
    hint: 'Hero image in preview modal',
    accept: 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp',
    formats: 'PNG, JPG, or WebP',
    urlKey: 'infographicUrl',
    pathKey: 'infographicPath',
    Icon: ImageIcon,
  },
];

function fileNameFromStorage(path?: string, url?: string): string {
  const source = path || url || '';
  if (!source) return 'Uploaded file';
  const segment = source.split('/').pop() ?? '';
  return decodeURIComponent(segment);
}

function tierAssetCount(assets: ProgrammeOfferingAssets): number {
  return ASSET_ROWS.filter((row) => assets[row.urlKey]).length;
}

function AssetRow({
  certId,
  tier,
  row,
  assets,
  onChange,
}: {
  certId: string;
  tier: Tier;
  row: (typeof ASSET_ROWS)[number];
  assets: ProgrammeOfferingAssets;
  onChange: (next: ProgrammeOfferingAssets) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = assets[row.urlKey] as string | undefined;
  const path = assets[row.pathKey] as string | undefined;
  const hasFile = Boolean(url);
  const fileName = fileNameFromStorage(path, url);
  const Icon = row.Icon;

  const upload = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { path: storagePath, url: publicUrl } = await uploadProgrammeMediaFile({
        file,
        certId,
        tier,
        kind: row.kind,
      });
      onChange({
        ...assets,
        [row.urlKey]: publicUrl,
        [row.pathKey]: storagePath,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Remove ${row.label.toLowerCase()} for this tier?`)) return;
    setBusy(true);
    setError(null);
    try {
      if (path) await deleteProgrammeMediaFile(path);
      const next = { ...assets };
      delete next[row.urlKey];
      delete next[row.pathKey];
      onChange(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <GlassCard variant="flat" animateEntry={false} className="flex h-full flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">{row.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{row.hint}</p>
            <p className="mt-1 text-[10px] font-medium text-muted-foreground">{row.formats}</p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
            hasFile
              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {hasFile ? (
            <>
              <CheckCircle2 className="h-3 w-3" />
              Live
            </>
          ) : (
            <>
              <CircleDashed className="h-3 w-3" />
              Empty
            </>
          )}
        </span>
      </div>

      <div className="mt-3 min-h-[7rem] flex-1">
        {hasFile && row.kind === 'infographic' ? (
          <div className="overflow-hidden rounded-lg border border-border bg-muted/30">
            <img src={url} alt="" className="max-h-28 w-full object-cover" />
          </div>
        ) : null}

        {hasFile && row.kind === 'video' ? (
          <div className="overflow-hidden rounded-lg border border-border bg-black/20">
            <video src={url} className="aspect-video w-full object-contain" controls playsInline preload="metadata" />
          </div>
        ) : null}

        {hasFile && row.kind !== 'infographic' && row.kind !== 'video' ? (
          <div className="flex h-full min-h-[5rem] items-center rounded-lg border border-border bg-muted/20 px-3 py-2">
            <p className="truncate font-mono text-xs text-muted-foreground">{fileName}</p>
          </div>
        ) : null}

        {!hasFile ? (
          <div className="flex h-full min-h-[5rem] items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 text-center text-xs text-muted-foreground">
            No file yet
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="inline-flex cursor-pointer">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white',
              busy ? 'cursor-wait bg-brand-orange/70' : 'bg-brand-orange hover:opacity-90',
            )}
          >
            {busy ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                {hasFile ? 'Replace' : 'Upload'}
              </>
            )}
          </span>
          <input
            type="file"
            accept={row.accept}
            className="hidden"
            disabled={busy}
            onChange={(e) => void upload(e.target.files?.[0] ?? null)}
          />
        </label>
        {hasFile ? (
          <>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
            >
              <ExternalLink className="h-3 w-3" />
              Open
            </a>
            <button
              type="button"
              onClick={() => void remove()}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-500/10 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              Remove
            </button>
          </>
        ) : null}
      </div>

      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </GlassCard>
  );
}

function TierPanel({
  certId,
  tier,
  offeringId,
  assets,
  onChange,
}: {
  certId: string;
  tier: Tier;
  offeringId: string;
  assets: ProgrammeOfferingAssets;
  onChange: (next: ProgrammeOfferingAssets) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <div>
          <p className="text-label">Offering ID</p>
          <p className="mt-1 font-mono text-sm">{offeringId}</p>
        </div>
        <p className="max-w-xl text-xs text-muted-foreground">
          Materials appear in the pathway preview modal after you publish the registry.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ASSET_ROWS.map((row) => (
          <AssetRow
            key={row.kind}
            certId={certId}
            tier={tier}
            row={row}
            assets={assets}
            onChange={onChange}
          />
        ))}
      </div>

      <div className="flex gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-orange" aria-hidden />
        <p>
          Keep videos self-hosted (MP4/WebM above) so playback stays on pmstructure.com. Over 50MB? Compress with{' '}
          <a
            href="https://handbrake.fr/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-orange underline-offset-2 hover:underline"
          >
            HandBrake
          </a>{' '}
          (H.264, 720p) before uploading.
        </p>
      </div>
    </div>
  );
}

const TIERS = ['foundation', 'professional', 'mastery'] as const;

export function ProgrammeAssetsUploader({
  entry,
  onChange,
}: {
  entry: CertificationRegistryEntry;
  onChange: (next: CertificationRegistryEntry) => void;
}) {
  const programmeAssets = entry.programmeAssets ?? {};

  const tierCounts = useMemo(
    () =>
      Object.fromEntries(
        TIERS.map((tier) => {
          const offeringId = offeringIdForCertTier(entry.id, tier);
          return [tier, tierAssetCount(programmeAssets[offeringId] ?? {})];
        }),
      ) as Record<Tier, number>,
    [entry.id, programmeAssets],
  );

  const patchTier = (tier: Tier, offeringId: string, assets: ProgrammeOfferingAssets) => {
    onChange({
      ...entry,
      programmeAssets: {
        ...programmeAssets,
        [offeringId]: assets,
      },
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="foundation" className="gap-4">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-1 overflow-x-auto border-b border-border bg-transparent p-0 pb-2 no-scrollbar"
        >
          {TIERS.map((tier) => (
            <TabsTrigger
              key={tier}
              value={tier}
              className="inline-flex shrink-0 items-center rounded-md px-3 py-2 text-sm font-medium data-active:bg-accent data-active:text-accent-foreground"
            >
              {TIER_LABELS[tier]}
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold tabular-nums">
                {tierCounts[tier]}/4
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TIERS.map((tier) => {
          const offeringId = offeringIdForCertTier(entry.id, tier);
          const assets = programmeAssets[offeringId] ?? {};
          return (
            <TabsContent key={tier} value={tier} className="mt-0 outline-none">
              <TierPanel
                certId={entry.id}
                tier={tier}
                offeringId={offeringId}
                assets={assets}
                onChange={(next) => patchTier(tier, offeringId, next)}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
