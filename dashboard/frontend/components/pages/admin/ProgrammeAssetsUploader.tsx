'use client';

import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  FileText,
  FileVideo,
  ImageIcon,
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

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange';

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
    hint: 'PDF shown in the pathway preview modal',
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
    hint: 'Orientation clip streamed on the public site',
    accept: 'video/mp4,video/webm,.mp4,.webm',
    formats: 'MP4 or WebM · max 50MB',
    urlKey: 'videoUrl',
    pathKey: 'videoPath',
    Icon: FileVideo,
  },
  {
    kind: 'infographic',
    label: 'Pathway roadmap',
    hint: 'Hero image at the top of the preview modal',
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
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">{row.label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{row.hint}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">
              {row.formats}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide',
            hasFile
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'bg-white/10 text-muted-foreground',
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

      {hasFile && row.kind === 'infographic' ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          <img src={url} alt="" className="max-h-36 w-full object-cover" />
        </div>
      ) : null}

      {hasFile && row.kind === 'video' ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <video
            src={url}
            className="aspect-video w-full object-contain"
            controls
            playsInline
            preload="metadata"
          />
        </div>
      ) : null}

      {hasFile ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-black/10 px-3 py-2.5">
          <p className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{fileName}</p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold hover:border-brand-orange/40 hover:text-brand-orange"
          >
            <ExternalLink className="h-3 w-3" />
            Preview
          </a>
          <button
            type="button"
            onClick={() => void remove()}
            disabled={busy}
            className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
            Remove
          </button>
        </div>
      ) : (
        <div className="mt-3 flex h-24 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/5 text-center text-xs text-muted-foreground">
          <div>
            <Icon className="mx-auto mb-2 h-5 w-5 opacity-40" />
            No file uploaded yet
          </div>
        </div>
      )}

      <label className="mt-3 inline-flex cursor-pointer">
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-opacity',
            busy ? 'cursor-wait bg-brand-orange/70' : 'bg-brand-orange hover:opacity-90',
          )}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              {hasFile ? 'Replace file' : 'Upload file'}
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
      <GlassCard className="p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Offering ID</p>
        <p className="mt-1 font-mono text-sm">{offeringId}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Materials appear in the pathway preview modal for this tier after you publish the registry.
        </p>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
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

      <GlassCard className="p-4">
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Video embed (optional)
          </span>
          <p className="text-xs text-muted-foreground">
            Use YouTube or Vimeo instead of a hosted MP4 when the file is larger than 50MB.
          </p>
          <input
            value={assets.videoEmbedUrl ?? ''}
            onChange={(e) =>
              onChange({
                ...assets,
                videoEmbedUrl: e.target.value.trim() || undefined,
              })
            }
            placeholder="https://www.youtube.com/embed/…"
            className={inputClass}
          />
        </label>
      </GlassCard>
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
    <section className="space-y-4 border-t border-brand-orange/20 pt-5">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">Programme preview media</h4>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Upload guides, slides, videos, and roadmap images for each pathway tier. Files are hosted
          securely and streamed on the public certification pages once you publish.
        </p>
      </div>

      <Tabs defaultValue="foundation" className="gap-4">
        <TabsList
          variant="line"
          className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 no-scrollbar"
        >
          {TIERS.map((tier) => (
            <TabsTrigger
              key={tier}
              value={tier}
              className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground data-active:bg-brand-orange/15 data-active:text-brand-orange"
            >
              {TIER_LABELS[tier]}
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold tabular-nums">
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
    </section>
  );
}
