import {
  MEDIA_SOCIAL_GRID,
  normalizeSocialProfileUrl,
  type MediaSocialGridItem,
} from '@/constants/socialProfiles';
import { buildCtaChannelsMediaSocialGrid } from '@/lib/media/build-cta-channels-social-grid';

function mergeCmsSocialOverrides(
  baseline: MediaSocialGridItem[],
  grid: Array<{ url?: string; name?: string; channelId?: string }>,
): MediaSocialGridItem[] {
  const overrides = new Map<string, { url?: string; name?: string }>();
  for (const row of grid) {
    const key = (row.channelId ?? row.name ?? '').trim().toLowerCase();
    if (!key) continue;
    overrides.set(key, row);
    if (row.channelId) overrides.set(row.channelId.toLowerCase(), row);
  }

  return baseline.map((item) => {
    const keys = [item.channelId?.toLowerCase(), item.name.toLowerCase()].filter(Boolean) as string[];
    const override = keys.map((k) => overrides.get(k)).find(Boolean);
    if (!override) return item;
    const url =
      typeof override.url === 'string' && override.url.trim()
        ? normalizeSocialProfileUrl(override.url.trim())
        : item.url;
    const name = override.name?.trim() || item.name;
    return url === item.url && name === item.name ? item : { ...item, url, name };
  });
}

export function normalizeMediaSocialGrid<T extends { url?: string; name?: string; channelId?: string }>(
  grid: T[],
): T[] {
  const defaultsByChannelId = new Map(
    buildCtaChannelsMediaSocialGrid().map((item) => [item.channelId ?? item.name.toLowerCase(), item.url]),
  );
  const defaultsByName = new Map(
    buildCtaChannelsMediaSocialGrid().map((item) => [item.name.toLowerCase(), item.url]),
  );

  return grid.map((item) => {
    const channelKey = item.channelId?.toLowerCase();
    const nameKey = item.name?.toLowerCase();
    const canonical =
      (channelKey && defaultsByChannelId.get(channelKey)) ||
      (nameKey && defaultsByName.get(nameKey)) ||
      (nameKey && MEDIA_SOCIAL_GRID.find((m) => m.name.toLowerCase() === nameKey)?.url);
    const rawUrl = typeof item.url === 'string' ? item.url : '';
    const url = canonical ?? normalizeSocialProfileUrl(rawUrl);
    return url === item.url ? item : { ...item, url };
  });
}

/** Defaults to all CTA Management channels; CMS rows override URLs/names by channelId. */
export function resolveMediaSocialGrid<T extends { url?: string; name?: string; channelId?: string }>(
  grid: T[] | undefined | null,
): MediaSocialGridItem[] {
  const baseline = buildCtaChannelsMediaSocialGrid();
  if (!Array.isArray(grid) || grid.length === 0) {
    return baseline;
  }
  const normalized = normalizeMediaSocialGrid(grid) as unknown as MediaSocialGridItem[];
  if (normalized.length >= baseline.length) {
    return normalized;
  }
  return mergeCmsSocialOverrides(baseline, normalized);
}
