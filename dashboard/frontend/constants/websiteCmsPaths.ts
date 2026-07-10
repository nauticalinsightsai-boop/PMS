/** Canonical Editor tab (CMS) routes — single source for sidebar + editors */
export const WEBSITE_CMS_PATHS = {
  mediaLibrary: '/dashboard/site-system/media-library',
  newsletter: '/dashboard/site-system/newsletter',
  newsletterPosts: '/dashboard/site-system/newsletter/posts',
  newsletterNew: '/dashboard/site-system/newsletter/new',
  newsletterSubscribers: '/dashboard/site-system/newsletter/subscribers',
  newsletterEdit: (id: string) => `/dashboard/site-system/newsletter/${id}/edit`,
  newsletterAuthors: '/dashboard/site-system/newsletter/authors',
  newsletterAuthorNew: '/dashboard/site-system/newsletter/authors/new',
  newsletterAuthorEdit: (id: string) =>
    `/dashboard/site-system/newsletter/authors/${id}/edit`,
  analytics: '/dashboard/site-system/analytics',
} as const;

export const WEBSITE_CMS_ROUTE_PREFIXES = [
  '/dashboard/site-system/media-library',
  '/dashboard/site-system/newsletter',
  '/dashboard/site-system/analytics',
] as const;
