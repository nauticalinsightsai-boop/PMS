import type { CalendlyUtmParams } from '@/lib/calendly/embed-types';
import { getUtmParamsForLead } from '@/lib/analytics/funnel';

/** Site-owned UTM sources that must not overwrite inbound ads UTMs. */
const INTERNAL_UTM_SOURCES = new Set([
  'pmstructure',
  'nav',
  'home',
  'pathway',
  'bottom_bar',
  'fab',
  'certifications',
  'compare',
  'faq',
  'about',
  'support_chat',
  'success_page',
  'keyword_popup',
  'recovery',
]);

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

function isInternalSource(source?: string): boolean {
  if (!source) return true;
  const s = source.trim().toLowerCase();
  if (INTERNAL_UTM_SOURCES.has(s)) return true;
  if (s.startsWith('bottom_bar')) return true;
  return false;
}

/**
 * Prefer inbound advertising UTMs (session) over site-nav labels like pmstructure/nav/home.
 * Fill gaps from `passed` only when advertising values are absent.
 */
export function mergeCalendlyUtmWithInbound(passed?: CalendlyUtmParams): CalendlyUtmParams {
  const inbound = getUtmParamsForLead();
  const out: CalendlyUtmParams = { ...(passed ?? {}) };

  const inboundSource = inbound.utm_source;
  const preferInbound = Boolean(inboundSource) && !isInternalSource(inboundSource);

  for (const key of UTM_KEYS) {
    const inboundVal = inbound[key];
    const passedVal = out[key];
    if (preferInbound && inboundVal) {
      out[key] = inboundVal;
      continue;
    }
    if (!passedVal && inboundVal) {
      out[key] = inboundVal;
    }
  }

  return out;
}
