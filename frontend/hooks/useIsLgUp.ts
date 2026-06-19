'use client';

import * as React from 'react';

const LG_QUERY = '(min-width: 1024px)';

/** True when viewport is lg+; false until mounted (defaults mobile). */
export function useIsLgUp(): boolean {
  const [isLgUp, setIsLgUp] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(LG_QUERY);
    const sync = () => setIsLgUp(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return isLgUp;
}
