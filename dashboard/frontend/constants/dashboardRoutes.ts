import {
  LayoutDashboard,
  Inbox,
  MousePointer2,
  ShieldAlert,
  Search,
  Map,
  LineChart,
  Settings,
  History,
  Newspaper,
  ClipboardList,
  ShoppingCart,
  FileCheck,
  GraduationCap,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { PUBLIC_SITE_PAGES, dashboardPageEditorPath } from './publicSitePages';

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

export const WEBSITE_ROUTE_PREFIXES = ['/dashboard/site-system', '/dashboard', '/dashboard/migrate'];

export const PUBLISHER_ROUTE_PREFIXES = [
  '/dashboard/control-tower',
  '/dashboard/booking-crm/newsletter',
  '/dashboard/booking-crm/blogs',
];

/** @deprecated Use PUBLISHER_ROUTE_PREFIXES */
export const SOCIAL_ROUTE_PREFIXES = PUBLISHER_ROUTE_PREFIXES;

/** Admin sidebar: one item per live public website page */
const websitePageNavItems = PUBLIC_SITE_PAGES.map((page) => ({
  name: page.label,
  path: dashboardPageEditorPath(page.slug),
  icon: page.icon,
}));

export const DASHBOARD_ROUTES: Record<'publisher' | 'bookings' | 'website', DashboardNavSection[]> = {
  publisher: [
    {
      title: 'Publisher',
      items: [
        { name: 'Control Tower', path: '/dashboard/control-tower', icon: LayoutDashboard },
        {
          name: 'Newsletter',
          path: '/dashboard/booking-crm/newsletter',
          icon: Newspaper,
          subItems: [{ name: 'Blogs Editor', path: '/dashboard/booking-crm/blogs', icon: Newspaper }],
        },
      ],
    },
  ],
  bookings: [
    {
      title: 'Booking CRM',
      items: [
        { name: 'CTA Management', path: '/dashboard/booking-crm/cta', icon: MousePointer2 },
        { name: 'Sheets records', path: '/dashboard/booking-crm/interactions/sheets', icon: Inbox },
        { name: 'Consultations', path: '/dashboard/booking-crm/consultations', icon: ClipboardList },
        { name: 'Bookings', path: '/dashboard/booking-crm/bookings', icon: ShoppingCart },
        { name: 'Verification logs', path: '/dashboard/booking-crm/verification-logs', icon: FileCheck },
        { name: 'Scholarship review', path: '/dashboard/booking-crm/scholarship-review', icon: GraduationCap },
        { name: 'Account region', path: '/dashboard/account/region', icon: Map },
      ],
    },
  ],
  website: [
    {
      title: 'Website pages',
      items: websitePageNavItems,
    },
    {
      title: 'System',
      items: [
        { name: 'Security', path: '/dashboard/site-system/security', icon: ShieldAlert },
        { name: 'SEO Health', path: '/dashboard/site-system/seo', icon: Search },
        { name: 'Analytics', path: '/dashboard/site-system/analytics', icon: LineChart },
        { name: 'Settings', path: '/dashboard/site-system/settings', icon: Settings },
        { name: 'Data Migration', path: '/dashboard/migrate', icon: History },
      ],
    },
  ],
};
