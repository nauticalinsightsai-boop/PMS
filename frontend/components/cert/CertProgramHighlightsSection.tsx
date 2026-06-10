'use client';

import { motion } from 'motion/react';
import {
  Award,
  BookOpen,
  Map,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Video,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import {
  CERT_ROADMAP_FORM_ANCHOR,
  ROADMAP_CTA_LABEL_MOBILE,
  type CertProgramOffer,
} from '@/lib/cert-program-offer';
import { ResponsiveSnapScroll } from '@/components/ResponsiveSnapScroll';

const HIGHLIGHT_ICONS: Record<string, typeof Video> = {
  'live-training': Video,
  coaching: PhoneCall,
  pdus: Award,
  'exam-prep': Award,
  roadmap: Map,
  mastermind: Users,
  'last-day': BookOpen,
  governance: ShieldCheck,
  dmaic: Target,
};

type CertProgramHighlightsProps = {
  offer: CertProgramOffer;
  roadmapAnchor?: string;
  className?: string;
  /** Cert detail page: form is in hero — hide redundant scroll CTAs */
  embedded?: boolean;
};

const certRoadmapCtaClassName =
  'inline-flex min-h-14 h-auto w-full items-center justify-center whitespace-normal px-5 py-3 text-center text-base font-bold leading-snug shadow-lg shadow-brand-orange/25 sm:w-auto sm:px-8 sm:py-0 sm:whitespace-nowrap sm:text-base';

export function CertRoadmapCta({
  anchor,
  label,
  mobileLabel = ROADMAP_CTA_LABEL_MOBILE,
  className,
  rounded = 'full',
}: {
  anchor: string;
  label: string;
  mobileLabel?: string;
  className?: string;
  rounded?: 'full' | '2xl';
}) {
  return (
    <a
      href={`#${anchor}`}
      className={cn(
        buttonVariants({ size: 'lg', variant: 'brand' }),
        certRoadmapCtaClassName,
        rounded === '2xl' ? 'rounded-2xl sm:text-lg' : 'rounded-full',
        className,
      )}
    >
      <span className="sm:hidden">{mobileLabel}</span>
      <span className="hidden sm:inline">{label}</span>
    </a>
  );
}

export function CertProgramHighlightsContent({
  offer,
  roadmapAnchor = CERT_ROADMAP_FORM_ANCHOR,
  className,
  embedded = false,
}: CertProgramHighlightsProps) {
  return (
    <div className={cn('relative z-10', className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 sm:mb-14 rounded-[2rem] border border-brand-orange/25 bg-gradient-to-br from-brand-orange/10 via-white to-brand-purple/5 p-[40px] dark:from-brand-orange/10 dark:via-slate-900 dark:to-brand-purple/10 dark:border-brand-orange/20"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange">
              <ShieldCheck className="h-7 w-7" aria-hidden />
            </div>
            <div>
              <Badge className="mb-2 border-none bg-brand-orange/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                Our differentiator
              </Badge>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
                {offer.differentiatorHeadline}
              </h2>
              <p className="mt-2 max-w-2xl text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                {offer.differentiatorSubline}
              </p>
            </div>
          </div>
          {!embedded ? (
            <CertRoadmapCta
              anchor={roadmapAnchor}
              label={offer.ctaLabel}
              className="w-full shrink-0 md:w-auto"
            />
          ) : null}
        </div>
      </motion.div>

      <ResponsiveSnapScroll
        desktopLayoutClassName="md:grid md:grid-cols-2 lg:grid-cols-3"
        gapClassName="gap-6 lg:gap-8"
        mobileItemClassName="w-[min(92vw,18rem)]"
      >
        {offer.highlights.map((item, index) => {
          const Icon = HIGHLIGHT_ICONS[item.id] ?? Sparkles;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex h-full min-h-0 w-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
            >
              <div className="mb-4 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mb-2 shrink-0 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="min-h-0 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 max-md:line-clamp-5">
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </ResponsiveSnapScroll>

      {!embedded ? (
        <div className="mt-10 flex justify-center sm:mt-14">
          <CertRoadmapCta anchor={roadmapAnchor} label={offer.ctaLabel} />
        </div>
      ) : null}
    </div>
  );
}

export function CertProgramHighlightsSection({
  offer,
  roadmapAnchor = CERT_ROADMAP_FORM_ANCHOR,
  className,
}: CertProgramHighlightsProps) {
  return (
    <section className={cn(sectionSurface('warm', 'py-16 sm:py-20 md:py-24 lg:py-28'), className)}>
      <SectionAmbience tone="warm" />
      <div className="container relative z-10 mx-auto">
        <CertProgramHighlightsContent offer={offer} roadmapAnchor={roadmapAnchor} />
      </div>
    </section>
  );
}
