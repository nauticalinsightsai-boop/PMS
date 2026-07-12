import type { LucideIcon } from 'lucide-react';
import {
  Home,
  Briefcase,
  Award,
  Users,
  ShoppingBag,
  Info,
  GitCompare,
  HelpCircle,
  Mail,
  CreditCard,
} from 'lucide-react';

/** Matches routes under frontend/app/(site)/ */
export interface PublicSitePage {
  slug: string;
  label: string;
  path: string;
  icon: LucideIcon;
  inMainNav: boolean;
  /** Shown at top of dashboard editor — maps controls to the public page. */
  editorDescription: string;
}

export const PUBLIC_SITE_PAGES: PublicSitePage[] = [
  {
    slug: 'home',
    label: 'Home',
    path: '/',
    icon: Home,
    inMainNav: true,
    editorDescription:
      'Hero slides, stats, featured pathways, testimonials, and institute CTAs on the homepage. Upload hero images under the Site images tab.',
  },
  {
    slug: 'certifications',
    label: 'Certifications',
    path: '/certifications',
    icon: Award,
    inMainNav: true,
    editorDescription:
      'Certification hub hero, pathway listing, and per-cert registry (pricing, dossier, programme PDFs/videos for pathway modals).',
  },
  {
    slug: 'pm-service',
    label: 'Services',
    path: '/pm-service',
    icon: Briefcase,
    inMainNav: true,
    editorDescription: 'Services page hero, service cards, and delivery highlights shown on /pm-service.',
  },
  {
    slug: 'community',
    label: 'Community',
    path: '/community',
    icon: Users,
    inMainNav: true,
    editorDescription: 'Community hub hero, membership bands, and store entry copy on /community.',
  },
  {
    slug: 'store',
    label: 'Resource Store',
    path: '/community?view=store',
    icon: ShoppingBag,
    inMainNav: false,
    editorDescription: 'Digital products in the resource store — titles, pricing, and product images.',
  },
  {
    slug: 'about',
    label: 'About',
    path: '/about',
    icon: Info,
    inMainNav: false,
    editorDescription: 'About page hero, mission, and story sections shown on /about.',
  },
  {
    slug: 'compare',
    label: 'Compare Certifications',
    path: '/certifications/compare',
    icon: GitCompare,
    inMainNav: false,
    editorDescription: 'Compare page hero and intro text on /certifications/compare.',
  },
  {
    slug: 'faq',
    label: 'FAQ',
    path: '/faq',
    icon: HelpCircle,
    inMainNav: false,
    editorDescription: 'FAQ page header badge, title, and subtitle on /faq.',
  },
  {
    slug: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: Mail,
    inMainNav: false,
    editorDescription: 'Contact page title and subtitle above the enquiry form on /contact.',
  },
  {
    slug: 'membership',
    label: 'Membership',
    path: '/membership',
    icon: CreditCard,
    inMainNav: false,
    editorDescription: 'Membership landing hero, tiers, and benefits on /membership.',
  },
];

export function getPublicSitePage(slug: string): PublicSitePage | undefined {
  return PUBLIC_SITE_PAGES.find((p) => p.slug === slug);
}

export function dashboardPageEditorPath(slug: string) {
  return `/dashboard/site-system/pages/${slug}`;
}
