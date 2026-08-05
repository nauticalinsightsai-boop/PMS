import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const pushAnalyticsEvent = vi.hoisted(() => vi.fn(() => true));

vi.mock('@/lib/analytics/push-event', () => ({ pushAnalyticsEvent }));

import { emitScholarshipPageViewAnalytics } from './ScholarshipEnrollment';

const componentSource = fs.readFileSync(
  path.resolve(__dirname, 'ScholarshipEnrollment.tsx'),
  'utf8',
);
const serviceSource = fs.readFileSync(
  path.resolve(__dirname, '../../services/scholarship.ts'),
  'utf8',
);

describe('ScholarshipEnrollmentPage analytics-only page view', () => {
  beforeEach(() => {
    pushAnalyticsEvent.mockClear();
    vi.stubGlobal('fetch', vi.fn());
  });

  it('keeps the consent-aware scholarship_page_view event without a network write', () => {
    const result = emitScholarshipPageViewAnalytics({
      offeringId: 'pmp-professional-usd-scholarship',
      tierSlug: 'professional',
      market: 'global',
    });

    expect(result).toBe(true);
    expect(pushAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(pushAnalyticsEvent).toHaveBeenCalledWith('scholarship_page_view', {
      offering_id: 'pmp-professional-usd-scholarship',
      scholarship_market: 'global',
      pathway_level: 'professional',
    });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('contains no passive scholarship-events client or service call', () => {
    expect(componentSource).not.toContain('recordScholarshipPageView');
    expect(componentSource).not.toContain('/api/scholarship/events');
    expect(serviceSource).not.toContain('recordScholarshipPageView');
    expect(serviceSource).not.toContain('/api/scholarship/events');
    expect(componentSource).toContain("pushAnalyticsEvent('scholarship_page_view'");
    expect(componentSource).toContain('emitScholarshipPageViewAnalytics(props);');
  });
});
