'use client';

import { motion } from 'motion/react';
import { ExternalLink, Mail, MessageCircle } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMS_SUPPORT_EMAIL, getPmsWhatsAppDisplay, getPmsWhatsAppUrl, isWhatsAppConfigured } from '@/config/pms-site';
import { SITE_SOCIAL_PROFILE_URLS } from '@/config/site';
import {
  PMP_PROGRAM_CTA_LABEL,
  PMP_ROADMAP_FORM_ANCHOR,
} from '@/content/pmp/program-offer';
import { T176_TESTIMONIAL_PLACEHOLDER } from '@/content/t176-claims';
import { trackRoadmapCtaClick } from '@/lib/analytics/track-roadmap-cta';
import { trackContactClick } from '@/lib/analytics/track-contact-click';

type PmpProgramSocialProofSectionProps = {
  roadmapAnchor?: string;
  showContactBar?: boolean;
  className?: string;
};

function PmpRoadmapCta({ anchor, className }: { anchor: string; className?: string }) {
  return (
    <a
      href={`#${anchor}`}
      onClick={() =>
        trackRoadmapCtaClick({
          ctaText: PMP_PROGRAM_CTA_LABEL,
          ctaLocation: 'body',
        })
      }
      className={cn(
        buttonVariants({ size: 'lg', variant: 'brand' }),
        'inline-flex h-14 items-center justify-center rounded-full px-8 text-base font-bold shadow-lg shadow-brand-orange/25',
        className,
      )}
    >
      {PMP_PROGRAM_CTA_LABEL}
    </a>
  );
}

export function PmpProgramSocialProofSection({
  roadmapAnchor = PMP_ROADMAP_FORM_ANCHOR,
  showContactBar = false,
  className,
}: PmpProgramSocialProofSectionProps) {
  const whatsappHref = getPmsWhatsAppUrl();
  const successStoriesHref = SITE_SOCIAL_PROFILE_URLS.youtube;

  return (
    <div className={className}>
      <section className={sectionSurface('soft', 'py-16 sm:py-20 md:py-24 lg:py-28')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-section font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Learner feedback
          </h2>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Permission pending — not verified testimonials
          </p>
          <p className="text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400 mb-10">
            {T176_TESTIMONIAL_PLACEHOLDER}
          </p>
          <PmpRoadmapCta anchor={roadmapAnchor} />
        </div>
      </section>

      {showContactBar ? (
        <section className="border-y border-slate-100 bg-slate-900 py-12 text-white dark:border-slate-800 dark:bg-slate-950 sm:py-14">
          <div className="container mx-auto">
            <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
              <div className="space-y-4">
                <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Ready to start your PMP journey?
                </h2>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
                  {isWhatsAppConfigured() ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackContactClick({
                          contactMethod: 'whatsapp',
                          contactContext: 'roadmap',
                          ctaText: 'WhatsApp',
                        })
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold transition-colors hover:bg-white/10"
                    >
                      <MessageCircle className="h-5 w-5 text-green-400" aria-hidden />
                      WhatsApp: {getPmsWhatsAppDisplay()}
                    </a>
                  ) : null}
                  <a
                    href={`mailto:${PMS_SUPPORT_EMAIL}`}
                    onClick={() =>
                      trackContactClick({
                        contactMethod: 'email',
                        contactContext: 'roadmap',
                        ctaText: 'Email support',
                      })
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold transition-colors hover:bg-white/10"
                  >
                    <Mail className="h-5 w-5 text-brand-orange" aria-hidden />
                    Email: {PMS_SUPPORT_EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 sm:items-end">
                <a
                  href={successStoriesHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-orange hover:underline"
                >
                  Watch preparation resources
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
                <PmpRoadmapCta anchor={roadmapAnchor} />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
