import { PMS_FAVICON_DARK_PATH, PMS_FAVICON_PATH } from '@/config/pms-site';

/** Personal-brand wordmarks on /go channel landings (legacy paths). */
export const BRAND_NAV_LOGO = {
 light: '/brand/logo-sa-light.png',
 dark: '/brand/logo-sa-dark.png',
} as const;

/** PM Structure square tab icon (matches navbar brand). */
export const BRAND_FAVICON = {
 light: PMS_FAVICON_PATH,
 dark: PMS_FAVICON_DARK_PATH,
} as const;

/** Keep the browser tab icon aligned with site light/dark theme. */
export function syncBrandFavicon(isLight: boolean) {
 if (typeof document === 'undefined') return

 const href = isLight ? BRAND_FAVICON.light : BRAND_FAVICON.dark
 for (const rel of ['icon', 'apple-touch-icon'] as const) {
  let link =
   document.querySelector<HTMLLinkElement>(`link[rel="${rel}"][data-brand-favicon]`) ??
   document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)

  if (!link) {
   link = document.createElement('link')
   link.rel = rel
   document.head.appendChild(link)
  }

  link.href = href
  link.setAttribute('data-brand-favicon', '')
 }
}
