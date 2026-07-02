import type { ProgrammeOfferingAssets } from './certifications';

/** Static programme files shipped in the repo (also used on the live site before R2 uploads). */
const LEGACY_PROGRAMME_ASSETS: Record<string, ProgrammeOfferingAssets> = {
  'pmp-preparation-foundation': {
    infographicUrl: '/programme/pmp-foundation-roadmap.png',
    guidePdfUrl: '/programme/pmp-foundation-program-guide.pdf',
    slidesPdfUrl: '/programme/pmp-foundation-session-slides.pdf',
    videoUrl: '/videos/programme/pmp-foundation-orientation.mp4',
  },
};

function absolutePublicUrl(path: string, siteBaseUrl?: string): string {
  if (!path.startsWith('/')) return path;
  const base = siteBaseUrl?.replace(/\/$/, '') ?? '';
  return base ? `${base}${path}` : path;
}

/** Bundled programme media for an offering (empty when none). */
export function getLegacyProgrammeAssets(
  offeringId: string,
  siteBaseUrl?: string,
): ProgrammeOfferingAssets {
  const legacy = LEGACY_PROGRAMME_ASSETS[offeringId];
  if (!legacy) return {};

  const out: ProgrammeOfferingAssets = {};
  if (legacy.infographicUrl) {
    out.infographicUrl = absolutePublicUrl(legacy.infographicUrl, siteBaseUrl);
  }
  if (legacy.guidePdfUrl) {
    out.guidePdfUrl = absolutePublicUrl(legacy.guidePdfUrl, siteBaseUrl);
  }
  if (legacy.slidesPdfUrl) {
    out.slidesPdfUrl = absolutePublicUrl(legacy.slidesPdfUrl, siteBaseUrl);
  }
  if (legacy.videoUrl) {
    out.videoUrl = absolutePublicUrl(legacy.videoUrl, siteBaseUrl);
  }
  if (legacy.videoEmbedUrl) {
    out.videoEmbedUrl = legacy.videoEmbedUrl;
  }
  return out;
}

/** CMS registry values override bundled site files. */
export function mergeProgrammeAssets(
  cms: ProgrammeOfferingAssets | undefined | null,
  legacy: ProgrammeOfferingAssets,
): ProgrammeOfferingAssets {
  return {
    ...legacy,
    ...(cms ?? {}),
  };
}

export function effectiveProgrammeAssets(
  offeringId: string,
  cms: ProgrammeOfferingAssets | undefined | null,
  siteBaseUrl?: string,
): ProgrammeOfferingAssets {
  return mergeProgrammeAssets(cms, getLegacyProgrammeAssets(offeringId, siteBaseUrl));
}

const URL_KEYS: (keyof ProgrammeOfferingAssets)[] = [
  'guidePdfUrl',
  'slidesPdfUrl',
  'videoUrl',
  'videoEmbedUrl',
  'infographicUrl',
];

/** True when this URL comes from bundled files, not CMS/R2. */
export function isLegacyProgrammeAssetUrl(
  offeringId: string,
  urlKey: keyof ProgrammeOfferingAssets,
  url: string | undefined,
  cms: ProgrammeOfferingAssets | undefined | null,
  siteBaseUrl?: string,
): boolean {
  if (!url?.trim()) return false;
  if (cms?.[urlKey]) return false;
  const legacy = getLegacyProgrammeAssets(offeringId, siteBaseUrl);
  return legacy[urlKey] === url;
}

export function countProgrammeAssetUrls(assets: ProgrammeOfferingAssets): number {
  return URL_KEYS.filter((key) => {
    const v = assets[key];
    return typeof v === 'string' && v.trim().length > 0;
  }).length;
}
