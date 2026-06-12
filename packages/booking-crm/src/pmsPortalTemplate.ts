import type {
  ChannelLandingPage,
  ConsultationTier,
  PortalEngagement,
} from './types/channelLandingPage';
import { slugifyChannelKey, CHANNEL_PUBLIC_SLUG } from './types/channelLandingPage';
import { getChannelById } from './constants/channelGroups';
import { SERVICES_TIER_TITLE } from './channel-landing-pages/portalTierTitles';

export const PMS_TEMPLATE_VERSION = 4;

const LEGACY_TIER_IDS = new Set(['discovery', 'executive', 'design-review']);

const PUBLIC_TIER_IDS = ['mentor-intro', 'career-pathway', 'services-detail'] as const;

/** Webinar `/go/webinar` exposes free intro + paid pathway only (no services tier). */
export const WEBINAR_TWO_TIER_CHANNEL = 'webinar';

export function publicTierIdsForChannel(channelKey: string): readonly string[] {
  if (channelKey === WEBINAR_TWO_TIER_CHANNEL) {
    return ['mentor-intro', 'career-pathway'];
  }
  return PUBLIC_TIER_IDS;
}

export function expectedConsultationTierCount(channelKey: string): number {
  return publicTierIdsForChannel(channelKey).length;
}

export function buildDefaultPortalEngagement(): PortalEngagement {
  return {
    templateVersion: PMS_TEMPLATE_VERSION,
    featuredCertIds: ['pmp', 'pmi-rmp'],
    showExplorePathways: false,
    showComparePathways: false,
    showCommunityLink: false,
    showMembershipLink: true,
    showStoreLink: true,
  };
}

export function buildDefaultConsultationTiers(channelKey: string): ConsultationTier[] {
  const channel = getChannelById(channelKey);
  const label = channel?.label ?? channelKey;

  const tiers = [
    {
      id: 'mentor-intro',
      title: 'Free Mentor Intro',
      description:
        'Quick conversation on certification goal, timeline, and which pathway fits your experience. Cite how you found us when you book.',
      durationLabel: '15 Minutes',
      priceLabel: 'Free',
      isFree: true,
      recommended: false,
      ctaLabel: 'Talk to a mentor',
    },
    {
      id: 'career-pathway',
      title: 'Career & Pathway Session',
      description: `Structured mentor block for exam prep, pathway choice, and career direction: aligned to how you found us on ${label}.`,
      durationLabel: '30 Minutes',
      priceLabel: 'Paid',
      recommended: true,
      badge: 'Most Popular' as const,
      ctaLabel: 'Book pathway session',
    },
    {
      id: 'services-detail',
      title: SERVICES_TIER_TITLE,
      description:
        'Review PMO services, delivery consulting, or programs you selected on the Project Management Structure website: scope, fit, and next steps with a mentor.',
      durationLabel: '45 Minutes',
      priceLabel: 'Paid',
      recommended: false,
      ctaLabel: 'Discuss services',
    },
  ] satisfies ConsultationTier[];

  const allowed = new Set(publicTierIdsForChannel(channelKey));
  return tiers.filter((t) => allowed.has(t.id));
}

function mapLegacyTierId(id: string): string {
  if (id === 'discovery') return 'mentor-intro';
  if (id === 'executive') return 'career-pathway';
  if (id === 'design-review' || id === 'services-detail') return 'services-detail';
  return id;
}

function filterPublicTiers(tiers: ConsultationTier[], channelKey: string): ConsultationTier[] {
  const tierIds = publicTierIdsForChannel(channelKey);
  const byId = new Map<string, ConsultationTier>();

  for (const t of tiers) {
    const id = mapLegacyTierId(t.id);
    if (!tierIds.includes(id)) continue;
    const existing = byId.get(id);
    if (!existing) {
      byId.set(id, { ...t, id });
    } else if (!existing.scheduleUrl && t.scheduleUrl) {
      byId.set(id, { ...existing, scheduleUrl: t.scheduleUrl, priceLabel: t.priceLabel || existing.priceLabel });
    }
  }

  const defaults = buildDefaultConsultationTiers(channelKey);
  const out = tierIds.map((id) => {
    const saved = byId.get(id);
    const def = defaults.find((d) => d.id === id)!;
    if (!saved) return def;
    return {
      ...def,
      ...saved,
      id,
      isFree: id === 'mentor-intro' ? true : saved.isFree,
      priceLabel: id === 'mentor-intro' ? 'Free' : saved.priceLabel || def.priceLabel,
      recommended: id === 'career-pathway',
      badge: id === 'career-pathway' ? saved.badge ?? 'Most Popular' : undefined,
      ctaLabel: saved.ctaLabel ?? def.ctaLabel,
      title: saved.title?.trim() || def.title,
    };
  });

  return out.length === tierIds.length ? out : defaults;
}

export function migratePageToPmsPortalTemplate(page: ChannelLandingPage): ChannelLandingPage {
  const engagement = page.portalEngagement ?? buildDefaultPortalEngagement();

  const expectedTierCount = expectedConsultationTierCount(page.channelKey);
  const needsTemplate =
    engagement.templateVersion < PMS_TEMPLATE_VERSION ||
    page.consultationTiers.some((t) => LEGACY_TIER_IDS.has(t.id)) ||
    page.consultationTiers.length !== expectedTierCount;

  const defaults = buildDefaultConsultationTiers(page.channelKey);

  if (!needsTemplate) {
    return {
      ...page,
      portalEngagement: { ...buildDefaultPortalEngagement(), ...engagement, templateVersion: PMS_TEMPLATE_VERSION },
      consultationTiers: filterPublicTiers(page.consultationTiers, page.channelKey),
    };
  }

  const merged = defaults.map((def) => {
    const existing = page.consultationTiers.find(
      (t) => t.id === def.id || mapLegacyTierId(t.id) === def.id,
    );
    if (!existing) return def;
    const idChanged = mapLegacyTierId(existing.id) !== existing.id;
    return {
      ...def,
      ...existing,
      id: def.id,
      title: def.title,
      isFree: def.id === 'mentor-intro' ? true : existing.isFree,
      durationLabel: idChanged ? def.durationLabel : existing.durationLabel || def.durationLabel,
      scheduleUrl: existing.scheduleUrl ?? def.scheduleUrl,
      priceLabel:
        def.id === 'mentor-intro'
          ? 'Free'
          : existing.priceLabel && existing.priceLabel !== 'Free'
            ? existing.priceLabel
            : def.priceLabel,
      recommended: def.id === 'career-pathway',
      badge: def.id === 'career-pathway' ? existing.badge ?? 'Most Popular' : undefined,
      ctaLabel: existing.ctaLabel ?? def.ctaLabel,
    };
  });

  const channel = getChannelById(page.channelKey);
  const contextLabel =
    page.contextLabel?.trim() ||
    (channel ? `FROM ${channel.label.toUpperCase()}` : 'FROM THIS CHANNEL');

  return {
    ...page,
    portalEngagement: { ...buildDefaultPortalEngagement(), ...engagement, templateVersion: PMS_TEMPLATE_VERSION },
    contextLabel,
    headline: page.headline?.includes('Book a session')
      ? `${page.label} · Pathway session`
      : page.headline,
    subheadline: page.subheadline?.includes('advisory')
      ? 'Mentor-led certification preparation and career guidance.'
      : page.subheadline,
    showSyncBanner: false,
    availabilityLabel: page.availabilityLabel?.includes('advisory')
      ? 'Mentor sessions open'
      : page.availabilityLabel,
    consultationTiers: filterPublicTiers(merged, page.channelKey),
    slug: page.slug || CHANNEL_PUBLIC_SLUG[page.channelKey] || slugifyChannelKey(page.channelKey),
  };
}

export function assertPmsPortalTemplate(page: ChannelLandingPage): void {
  const eng = page.portalEngagement;
  if (!eng || eng.templateVersion < PMS_TEMPLATE_VERSION) {
    throw new Error('portalEngagement.templateVersion must be >= 4');
  }
  const requiredIds = publicTierIdsForChannel(page.channelKey);
  if (page.consultationTiers.length !== requiredIds.length) {
    throw new Error(
      `Exactly ${requiredIds.length} consultation tiers are required for ${page.channelKey}`,
    );
  }
  const ids = page.consultationTiers.map((t) => t.id);
  for (const id of requiredIds) {
    if (!ids.includes(id)) throw new Error(`Missing required tier: ${id}`);
  }
}