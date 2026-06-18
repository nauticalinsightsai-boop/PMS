'use client';

import * as React from 'react';
import { FLOATING_CORNER_SHOW_AFTER_PX } from '@/lib/floating-corner';

/** True once the page has scrolled past the floating-corner threshold. */
export function useFloatingCornerScrollVisible(): boolean {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > FLOATING_CORNER_SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return visible;
}
