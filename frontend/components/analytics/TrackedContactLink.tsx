'use client';

import type { ContactContext, ContactMethod } from '@/lib/analytics/pms-events';
import { trackContactClick } from '@/lib/analytics/track-contact-click';

type Props = {
  href: string;
  contactMethod: ContactMethod;
  contactContext: ContactContext;
  ctaText?: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
};

export function TrackedContactLink({
  href,
  contactMethod,
  contactContext,
  ctaText,
  className,
  children,
  target,
  rel,
}: Props) {
  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={() =>
        trackContactClick({
          contactMethod,
          contactContext,
          ctaText: ctaText ?? (typeof children === 'string' ? children : undefined),
        })
      }
    >
      {children}
    </a>
  );
}
