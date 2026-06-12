#!/usr/bin/env node
/**
 * Sync consultation tier scheduleUrl + ctaLabel in channel-landing-pages.json
 * from forced portal packs (runtime source of truth), then manifest CTAs.
 *
 * Usage:
 *   npm run sync:portal-calendly-urls
 *   npm run sync:portal-calendly-urls && npm run sync:portal-data
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, 'data', 'calendly-events.manifest.json');
const PORTAL_PATH = path.join(ROOT, 'data', 'channel-landing-pages.json');
const PACKAGE_PORTAL_PATH = path.join(
  ROOT,
  'packages',
  'booking-crm',
  'data',
  'channel-landing-pages.json',
);

const PORTAL_TIER_TO_KIND = {
  'mentor-intro': 'discovery',
  discovery: 'discovery',
  'career-pathway': 'executive',
  executive: 'executive',
  'services-detail': 'services',
  'design-review': 'services',
};

function resolveUrl(event) {
  return event.urls?.fallback || event.urls?.primary || '';
}

function eventMatchesChannel(event, channelId) {
  return event.channelIds?.length && event.channelIds.includes(channelId);
}

function getEventForChannelTier(events, channelId, tierId) {
  const tierKind = PORTAL_TIER_TO_KIND[tierId] ?? 'discovery';
  const candidates = events.filter(
    (event) => event.tierKind === tierKind && eventMatchesChannel(event, channelId),
  );
  if (!candidates.length) return null;

  const specific = candidates.filter(
    (event) => event.channelIds.length === 1 && event.channelIds[0] === channelId,
  );
  if (specific.length) return specific[0];

  return candidates.sort((a, b) => a.channelIds.length - b.channelIds.length)[0];
}

async function loadPackModules() {
  const { register } = await import('tsx/esm/api');
  register();
  const packPath = path.join(ROOT, 'packages/booking-crm/src/channel-landing-pages/platformOfferPack.ts');
  const scopePath = path.join(ROOT, 'packages/booking-crm/src/channel-landing-pages/platformBrandSources.ts');
  const { getPackConsultationTiers } = await import(pathToFileURL(packPath).href);
  const { IMPLEMENTATION_SCOPE_41 } = await import(pathToFileURL(scopePath).href);
  return { getPackConsultationTiers, IMPLEMENTATION_SCOPE_41 };
}

function syncPortalFile(portalPath, events, getPackConsultationTiers, scope41) {
  const portal = JSON.parse(fs.readFileSync(portalPath, 'utf8'));
  let updatedTiers = 0;

  for (const page of Object.values(portal.pages ?? {})) {
    if (!page.consultationTiers?.length) continue;

    const useForcedPack = scope41.includes(page.channelId);
    const packTiers = useForcedPack ? getPackConsultationTiers(page.channelId) : [];

    for (const tier of page.consultationTiers) {
      const packTier = packTiers.find((t) => t.id === tier.id);
      if (packTier?.scheduleUrl?.trim()) {
        tier.scheduleUrl = packTier.scheduleUrl.trim();
        updatedTiers += 1;
        continue;
      }

      const event = getEventForChannelTier(events, page.channelId, tier.id);
      if (!event) continue;
      const url = resolveUrl(event);
      if (url) {
        tier.scheduleUrl = url;
        updatedTiers += 1;
      }
      if (event.ctaLabel) {
        tier.ctaLabel = event.ctaLabel;
      }
    }
  }

  fs.writeFileSync(portalPath, `${JSON.stringify(portal, null, 2)}\n`, 'utf8');
  return updatedTiers;
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const events = manifest.events ?? [];
  const { getPackConsultationTiers, IMPLEMENTATION_SCOPE_41 } = await loadPackModules();

  const rootUpdates = syncPortalFile(
    PORTAL_PATH,
    events,
    getPackConsultationTiers,
    IMPLEMENTATION_SCOPE_41,
  );
  const pkgUpdates = syncPortalFile(
    PACKAGE_PORTAL_PATH,
    events,
    getPackConsultationTiers,
    IMPLEMENTATION_SCOPE_41,
  );

  console.log(`Synced Calendly URLs in ${PORTAL_PATH} (${rootUpdates} tier rows)`);
  console.log(`Synced Calendly URLs in ${PACKAGE_PORTAL_PATH} (${pkgUpdates} tier rows)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
