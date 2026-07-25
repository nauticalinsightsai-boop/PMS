import { trackGaEvent, type GaEventParams } from '@/lib/analytics/send-ga-event';
import {
  getUtmParamsForEvents,
  goPortalParamsFromPath,
  getPageContext,
} from '@/lib/analytics/funnel';

export type AnalyticsItem = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | null | undefined | AnalyticsItem[]
>;

/**
 * Consent-gated GA4 event with UTM + page context.
 * Strips PII via `trackGaEvent` / `sanitizeGaParams`.
 */
export function pushAnalyticsEvent(event: string, params: AnalyticsEventParams = {}): boolean {
  const ctx = getPageContext(
    typeof params.page_path === 'string' ? String(params.page_path) : undefined,
  );
  const goParams = goPortalParamsFromPath(ctx.page_path);
  const flat: GaEventParams = {
    ...getUtmParamsForEvents(),
    page_path: ctx.page_path,
    page_identifier: ctx.page_identifier ?? undefined,
    ...(goParams ?? {}),
  };

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    flat[key] = value;
  }

  return trackGaEvent(event, flat);
}
