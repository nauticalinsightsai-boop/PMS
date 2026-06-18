import { PMP_ROADMAP_FORM_ANCHOR } from '@/content/pmp/program-offer';
import { T169_CTAS } from '@/content/pmp/flagship-t169';

export const PMP_ROADMAP_CTA_HREF = `/#${PMP_ROADMAP_FORM_ANCHOR}`;
export const PMP_ROADMAP_CTA_LABEL = T169_CTAS.primary;
export const COMPARE_PATHWAYS_HREF = '/certifications/compare';
export const COMPARE_PATHWAYS_CTA_LABEL = T169_CTAS.secondary;

export function scrollToPmpRoadmapForm(): void {
  const el = document.getElementById(PMP_ROADMAP_FORM_ANCHOR);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (window.location.pathname !== '/') {
    window.location.href = PMP_ROADMAP_CTA_HREF;
  }
}
