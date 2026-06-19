import { HOME_COPY } from '@/lib/brand-voice';
import { T169_SEO } from '@/content/pmp/flagship-t169';
import { defaultHomePageConfigV2, resolveHomeHeroHeadingLines, type HomePageConfigV2 } from '@pms/site-content';

/** Server-rendered crawlable copy before client hydration. */
export function HomeServerHeading({ config }: { config?: HomePageConfigV2 }) {
  const slide =
    config?.heroSlides.find((s) => s.visible) ??
    config?.heroSlides[0] ??
    defaultHomePageConfigV2().heroSlides.find((s) => s.visible) ??
    defaultHomePageConfigV2().heroSlides[0];

  const title = slide.heading || HOME_COPY.heroTitle;
  const headingLines = resolveHomeHeroHeadingLines(title);
  const subtitle = slide.description || HOME_COPY.heroSubtitle;
  const accents = HOME_COPY.heroTitleAccents.join(', ');

  return (
    <header className="sr-only">
      <h1 id="home-hero-title">
        {headingLines.map((line, index) => (
          <span key={line} className={index === 0 ? 'block whitespace-nowrap' : 'block'}>
            {line}
          </span>
        ))}
      </h1>
      <p>{accents}</p>
      <p>{subtitle}</p>
      <p>{T169_SEO.homeDescription}</p>
    </header>
  );
}
