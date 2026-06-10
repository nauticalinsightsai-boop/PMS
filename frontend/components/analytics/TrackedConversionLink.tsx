'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import {
  trackConversionEvent,
  type ConversionEventName,
} from '@/lib/analytics/conversion-events';

type Props = ComponentProps<typeof Link> & {
  event: ConversionEventName;
};

export function TrackedConversionLink({ event, onClick, ...props }: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackConversionEvent(event, {
          link_href: typeof props.href === 'string' ? props.href : undefined,
        });
        onClick?.(e);
      }}
    />
  );
}
