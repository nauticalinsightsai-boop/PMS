import type { FaqClusterId } from './types';

export type FaqHubSection = {
  id: string;
  label: string;
  clusterIds: FaqClusterId[];
};

/** Grouped tabs for /faq. PMP-first (Phase 10). */
export const FAQ_HUB_SECTIONS: FaqHubSection[] = [
  {
    id: 'pmp-2026',
    label: 'PMP 2026',
    clusterIds: ['pmp2026'],
  },
  {
    id: 'about-pathways',
    label: 'About & pathways',
    clusterIds: ['about', 'pathways', 'timeline'],
  },
  {
    id: 'pricing-membership',
    label: 'Pricing & membership',
    clusterIds: ['pricing', 'membership', 'consultation'],
  },
  {
    id: 'delivery-exams',
    label: 'Delivery & exams',
    clusterIds: ['delivery', 'exams'],
  },
  {
    id: 'privacy',
    label: 'Privacy & policies',
    clusterIds: ['privacy'],
  },
  {
    id: 'support-geo',
    label: 'Support & discovery',
    clusterIds: ['support', 'geo'],
  },
];

export function getFaqHubSectionForCluster(clusterId: FaqClusterId): string | undefined {
  return FAQ_HUB_SECTIONS.find((s) => s.clusterIds.includes(clusterId))?.id;
}