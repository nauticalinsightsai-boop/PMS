/** Scroll offset before bottom-right floating controls appear. */
export const FLOATING_CORNER_SHOW_AFTER_PX = 320;

export const FLOATING_CORNER_BOTTOM_CLASS =
  'bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+var(--bottom-cta-bar-height,0px))]';

/** Stack a second FAB above the bottom-corner anchor (h-12 + 0.75rem gap). */
export const FLOATING_CORNER_STACKED_CLASS =
  'bottom-[calc(max(1.5rem,env(safe-area-inset-bottom))+var(--bottom-cta-bar-height,0px)+3.75rem)]';
