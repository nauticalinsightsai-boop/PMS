import { HOME_COPY } from '@/lib/brand-voice';
import { T169_SEO } from '@/content/pmp/flagship-t169';
import { defaultHomePageConfigV2 } from '@pms/site-content';

const defaultSlide =
  defaultHomePageConfigV2().heroSlides.find((s) => s.visible) ??
  defaultHomePageConfigV2().heroSlides[0];

/** Server-rendered crawlable copy before client hydration. */
export function HomeServerHeading() {
  const title = defaultSlide.heading || HOME_COPY.heroTitle;
  const subtitle = defaultSlide.description || HOME_COPY.heroSubtitle;

  return (
    <header className="sr-only">
      <h1 id="home-hero-title">{title}</h1>
      <p>{subtitle}</p>
      <p>{T169_SEO.homeDescription}</p>
    </header>
  );
}
