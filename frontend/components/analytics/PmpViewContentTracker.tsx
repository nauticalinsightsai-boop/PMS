'use client';

import { useEffect, useRef } from 'react';
import { trackMetaViewContent } from '@/lib/analytics/meta-browser';
import { trackGaEvent } from '@/lib/analytics/send-ga-event';

/** Fire Meta ViewContent (+ GA view_item) once per mount on PMP programme pages. */
export function PmpViewContentTracker({
  contentName = 'PMP Certification Programme',
  contentIds = ['pmp'],
}: {
  contentName?: string;
  contentIds?: string[];
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackMetaViewContent({
      content_name: contentName,
      content_ids: contentIds,
      content_type: 'product',
    });
    trackGaEvent('view_item', {
      item_id: contentIds[0] ?? 'pmp',
      item_name: contentName,
      content_type: 'programme',
    });
  }, [contentName, contentIds]);

  return null;
}
