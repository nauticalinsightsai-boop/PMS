'use client';

import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import type { CtaRoute } from '@/lib/cta-router';
import { cn } from '@/lib/utils';

interface OfferingCtaButtonsProps {
  ctas: CtaRoute;
  primaryHref: string;
  secondaryHref: string;
  className?: string;
  vertical?: boolean;
}

export function OfferingCtaButtons({
  ctas,
  primaryHref,
  secondaryHref,
  className,
  vertical,
}: OfferingCtaButtonsProps) {
  if (ctas.primary === 'hidden') return null;

  return (
    <div
      className={cn(
        'flex gap-3',
        vertical ? 'flex-col' : 'flex-wrap',
        className
      )}
    >
      <Link
        href={primaryHref}
        className={cn(buttonVariants(), 'rounded-full bg-brand-orange hover:bg-brand-orange/90 text-white')}
      >
        {ctas.primaryLabel}
      </Link>
      {ctas.secondary !== 'hidden' && ctas.secondaryLabel && (
        <Link
          href={secondaryHref}
          className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full')}
        >
          {ctas.secondaryLabel}
        </Link>
      )}
    </div>
  );
}
