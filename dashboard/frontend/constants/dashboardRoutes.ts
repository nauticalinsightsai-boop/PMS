import {
  MousePointer2,
  ImageIcon,
  Newspaper,
  Users,
  FileText,
  Home,
  Settings,
  Shield,
  BarChart3,
  Database,
  Search,
  Wrench,
  Layers,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';
import { PUBLIC_SITE_PAGES } from '@/constants/publicSitePages';

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

export const BOOKINGS_ROUTE_PREFIXES = ['/dashboard/booking-crm', '/dashboard/account'];

export const EDITOR_ROUTE_PREFIXES = [
  '/dashboard/site-system/media-library',
  '/dashboard/site-system/newsletter',
];

/** @deprecated Use EDITOR_ROUTE_PREFIXES */
export const WEBSITE_ROUTE_PREFIXES = EDITOR_ROUTE_PREFIXES;

export const ADMIN_ROUTE_PREFIXES = [
  '/dashboard/site-system/home',
  '/dashboard/site-system/pages',
  '/dashboard/site-system/settings',
  '/dashboard/site-system/seo',
  '/dashboard/site-system/security',
  '/dashboard/site-system/analytics',
  '/dashboard/site-system/website-data',
  '/dashboard/site-system/service-scopes',
  '/dashboard/site-system/discovery-call-email',
  '/dashboard/site-system/portfolio',
  '/dashboard/site-system/discarded',
  '/dashboard/cms',
  '/dashboard/migrate',
];

/** Editor tab — media library + newsletter */
const EDITOR_CMS_NAV: DashboardNavSection = {
  title: 'Editor',
  items: [
    { name: 'Media library', path: WEBSITE_CMS_PATHS.mediaLibrary, icon: ImageIcon },
    {
      name: 'Newsletter',
      path: WEBSITE_CMS_PATHS.newsletter,
      icon: Newspaper,
      subItems: [
        { name: 'Subscribers', path: WEBSITE_CMS_PATHS.newsletterSubscribers, icon: Users },
      ],
    },
  ],
};

const ADMIN_SITE_PAGES_NAV: DashboardNavSection = {
  title: 'Website pages',
  items: [
    { name: 'Home', path: '/dashboard/site-system/home', icon: Home },
    ...PUBLIC_SITE_PAGES.filter((page) => page.slug !== 'home').map((page) => ({
      name: page.label,
      path: `/dashboard/site-system/pages/${page.slug}`,
      icon: page.icon,
    })),
  ],
};

const ADMIN_SYSTEM_NAV: DashboardNavSection = {
  title: 'System',
  items: [
    { name: 'Settings', path: '/dashboard/site-system/settings', icon: Settings },
    { name: 'SEO', path: '/dashboard/site-system/seo', icon: Search },
    { name: 'Security', path: '/dashboard/site-system/security', icon: Shield },
    { name: 'Analytics', path: '/dashboard/site-system/analytics', icon: BarChart3 },
    { name: 'Website data', path: '/dashboard/site-system/website-data', icon: Database },
    { name: 'Service scopes', path: '/dashboard/site-system/service-scopes', icon: Layers },
    { name: 'Data migration', path: '/dashboard/migrate', icon: Wrench },
  ],
};

export const DASHBOARD_ROUTES: Record<'editor' | 'bookings' | 'admin', DashboardNavSection[]> = {
  editor: [EDITOR_CMS_NAV],
  bookings: [
    {
      title: 'Booking CRM',
      items: [
        { name: 'CTA Management', path: '/dashboard/booking-crm/cta', icon: MousePointer2 },
        { name: 'Sheets records', path: '/dashboard/booking-crm/interactions/sheets', icon: FileText },
      ],
    },
  ],
  admin: [ADMIN_SITE_PAGES_NAV, ADMIN_SYSTEM_NAV],
};
