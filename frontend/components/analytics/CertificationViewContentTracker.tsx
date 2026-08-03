'use client';

import { useEffect, useRef } from 'react';
import { trackMetaViewContent } from '@/lib/analytics/meta-browser';
import { trackGaEvent } from '@/lib/analytics/send-ga-event';

/** One consent-gated ViewContent/view_item per rendered certification detail. */
export function CertificationViewContentTracker({
  certificationId,
  certificationName,
}: {
  certificationId: string;
  certificationName: string;
}) {
  const firedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!certificationId || firedFor.current === certificationId) return;
    firedFor.current = certificationId;
    trackMetaViewContent({
      content_name: certificationName,
      content_ids: [certificationId],
      content_type: 'product',
      content_category: 'certification',
    });
    trackGaEvent('view_item', {
      item_id: certificationId,
      item_name: certificationName,
      content_type: 'certification',
    });
  }, [certificationId, certificationName]);

  return null;
}
