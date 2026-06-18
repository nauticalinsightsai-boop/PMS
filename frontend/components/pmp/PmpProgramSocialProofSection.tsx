'use client';

import { motion } from 'motion/react';
import { ExternalLink, Mail, MessageCircle, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMS_SUPPORT_EMAIL, getPmsWhatsAppDisplay, getPmsWhatsAppUrl, isWhatsAppConfigured } from '@/config/pms-site';
import { SITE_SOCIAL_PROFILE_URLS } from '@/config/site';
import {
  PMP_PARTICIPANT_QUOTES,
  PMP_PROGRAM_CTA_LABEL,
  PMP_ROADMAP_FORM_ANCHOR,
  PMP_SUCCESS_JOURNEYS,
} from '@/content/pmp/program-offer';
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
        <div className="container relative z-10 mx-auto">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="font-heading text-section font-bold tracking-tight text-slate-900 dark:text-white">
              What Participants Are Saying
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            {PMP_PARTICIPANT_QUOTES.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="relative rounded-[2rem] border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
              >
                <Quote className="mb-4 h-8 w-8 text-brand-orange/40" aria-hidden />
                <p className="mb-6 text-base font-medium italic leading-relaxed text-slate-700 dark:text-slate-300">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  {item.avatar ? (
                    <img src={item.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                  ) : null}
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-sm font-medium text-slate-500">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="my-14 sm:my-16 border-t border-slate-200/80 dark:border-slate-700/80" />

          <div className="mb-10 text-center sm:mb-14">
            <h2 className="font-heading text-section font-bold tracking-tight text-slate-900 dark:text-white">
              Success Journeys
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-600 dark:text-slate-400">
              Real outcomes from learners who completed a structured PMP pathway with us.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {PMP_SUCCESS_JOURNEYS.map((story, index) => (
              <motion.article
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col rounded-[2rem] border border-slate-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8"
              >
                <div className="mb-4 flex items-center gap-4">
                  {story.avatar ? (
                    <img src={story.avatar} alt="" width={56} height={56} loading="lazy" className="h-14 w-14 rounded-full object-cover" />
                  ) : null}
                  <div>
                    <h3 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                      {story.name}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">{story.position}</p>
                  </div>
                </div>
                <Badge className="mb-4 w-fit border-none bg-brand-purple/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-purple">
                  {story.programme}
                </Badge>
                <p className="flex-1 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {story.comment}
                </p>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 flex justify-center sm:mt-14">
            <PmpRoadmapCta anchor={roadmapAnchor} />
          </div>
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
                  Watch Past Success Stories
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
