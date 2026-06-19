'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BRAND } from '@/lib/brand-voice';
import { MARKETING_PMP_AVATARS } from '@/lib/marketing-stock-images';
import { cn } from '@/lib/utils';

const SECTION_PY = 'py-16 sm:py-20 md:py-24 lg:py-32';

const STUDENT_SUCCESS_SHELL =
  'relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-orange-50/30 ' +
  'dark:from-slate-950 dark:via-[#0a0f24] dark:to-[#07071c]';

const STUDENT_SUCCESS_STORIES = [
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    role: 'Senior PM at TechCorp',
    quote:
      'The PM Structure PMP pathway gave me a structured study rhythm, weak-area tracking, and mentor-style review. I knew where I stood before exam day—and passed with Above Target in all domains.',
    avatar: MARKETING_PMP_AVATARS.sarah,
  },
  {
    id: 'michael-chen',
    name: 'Michael Chen',
    role: 'Agile Coach',
    quote:
      'The PMI-ACP readiness support focused on scenarios and weak-area revision, not random videos. The practice environment closely matched exam conditions, which built real confidence.',
    avatar: MARKETING_PMP_AVATARS.michael,
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    role: 'Project Coordinator',
    quote:
      'The Foundation pathway gave me structured vocabulary and a clear study rhythm during my career transition. I could speak with senior PMs with more confidence from week one.',
    avatar: MARKETING_PMP_AVATARS.elena,
  },
  {
    id: 'james-wilson',
    name: 'James Wilson',
    role: 'Operations Director',
    quote:
      'The Lean Six Sigma Green Belt course was rigorous and practical. I was able to apply improvement tools at work during the preparation window.',
    avatar: MARKETING_PMP_AVATARS.james,
  },
] as const;

const SOCIAL_PROOF_AVATARS = [
  { src: MARKETING_PMP_AVATARS.sarah, name: 'Sarah Jenkins' },
  { src: MARKETING_PMP_AVATARS.michael, name: 'Michael Chen' },
  { src: MARKETING_PMP_AVATARS.elena, name: 'Elena Rodriguez' },
  { src: MARKETING_PMP_AVATARS.james, name: 'James Wilson' },
] as const;

const AUTO_ADVANCE_MS = 6000;

function StarRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-brand-orange text-brand-orange sm:h-[1.125rem] sm:w-[1.125rem]" />
      ))}
    </div>
  );
}

function TestimonialCard({ story }: { story: (typeof STUDENT_SUCCESS_STORIES)[number] }) {
  return (
    <article className="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8 dark:border-slate-700/50 dark:bg-[#0c1224]/90 dark:shadow-black/20">
      <div className="mb-6 flex items-start justify-between gap-4">
        <StarRow />
        <Quote className="h-10 w-10 shrink-0 text-slate-300 dark:text-slate-600/80 sm:h-12 sm:w-12" aria-hidden />
      </div>
      <p className="mb-8 flex-1 text-base leading-relaxed font-medium text-slate-800 sm:text-[1.05rem] dark:text-white">
        &ldquo;{story.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-700/80 dark:bg-slate-800">
          <Image
            src={story.avatar}
            alt={story.name}
            width={56}
            height={56}
            sizes="56px"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight text-slate-900 dark:text-white">{story.name}</p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{story.role}</p>
        </div>
      </div>
    </article>
  );
}

export function HomeStudentSuccessSection() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const storyCount = STUDENT_SUCCESS_STORIES.length;
  const visibleStories = [
    STUDENT_SUCCESS_STORIES[activeIndex],
    STUDENT_SUCCESS_STORIES[(activeIndex + 1) % storyCount],
  ];

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % storyCount);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(id);
  }, [activeIndex, storyCount]);

  return (
    <section className={cn(STUDENT_SUCCESS_SHELL, SECTION_PY)}>
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-[-10%] right-[-5%] h-[36%] w-[36%] rounded-full bg-brand-purple/10 blur-[120px] dark:bg-brand-purple/20" />
        <div className="absolute bottom-[-12%] left-[-8%] h-[30%] w-[30%] rounded-full bg-brand-orange/10 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 border border-slate-200 bg-white/80 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-orange dark:border-white/10 dark:bg-white/5">
              Our Impact
            </Badge>
            <h2 className="font-heading text-section mb-4 font-bold tracking-tight leading-tight text-slate-900 dark:text-white sm:mb-6 whitespace-nowrap">
              Student Success
            </h2>
            <p className="mb-8 text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400">
              Join professionals building structured project management capability with {BRAND.name}.
            </p>

            <div className="mb-10 flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3" aria-hidden>
                {SOCIAL_PROOF_AVATARS.map((avatar) => (
                  <div
                    key={avatar.src}
                    className="h-10 w-10 overflow-hidden rounded-full border-2 border-white ring-1 ring-slate-200 dark:border-slate-950 dark:ring-slate-700/50"
                  >
                    <Image
                      src={avatar.src}
                      alt={avatar.name}
                      width={40}
                      height={40}
                      sizes="40px"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <StarRow />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 sm:text-base">4.9/5 Average Rating</p>
              </div>
            </div>

            <div className="flex items-center gap-2" role="tablist" aria-label="Student success stories">
              {STUDENT_SUCCESS_STORIES.map((story, index) => (
                <button
                  key={story.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  aria-label={`Show review from ${story.name}`}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    activeIndex === index
                      ? 'w-8 bg-brand-orange'
                      : 'w-2 bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500',
                  )}
                />
              ))}
            </div>
          </motion.div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleStories.map((story) => (
                  <motion.div
                    key={`${activeIndex}-${story.id}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="h-full"
                  >
                    <TestimonialCard story={story} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
