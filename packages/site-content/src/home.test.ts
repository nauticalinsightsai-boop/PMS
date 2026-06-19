import { describe, expect, it } from 'vitest';
import {
  defaultHomePageConfigV2,
  homePageConfigV2Schema,
  normalizeHomeConfigV1ToV2,
  resolveHomeHeroSubtitle,
  parseHomeHeroHeadingLines,
  normalizeHomeHeroHeading,
  DEFAULT_HOME_HERO_HEADING,
  safeParseHomePageConfig,
  DEFAULT_HOME_HERO_SUBTITLE,
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

  it('infers calendly action for consultation contact links', () => {
    const v2 = normalizeHomeConfigV1ToV2({
      heroSlides: [
        {
          id: 1,
          visible: true,
          heading: 'Test',
          description: 'Desc',
          primaryCta: 'Reserve your consultation',
          primaryLink: '/contact?topic=consultation',
          secondaryCta: 'Find',
          secondaryLink: '/certifications',
        },
      ],
    });
    expect(v2.heroSlides[0].primaryAction).toBe('calendly');
  });

  it('default hero uses roadmap CTA', () => {
    const cfg = defaultHomePageConfigV2();
    expect(cfg.heroSlides[0].primaryAction).toBe('link');
    expect(cfg.heroSlides[0].primaryCta).toBe('Get My PMP 2026 Roadmap');
    expect(cfg.heroSlides[0].heading).toBe(DEFAULT_HOME_HERO_HEADING);
    expect(cfg.heroSlides[0].description).toBe(DEFAULT_HOME_HERO_SUBTITLE);
    expect(cfg.stats.professionalsCount).toBe(1284);
    expect(cfg.sections.testimonials).toBe(false);
    expect(cfg.instituteSection.institute.title).toBe('Ready to Start Your Journey?');
  });

  it('parseHomeHeroHeadingLines splits two-line default and migrates legacy single line', () => {
    expect(parseHomeHeroHeadingLines(DEFAULT_HOME_HERO_HEADING)).toEqual([
      'Project management',
      'guidance',
    ]);
    expect(parseHomeHeroHeadingLines('Project management guidance')).toEqual([
      'Project management',
      'guidance',
    ]);
    expect(normalizeHomeHeroHeading('Project management guidance')).toBe(DEFAULT_HOME_HERO_HEADING);
  });

  it('resolveHomeHeroSubtitle migrates lean-down PMP one-liner copy', () => {
    const legacy =
      'The PMP exam changes on 9 July 2026 — get a structured readiness route with mentor-led support, not random study noise.';
    expect(resolveHomeHeroSubtitle(legacy)).toBe(DEFAULT_HOME_HERO_SUBTITLE);
  });

  it('resolveHomeHeroSubtitle migrates legacy paragraph copy', () => {
    const legacy =
      'The PMP exam changes on 9 July 2026. PM Structure helps working professionals decide whether they are preparing for the current or updated exam, map their eligibility, organize study effort, and track readiness with mentor-led structure.';
    expect(resolveHomeHeroSubtitle(legacy)).toBe(
      defaultHomePageConfigV2().heroSlides[0].description,
    );
  });

  it('migrates legacy published hero copy to lean-down defaults', () => {
    const v2 = normalizeHomeConfigV1ToV2({
      version: 2,
      heroSlides: [
        {
          id: 1,
          visible: true,
          heading: 'Prepare for the PMP exam change with a clear route, not random study noise.',
          description:
            'The PMP exam changes on 9 July 2026. PM Structure helps working professionals decide whether they are preparing for the current or updated exam, map their eligibility, organize study effort, and track readiness with mentor-led structure.',
          primaryCta: 'Get My PMP 2026 Roadmap',
          primaryAction: 'link',
          primaryLink: '/#pmp-roadmap-form',
          secondaryCta: 'Compare Certification Pathways',
          secondaryLink: '/certifications/compare',
        },
      ],
      instituteSection: {
        type: 'institute',
        institute: { title: 'Institute', subtitle: '', description: '', ctaText: '', ctaLink: '' },
        engagement: { title: 'Engagement', subtitle: '', description: '', ctaText: '', ctaLink: '' },
        speaking: { title: 'Speaking', subtitle: '', description: '', ctaText: '', ctaLink: '' },
      },
    });
    expect(v2.heroSlides[0].heading).toBe(DEFAULT_HOME_HERO_HEADING);
    expect(v2.heroSlides[0].description).toBe(DEFAULT_HOME_HERO_SUBTITLE);
    expect(v2.heroSlides[0].secondaryCta).toBe('Compare certifications');
    expect(v2.instituteSection.institute.title).toBe('Ready to Start Your Journey?');
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
