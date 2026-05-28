/** Shared layout class strings for Site System CMS editors (HomeData pattern). */

export const ADMIN_CMS_SHELL_ROOT_CLASS =
  'h-full flex flex-col bg-gw-bg-primary animate-in fade-in duration-300 overflow-hidden';

export const ADMIN_CMS_SHELL_SCROLL_CLASS =
  'flex-1 overflow-y-auto scrollbar-thin min-h-0 pt-0 pb-6';

export const ADMIN_CMS_SHELL_CONTAINER_CLASS =
  'max-w-6xl mx-auto w-full px-4 md:px-6';

export const ADMIN_CMS_TAB_BAR_OUTER_CLASS =
  'sticky top-0 z-20 mb-4 bg-gw-bg-primary';

export const ADMIN_CMS_TAB_BAR_INNER_CLASS =
  'flex items-center justify-between gap-4 px-0 md:px-2 py-3';

export const ADMIN_CMS_TAB_LIST_CLASS =
  'flex gap-2 items-center overflow-x-auto scrollbar-hide min-w-0';

export const ADMIN_CMS_TAB_BUTTON_BASE_CLASS =
  'px-3 py-2 text-label transition-colors flex items-center gap-2 whitespace-nowrap';

export function adminCmsTabButtonClass(active: boolean): string {
  return `${ADMIN_CMS_TAB_BUTTON_BASE_CLASS} ${
    active
      ? 'text-gw-accent-primary'
      : 'text-gw-text-secondary hover:text-gw-text-primary'
  }`;
}

export const ADMIN_CMS_FILTER_TOOLBAR_OUTER_CLASS =
  'border-b border-slate-300/70 dark:border-slate-700/70 bg-gw-bg-primary px-0 md:px-2 pb-3 mb-4 overflow-x-auto scrollbar-hide';

export const ADMIN_CMS_FILTER_TOOLBAR_INNER_CLASS =
  'flex flex-nowrap items-center justify-between gap-3 min-w-max whitespace-nowrap';

/** Wrapping toolbar row — use on CTA Management and other wide filter bars. */
export const ADMIN_CMS_FILTER_TOOLBAR_INNER_WRAP_CLASS =
  'flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between';

export const ADMIN_CMS_FILTER_TOOLBAR_FILTERS_CLASS =
  'flex items-center gap-2 min-w-max flex-nowrap whitespace-nowrap';

export const ADMIN_CMS_FILTER_TOOLBAR_FILTERS_WRAP_CLASS =
  'flex flex-wrap items-center gap-2 min-w-0';

export const ADMIN_CMS_FILTER_TOOLBAR_ACTIONS_CLASS =
  'flex items-center gap-2 flex-nowrap whitespace-nowrap shrink-0 ml-auto';

export const ADMIN_CMS_FILTER_INPUT_CLASS =
  'w-56 pl-9 pr-3 py-2 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 rounded text-body-sm focus:outline-none focus:border-brand-accent';

export const ADMIN_CMS_FILTER_SELECT_CLASS =
  'px-3 py-2 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700 rounded text-body-sm focus:outline-none focus:border-brand-accent';

export const ADMIN_CMS_PREVIEW_BUTTON_CLASS =
  'px-4 py-2 bg-brand-surface text-brand-text r-card-sm hover:bg-brand-subtle transition-colors duration-200 whitespace-nowrap';
