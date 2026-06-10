'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import {
  Award,
  BookOpen,
  ExternalLink,
  Mail,
  Map,
  MessageCircle,
  PhoneCall,
  Quote,
  ShieldCheck,
  Users,
  Video,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import { PMS_SUPPORT_EMAIL, PMS_WHATSAPP_URL, isWhatsAppConfigured } from '@/config/pms-site';
import { SITE_SOCIAL_PROFILE_URLS } from '@/config/site';
import {
  PMP_PARTICIPANT_QUOTES,
  PMP_PROGRAM_CTA_LABEL,
  PMP_PROGRAM_HIGHLIGHTS,
  PMP_PROGRAM_WHATSAPP_DISPLAY,
  PMP_PROGRAM_WHATSAPP_URL,
  PMP_ROADMAP_FORM_ANCHOR,
  PMP_SUCCESS_JOURNEYS,
  PMP_UNTIL_YOU_PASS_HEADLINE,
  PMP_UNTIL_YOU_PASS_SUBLINE,
} from '@/content/pmp/program-offer';

const HIGHLIGHT_ICONS = {
  'live-training': Video,
  coaching: PhoneCall,
  pdus: Award,
  roadmap: Map,
  mastermind: Users,
  'last-day': BookOpen,
} as const;

type PmpProgramOfferSectionsProps = {
  /** Where CTAs scroll when form is on the same page */
  roadmapAnchor?: string;
  className?: string;
};

function PmpRoadmapCta({
  anchor,
  className,
}: {
  anchor: string;
  className?: string;
}) {
  return (
    <a
      href={`#${anchor}`}
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

export function PmpProgramOfferSections({
  roadmapAnchor = PMP_ROADMAP_FORM_ANCHOR,
  className,
}: PmpProgramOfferSectionsProps) {
  const whatsappHref = isWhatsAppConfigured() ? PMS_WHATSAPP_URL : PMP_PROGRAM_WHATSAPP_URL;
  const successStoriesHref = SITE_SOCIAL_PROFILE_URLS.youtube;

  return (
    <div className={className}>
      {/* Until you pass + program highlights */}
      <section className={sectionSurface('warm', 'py-16 sm:py-20 md:py-24 lg:py-28')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 sm:mb-14 rounded-[2rem] border border-brand-orange/25 bg-gradient-to-br from-brand-orange/10 via-white to-brand-purple/5 p-6 sm:p-8 md:p-10 dark:from-brand-orange/10 dark:via-slate-900 dark:to-brand-purple/10 dark:border-brand-orange/20"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-4 sm:gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-orange/15 text-brand-orange">
                  <ShieldCheck className="h-7 w-7" aria-hidden />
                </div>
                <div>
                  <Badge className="mb-2 border-none bg-brand-orange/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange">
                    Our differentiator
                  </Badge>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
                    {PMP_UNTIL_YOU_PASS_HEADLINE}
                  </h2>
                  <p className="mt-2 max-w-2xl text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                    {PMP_UNTIL_YOU_PASS_SUBLINE}
                  </p>
                </div>
              </div>
              <PmpRoadmapCta anchor={roadmapAnchor} className="w-full shrink-0 md:w-auto" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {PMP_PROGRAM_HIGHLIGHTS.map((item, index) => {
              const Icon = HIGHLIGHT_ICONS[item.id as keyof typeof HIGHLIGHT_ICONS];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center sm:mt-14">
            <PmpRoadmapCta anchor={roadmapAnchor} />
          </div>
        </div>
      </section>

      {/* What participants are saying */}
      <section className={sectionSurface('soft', 'py-16 sm:py-20 md:py-24')}>
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
                    <img
                      src={item.avatar}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : null}
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                    <div className="text-sm font-medium text-slate-500">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-10 flex justify-center sm:mt-14">
            <PmpRoadmapCta anchor={roadmapAnchor} />
          </div>
        </div>
      </section>

      {/* Success journeys */}
      <section className={sectionSurface('purple', 'py-16 sm:py-20 md:py-24 lg:py-28')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto">
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
                    <img
                      src={story.avatar}
                      alt=""
                      className="h-14 w-14 rounded-full object-cover"
                    />
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

      {/* Contact + success stories video */}
      <section className="border-y border-slate-100 bg-slate-900 py-12 text-white dark:border-slate-800 dark:bg-slate-950 sm:py-14">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                Ready to start your PMP journey?
              </h2>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold transition-colors hover:bg-white/10"
                >
                  <MessageCircle className="h-5 w-5 text-green-400" aria-hidden />
                  WhatsApp: {PMP_PROGRAM_WHATSAPP_DISPLAY}
                </a>
                <a
                  href={`mailto:${PMS_SUPPORT_EMAIL}`}
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
    </div>
  );
}
