'use client';

import { useEffect } from 'react';
import {
  CONVERSION_EVENTS,
  trackConversionEvent,
  type ConversionEventName,
} from '@/lib/analytics/conversion-events';

export function ConversionViewTracker({
  event,
  slug,
  pagePath,
}: {
  event: ConversionEventName;
  slug?: string;
  pagePath?: string;
}) {
  useEffect(() => {
    trackConversionEvent(event, {
      ...(slug ? { content_slug: slug } : {}),
      ...(pagePath ? { page_path: pagePath } : {}),
    });
  }, [event, slug, pagePath]);
  return null;
}

export { CONVERSION_EVENTS };
