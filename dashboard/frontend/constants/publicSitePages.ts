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
}

export const PUBLIC_SITE_PAGES: PublicSitePage[] = [
  { slug: 'home', label: 'Home', path: '/', icon: Home, inMainNav: true },
  { slug: 'certifications', label: 'Certifications', path: '/certifications', icon: Award, inMainNav: true },
  { slug: 'pm-service', label: 'Services', path: '/pm-service', icon: Briefcase, inMainNav: true },
  { slug: 'community', label: 'Community', path: '/community', icon: Users, inMainNav: true },
  { slug: 'store', label: 'Resource Store', path: '/community?view=store', icon: ShoppingBag, inMainNav: false },
  { slug: 'about', label: 'About', path: '/about', icon: Info, inMainNav: false },
  { slug: 'compare', label: 'Compare Certifications', path: '/certifications/compare', icon: GitCompare, inMainNav: false },
  { slug: 'faq', label: 'FAQ', path: '/faq', icon: HelpCircle, inMainNav: false },
  { slug: 'contact', label: 'Contact', path: '/contact', icon: Mail, inMainNav: false },
  { slug: 'membership', label: 'Membership', path: '/membership', icon: CreditCard, inMainNav: false },
];

export function getPublicSitePage(slug: string): PublicSitePage | undefined {
  return PUBLIC_SITE_PAGES.find((p) => p.slug === slug);
}

export function dashboardPageEditorPath(slug: string) {
  if (slug === 'home') {
    return '/dashboard/site-system/home';
  }
  return `/dashboard/site-system/pages/${slug}`;
}
