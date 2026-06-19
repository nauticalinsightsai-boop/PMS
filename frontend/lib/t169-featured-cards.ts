import { T169_FEATURED_CARDS } from '@/content/pmp/flagship-t169';
import { PMP_ROADMAP_CTA_HREF, PMP_ROADMAP_CTA_LABEL } from '@/lib/pmp-roadmap-cta';
import type { PathwayFeaturedCardProps } from '@/components/PathwayFeaturedCard';

function waitlistHref(certId: string): string {
  return `/contact?topic=waitlist&offering=${encodeURIComponent(certId)}`;
}

type FeaturedOverride = Pick<
  PathwayFeaturedCardProps,
  'badgeLabel' | 'metaLine' | 'ctaLabel' | 'ctaHref' | 'title' | 'description'
>;

const CARD_MAP: Record<string, FeaturedOverride> = {
  pmp: {
    badgeLabel: T169_FEATURED_CARDS.pmp.badge,
    title: T169_FEATURED_CARDS.pmp.title,
    description: T169_FEATURED_CARDS.pmp.description,
    ctaLabel: PMP_ROADMAP_CTA_LABEL,
    ctaHref: PMP_ROADMAP_CTA_HREF,
  },
  prince2: {
    badgeLabel: T169_FEATURED_CARDS.prince2.badge,
    title: T169_FEATURED_CARDS.prince2.title,
    description: T169_FEATURED_CARDS.prince2.description,
    ctaLabel: T169_FEATURED_CARDS.prince2.cta,
    ctaHref: waitlistHref('prince2'),
  },
  'lss-green': {
    badgeLabel: T169_FEATURED_CARDS.lssGreen.badge,
    title: T169_FEATURED_CARDS.lssGreen.title,
    description: T169_FEATURED_CARDS.lssGreen.description,
    ctaLabel: T169_FEATURED_CARDS.lssGreen.cta,
    ctaHref: waitlistHref('lss-green'),
  },
  'pmi-rmp': {
    badgeLabel: T169_FEATURED_CARDS.pmiRmp.badge,
    title: T169_FEATURED_CARDS.pmiRmp.title,
    description: T169_FEATURED_CARDS.pmiRmp.description,
    ctaLabel: T169_FEATURED_CARDS.pmiRmp.cta,
    ctaHref: waitlistHref('pmi-rmp'),
  },
};

export function getT169FeaturedCardOverrides(certId: string): FeaturedOverride | undefined {
  return CARD_MAP[certId];
}
