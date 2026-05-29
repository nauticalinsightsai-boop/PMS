import { describe, expect, it } from 'vitest';
import {
  defaultHomePageConfigV2,
  homePageConfigV2Schema,
  normalizeHomeConfigV1ToV2,
  safeParseHomePageConfig,
} from './home';

describe('home config', () => {
  it('default v2 passes schema', () => {
    const cfg = defaultHomePageConfigV2();
    expect(homePageConfigV2Schema.parse(cfg).version).toBe(2);
  });

  it('normalizes v1 without version', () => {
    const v1 = {
      heroSlides: [
        {
          id: 1,
          visible: true,
          heading: 'Test',
          description: 'Desc',
          primaryCta: 'Go',
          primaryLink: '/contact',
          secondaryCta: 'Find',
          secondaryLink: '/certifications',
        },
      ],
    };
    const v2 = normalizeHomeConfigV1ToV2(v1);
    expect(v2.version).toBe(2);
    expect(v2.stats.professionalsCount).toBe(1284);
    expect(v2.heroSlides[0].primaryAction).toBe('contact');
  });

  it('preserves featured cert ids from legacy featuredItems', () => {
    const v1 = {
      heroSlides: defaultHomePageConfigV2().heroSlides,
      featuredItems: {
        showProjects: true,
        showConsultancies: false,
        showVentures: false,
        selectedProjectIds: ['pmp', 'capm'],
        selectedConsultancyIds: [],
        selectedVentureIds: [],
      },
    };
    const v2 = normalizeHomeConfigV1ToV2(v1);
    expect(v2.featuredPathways.certIds).toEqual(['pmp', 'capm']);
  });

  it('safeParse accepts normalized config', () => {
    const result = safeParseHomePageConfig({ heroSlides: [] });
    expect(result.success).toBe(false);
    const ok = safeParseHomePageConfig(defaultHomePageConfigV2());
    expect(ok.success).toBe(true);
  });
});
