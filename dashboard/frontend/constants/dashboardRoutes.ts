import { BarChart3, Newspaper, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { WEBSITE_ANALYTICS_PATH } from '@/constants/analytics';

export interface DashboardNavSubItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

export interface DashboardNavSection {
  title: string;
  items: {
    name: string;
    path: string;
    icon: LucideIcon;
    subItems?: DashboardNavSubItem[];
  }[];
}

/** Newsletter-only dashboard — booking CRM and social tools hidden from nav. */
export const BOOKINGS_ROUTE_PREFIXES: string[] = [];

export const WEBSITE_ROUTE_PREFIXES = [
  '/dashboard/site-system/newsletter',
  WEBSITE_ANALYTICS_PATH,
];

export const SOCIAL_ROUTE_PREFIXES: string[] = [];

/** @deprecated Use WEBSITE_ROUTE_PREFIXES */
export const EDITOR_ROUTE_PREFIXES = WEBSITE_ROUTE_PREFIXES;

export const ADMIN_ROUTE_PREFIXES: string[] = [];

const WEBSITE_CMS_NAV: DashboardNavSection = {
  title: 'Newsletter',
  items: [
    {
      name: 'Posts',
      path: WEBSITE_CMS_PATHS.newsletter,
      icon: Newspaper,
      subItems: [
        { name: 'Subscribers', path: WEBSITE_CMS_PATHS.newsletterSubscribers, icon: Users },
      ],
    },
    {
      name: 'Analytics',
      path: WEBSITE_ANALYTICS_PATH,
      icon: BarChart3,
    },
  ],
};

export const DASHBOARD_ROUTES: Record<'social' | 'bookings' | 'website', DashboardNavSection[]> = {
  social: [],
  bookings: [],
  website: [WEBSITE_CMS_NAV],
};
