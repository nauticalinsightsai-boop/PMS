import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { PmpExam2026LiveBanner } from '@/components/pmp/PmpExam2026LiveBanner';
import { PmpPackageTierPositioning } from '@/components/pmp/PmpPackageTierPositioning';
import { PmpRoadmapCtaLink, ComparePathwaysCtaLink } from '@/components/pmp/PmpRoadmapCtaLink';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { Pmp2026PathwayJsonLd } from '@/components/seo/Pmp2026PathwayJsonLd';
import { buttonVariants } from '@/components/ui/button';
import { T169_HERO } from '@/content/pmp/flagship-t169';
import { PMP_PATHWAY_PAGE } from '@/content/pmp/pathway-page';
import { cn } from '@/lib/utils';

const Pmp2026FlagshipSections = dynamic(
  () =>
    import('@/components/home/Pmp2026FlagshipSections').then((m) => ({
      default: m.Pmp2026FlagshipSections,
    })),
  { loading: () => null },
);

const pathwayBreadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'PMP', href: '/pmp' },
  { label: PMP_PATHWAY_PAGE.shortLabel },
] as const;

export function Pmp2026PathwayPage() {
  return (
    <>
      <Pmp2026PathwayJsonLd />
      <PmpExam2026LiveBanner />
      <section className={cn(sectionSurface('purple', 'py-16 sm:py-20'))}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto max-w-3xl px-4">
          <Breadcrumbs items={[...pathwayBreadcrumbs]} />
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-purple">
            {T169_HERO.eyebrow}
          </p>
          <h1 className="font-heading mb-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {PMP_PATHWAY_PAGE.h1}
          </h1>
          <p className="mb-4 text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
            {T169_HERO.body}
          </p>
          <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">{T169_HERO.microcopy}</p>
          <div className="mb-6 flex flex-col flex-wrap gap-3 sm:flex-row">
            <PmpRoadmapCtaLink size="lg" />
            <ComparePathwaysCtaLink size="lg" />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Need exam tables and domain detail?{' '}
            <Link href="/pmp-exam-2026" className="font-bold text-brand-purple hover:underline">
              Read the PMP exam 2026 deep guide
            </Link>
          </p>
        </div>
      </section>
      <PmpPackageTierPositioning />
      <Pmp2026FlagshipSections />
      <section className="border-t border-slate-100 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="container mx-auto flex flex-col items-center gap-3 px-4 text-center sm:flex-row sm:justify-center">
          <PmpRoadmapCtaLink size="lg" />
          <Link href="/pmp-exam-2026" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
            PMP exam 2026 deep guide
          </Link>
        </div>
      </section>
    </>
  );
}
