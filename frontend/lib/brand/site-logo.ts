/** Navbar / favicon brand marks (public/brand). */
export const BRAND_NAV_LOGO = {
 light: '/brand/logo-sa-light.png',
 dark: '/brand/logo-sa-dark.png',
} as const

/** Keep the browser tab icon aligned with navbar light/dark logos. */
export function syncBrandFavicon(isLight: boolean) {
 if (typeof document === 'undefined') return

 const href = isLight ? BRAND_NAV_LOGO.light : BRAND_NAV_LOGO.dark
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
