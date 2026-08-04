/** Shared layout class strings for Site System CMS editors (HomeData pattern). */

export const ADMIN_CMS_SHELL_ROOT_CLASS =
  'h-full flex flex-col bg-background animate-in fade-in duration-300 overflow-hidden';

export const ADMIN_CMS_SHELL_SCROLL_CLASS =
  'flex-1 overflow-y-auto scrollbar-thin min-h-0 pt-0 pb-6';

export const ADMIN_CMS_SHELL_CONTAINER_CLASS = 'max-w-6xl mx-auto w-full px-4 md:px-6';

export const ADMIN_CMS_TAB_BAR_OUTER_CLASS = 'sticky top-0 z-20 mb-4 bg-background/95 backdrop-blur-sm';

export const ADMIN_CMS_TAB_BAR_INNER_CLASS =
  'flex items-center justify-between gap-4 px-0 md:px-2 py-3';

export const ADMIN_CMS_TAB_LIST_CLASS =
  'flex min-w-max items-center gap-2';

/** Segmented toggle track (matches dashboard Editor / Booking CRM / Admin control). */
export const ADMIN_CMS_SEGMENTED_CONTROL_CLASS =
  'flex items-center gap-0.5 bg-muted/50 p-1 rounded-2xl border border-border max-w-full overflow-x-auto scrollbar-hide';

export function adminCmsSegmentTabClass(active: boolean): string {
  return `px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 whitespace-nowrap shrink-0 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 ${
    active
      ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/40'
      : 'text-muted-foreground hover:text-foreground'
  }`;
}

export const ADMIN_CMS_TAB_BUTTON_BASE_CLASS =
  'text-label flex min-h-8 items-center justify-center gap-2 whitespace-nowrap rounded-lg cursor-pointer border transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40';

export function adminCmsTabButtonClass(active: boolean): string {
  return `${ADMIN_CMS_TAB_BUTTON_BASE_CLASS} ${
    active
      ? 'px-4 py-2 text-brand-orange font-bold bg-brand-orange/15 border-brand-orange/50 shadow-sm shadow-brand-orange/15'
      : 'px-3 py-2 text-muted-foreground border-transparent hover:border-border hover:bg-muted/60 hover:text-foreground'
  }`;
}

/** @deprecated Use adminCmsSegmentTabClass for category strip toggles. */
export function adminCmsCategoryTabShellClass(_active: boolean): string {
  return 'inline-flex shrink-0 items-center';
}

export const ADMIN_CMS_FILTER_TOOLBAR_OUTER_CLASS =
  'border-b border-border bg-background px-0 md:px-2 pb-3 mb-4 overflow-x-auto scrollbar-hide';

export const ADMIN_CMS_FILTER_TOOLBAR_INNER_CLASS =
  'flex flex-nowrap items-center justify-between gap-3 min-w-max whitespace-nowrap';

export const ADMIN_CMS_FILTER_TOOLBAR_INNER_WRAP_CLASS =
  'flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between';

export const ADMIN_CMS_FILTER_TOOLBAR_FILTERS_CLASS =
  'flex items-center gap-2 min-w-max flex-nowrap whitespace-nowrap';

export const ADMIN_CMS_FILTER_TOOLBAR_FILTERS_WRAP_CLASS =
  'flex flex-wrap items-center gap-2 min-w-0';

export const ADMIN_CMS_FILTER_TOOLBAR_ACTIONS_CLASS =
  'flex items-center gap-2 flex-nowrap whitespace-nowrap shrink-0 ml-auto';

/** Matches shadcn `Input` + search icon padding for filter toolbars. */
export const ADMIN_CMS_FILTER_INPUT_CLASS =
  'h-8 w-56 min-w-0 rounded-lg border border-input bg-background pl-9 pr-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

/** Matches shadcn select height and focus ring for filter toolbars. */
export const ADMIN_CMS_FILTER_SELECT_CLASS =
  'h-8 rounded-lg border border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';

export const ADMIN_CMS_PREVIEW_BUTTON_CLASS =
  'px-4 py-2 brand-surface r-card-sm hover:bg-muted transition-colors duration-200 whitespace-nowrap text-sm font-medium';
