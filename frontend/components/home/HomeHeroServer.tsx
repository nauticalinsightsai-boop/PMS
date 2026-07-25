import { HOME_COPY } from '@/lib/brand-voice';
import { MARKETING_HERO_H1_CLASS } from '@/lib/brand-visual';
import { T169_SEO } from '@/content/pmp/flagship-t169';
import {
  defaultHomePageConfigV2,
  resolveHomeHeroHeadingLines,
  type HomePageConfigV2,
} from '@pms/site-content';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function resolveHeroSlide(config?: HomePageConfigV2) {
  return (
    config?.heroSlides.find((s) => s.visible) ??
    config?.heroSlides[0] ??
    defaultHomePageConfigV2().heroSlides.find((s) => s.visible) ??
    defaultHomePageConfigV2().heroSlides[0]
  );
}

/** Visible server-rendered hero copy for LCP (no client hydration delay). */
export function HomeHeroServer({ config }: { config?: HomePageConfigV2 }) {
  const slide = resolveHeroSlide(config);
  const cmsHeading = slide.heading?.trim() ?? '';
  // Prefer PMP/certification intent H1 when CMS still has legacy generic headings.
  const legacyGeneric =
    !cmsHeading ||
    /^project management(\s+guidance)?$/i.test(cmsHeading.replace(/\n/g, ' ').trim()) ||
    /^preparation into progress$/i.test(cmsHeading);
  const title = legacyGeneric ? HOME_COPY.heroTitle : cmsHeading;
  const headingLines = resolveHomeHeroHeadingLines(title);

  return (
    <div className="relative z-30 min-w-0 overflow-x-clip">
      <Badge className="mb-4 sm:mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
        {HOME_COPY.heroBadge}
      </Badge>

      <h1
        id="home-hero-title"
        className={cn(
          MARKETING_HERO_H1_CLASS,
          'mb-3 sm:mb-4 max-w-full text-balance lg:text-6xl xl:text-7xl',
        )}
      >
        {headingLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <p className="sr-only">{T169_SEO.homeDescription}</p>
    </div>
  );
}
