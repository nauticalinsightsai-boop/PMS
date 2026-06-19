import type { JoinWaitlistContext } from '@/components/forms/JoinWaitlistDialog';

export function isWaitlistContactHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed.startsWith('/contact')) return false;
  const queryIndex = trimmed.indexOf('?');
  const query = queryIndex >= 0 ? trimmed.slice(queryIndex + 1) : '';
  return new URLSearchParams(query).get('topic') === 'waitlist';
}

export function parseWaitlistOfferingFromHref(href: string): string | undefined {
  const queryIndex = href.indexOf('?');
  if (queryIndex < 0) return undefined;
  const offering = new URLSearchParams(href.slice(queryIndex + 1)).get('offering');
  return offering?.trim() || undefined;
}

export function buildFeaturedCardWaitlistContext(
  certId: string,
  label: string,
  href: string,
): JoinWaitlistContext {
  const offeringId = parseWaitlistOfferingFromHref(href) ?? certId;
  return {
    headline: label,
    subject: `Waitlist: ${offeringId}`,
    offeringId,
    siteCertId: certId,
    formId: 'pathway_waitlist',
    formLabel: 'Pathway waitlist',
    placement: `Featured card: ${certId}`,
  };
}

export function buildGeneralWaitlistContext(
  headline: string,
  placement: string,
  offeringId?: string,
): JoinWaitlistContext {
  return {
    headline,
    subject: `Waitlist: ${headline}`,
    offeringId,
    formId: 'pathway_waitlist',
    formLabel: 'Pathway waitlist',
    placement,
  };
}
