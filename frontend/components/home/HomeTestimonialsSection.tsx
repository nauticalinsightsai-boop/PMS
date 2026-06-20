'use client';

import * as React from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand-voice';
import { T176_TESTIMONIAL_PLACEHOLDER } from '@/content/t176-claims';
import { SectionAmbience, sectionSurface } from '@/components/SectionAmbience';
import {
  MOBILE_CAROUSEL_TOUCH_CLASS,
} from '@/components/ResponsiveSnapScroll';

const SECTION_PY = 'py-16 sm:py-20 md:py-24 lg:py-32';
const PERMISSION_PENDING_LABEL = 'Learner feedback: permission pending';

export type HomeTestimonial = {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
};

type HomeTestimonialsSectionProps = {
  testimonials: HomeTestimonial[];
  /** When true, show compliance placeholder instead of unverified quotes. */
  usePlaceholder?: boolean;
};

export function HomeTestimonialsSection({
  testimonials,
  usePlaceholder = false,
}: HomeTestimonialsSectionProps) {
  const [reduceMotion, setReduceMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const emblaPlugins = React.useMemo(
    () => (reduceMotion ? [] : [Autoplay({ delay: 5000 })]),
    [reduceMotion],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: 'start', containScroll: 'trimSnaps', watchDrag: true },
    emblaPlugins,
  );
  const viewportRef = emblaRef;
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (usePlaceholder || testimonials.length === 0) {
    return (
      <section className={sectionSurface('cool', cn(SECTION_PY, 'overflow-hidden'))}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto max-w-3xl text-center">
          <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            Learner feedback
          </Badge>
          <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Preparation stories
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {T176_TESTIMONIAL_PLACEHOLDER}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className={sectionSurface('cool', cn(SECTION_PY, 'overflow-hidden'))}>
      <SectionAmbience tone="cool" />
      <div className="container relative z-10 mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-stretch lg:items-center">
          <div className="lg:w-1/3 min-w-0">
            <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
              Learner feedback
            </Badge>
            <h2 className="font-heading text-section font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight">
              Preparation stories
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
              Join professionals building structured project management capability with {BRAND.name}.
            </p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
              {PERMISSION_PENDING_LABEL}
            </p>

            <div className="flex flex-wrap gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(idx)}
                  className={cn(
                    'min-h-11 min-w-11 inline-flex items-center justify-center rounded-full transition-all',
                    selectedIndex === idx ? 'bg-brand-orange/15' : 'hover:bg-muted',
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  <span
                    className={cn(
                      'block h-2 rounded-full transition-all',
                      selectedIndex === idx ? 'w-8 bg-brand-orange' : 'w-2 bg-slate-200 dark:bg-slate-800',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 w-full min-w-0">
            <div
              className={cn(
                'overflow-hidden cursor-grab overscroll-x-contain active:cursor-grabbing',
                MOBILE_CAROUSEL_TOUCH_CLASS,
              )}
              ref={viewportRef}
            >
              <div className="flex">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex-[0_0_100%] md:flex-[0_0_50%] min-w-0 pr-4 md:pr-6">
                    <Card className="h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                      <Quote className="absolute top-8 right-8 h-12 w-12 text-slate-50 dark:text-slate-800/50 -rotate-12 transition-transform group-hover:rotate-0" />
                      <div className="relative z-10">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                          {PERMISSION_PENDING_LABEL}
                        </p>
                        <p className="text-lg italic text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-medium">
                          &ldquo;{testimonial.content}&rdquo;
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                            <Image
                              src={testimonial.avatar}
                              alt=""
                              width={56}
                              height={56}
                              sizes="56px"
                              loading="lazy"
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-tight">
                              {testimonial.name}
                            </div>
                            <div className="text-sm font-medium text-slate-500">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
