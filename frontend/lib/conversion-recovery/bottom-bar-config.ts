import { CTAS } from '@/lib/brand-voice';
import { PMS_SKOOL_COMMUNITY_JOIN_URL } from '@/config/pms-site';
import type { BottomBarPageGroup, BottomBarRotation } from './types';
import { getPathwayModalTierOpened } from './session-state';

export function resolvePageGroup(pathname: string): BottomBarPageGroup {
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.startsWith('/certifications/') && pathname.split('/').length >= 3) return 'cert_detail';
  if (pathname.startsWith('/pmp') || pathname.includes('pmp-')) return 'pmp_seo';
  if (pathname.startsWith('/pm-service')) return 'services';
  if (pathname.startsWith('/community')) return 'community';
  if (pathname.startsWith('/membership')) return 'membership';
  if (
    pathname.startsWith('/blog') ||
    pathname.startsWith('/newsletter') ||
    pathname.startsWith('/topics') ||
    pathname.startsWith('/answers')
  ) {
    return 'content';
  }
  if (pathname.startsWith('/checkout') || pathname.startsWith('/admin') || pathname.startsWith('/contact')) {
    return 'excluded';
  }
  return 'marketing_default';
}

function defaultRotations(): BottomBarRotation[] {
  return [
    {
      id: 'r1',
      headline: 'Plan your certification pathway with structure',
      body: 'Independent exam prep across PMI, PRINCE2, and Lean Six Sigma.',
      primary: { type: 'calendly_hero' },
      secondary: { type: 'link', href: '/certifications', label: CTAS.findPathway },
      dismissLabel: 'Not now',
      variant: 'bottom_bar_r1',
    },
    {
      id: 'r2',
      headline: 'PMP 2026 is changing: check readiness',
      body: 'Use the diagnostic or talk to a mentor before exam day.',
      primary: { type: 'link', href: '/pmp-readiness-diagnostic', label: CTAS.readinessCheck },
      secondary: { type: 'link', href: '/pmp-exam-2026', label: 'PMP 2026 guide' },
      dismissLabel: 'Maybe later',
      variant: 'bottom_bar_r2',
    },
    {
      id: 'r3',
      headline: 'Join 1,284+ professionals in the network',
      body: "Don't study in isolation: connect with structured prep circles.",
      primary: { type: 'link', href: PMS_SKOOL_COMMUNITY_JOIN_URL, label: 'Join community' },
      secondary: { type: 'calendly_hero' },
      dismissLabel: 'Skip',
      variant: 'bottom_bar_r3',
    },
    {
      id: 'r4',
      headline: 'Map your roadmap in 24 hours',
      body: "Leave your mobile number: we'll follow up with a structured certification plan.",
      primary: { type: 'micro_form' },
      dismissLabel: "Don't ask again",
      variant: 'bottom_bar_r4',
    },
  ];
}

const GROUP_ROTATIONS: Partial<Record<BottomBarPageGroup, BottomBarRotation[]>> = {
  home: defaultRotations(),
  cert_detail: [
    {
      id: 'cert-r1',
      headline: 'Build your certification roadmap',
      body: "Share your experience: we'll map a study plan for your tier.",
      primary: { type: 'scroll', anchor: 'cert-roadmap-form', label: 'Get my roadmap' },
      secondary: { type: 'calendly_hero' },
      dismissLabel: 'Not now',
      variant: 'bottom_bar_r1',
    },
    ...defaultRotations().slice(1),
  ],
  pmp_seo: [
    {
      id: 'pmp-r1',
      headline: 'PMP 2026: get structured guidance',
      body: 'Compare pathways or check readiness before you commit.',
      primary: { type: 'link', href: '/pmp-readiness-diagnostic', label: CTAS.readinessCheck },
      secondary: { type: 'link', href: '/certifications/pmp', label: 'PMP pathways' },
      dismissLabel: 'Not now',
      variant: 'bottom_bar_r1',
    },
    ...defaultRotations().slice(1, 4),
  ],
  services: [
    {
      id: 'svc-r1',
      headline: 'Elevate your project performance',
      body: 'Talk to us about corporate training, governance, or PM delivery.',
      primary: { type: 'calendly', tier: 'services', label: CTAS.corporateTraining },
      secondary: { type: 'calendly_hero' },
      dismissLabel: 'Not now',
      variant: 'bottom_bar_r1',
    },
    ...defaultRotations().slice(2, 4),
  ],
  community: [
    {
      id: 'comm-r1',
      headline: 'Join the Global PM Network',
      body: 'Connect with professionals in structured study circles.',
      primary: { type: 'link', href: PMS_SKOOL_COMMUNITY_JOIN_URL, label: 'Explore community' },
      secondary: { type: 'calendly_hero' },
      dismissLabel: 'Not now',
      variant: 'bottom_bar_r3',
    },
    ...defaultRotations().slice(3, 4),
  ],
  membership: [
    {
      id: 'mem-r1',
      headline: 'Unlock member pricing and tools',
      body: '20% off regional tuition and premium study resources.',
      primary: { type: 'link', href: '/membership', label: 'View membership' },
      secondary: { type: 'micro_form' },
      dismissLabel: 'Not now',
      variant: 'bottom_bar_r1',
    },
    ...defaultRotations().slice(3, 4),
  ],
  content: defaultRotations(),
  marketing_default: defaultRotations(),
};

export function getRotationsForPath(pathname: string): BottomBarRotation[] {
  const group = resolvePageGroup(pathname);
  if (group === 'excluded') return [];
  const base = GROUP_ROTATIONS[group] ?? defaultRotations();
  const tierOpened = getPathwayModalTierOpened();
  if (group === 'cert_detail' && tierOpened === 'foundation' && base.length > 1) {
    const copy = [...base];
    copy[1] = {
      ...copy[1],
      headline: 'Still thinking about Foundation?',
      body: "Leave your mobile number: we'll follow up before you enroll.",
    };
    return copy;
  }
  return base;
}

export const BOTTOM_BAR_FIRST_DELAY_MS = 30_000;
export const BOTTOM_BAR_ROTATION_DELAY_MS = 30_000;
export const CENTER_DIALOG_BAR_PAUSE_MS = 60_000;