import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  CalendarCheck, 
  Inbox, 
  Banknote, 
  Newspaper, 
  MousePointer2, 
  BarChart3, 
  ShieldCheck, 
  Globe, 
  Briefcase, 
  FileText, 
  Video, 
  Library, 
  Trash2, 
  ShieldAlert, 
  Search, 
  Map, 
  LineChart, 
  Settings, 
  Mail, 
  History,
  Activity
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

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

export const BOOKINGS_ROUTE_PREFIXES = [
  '/dashboard/members-revenue',
];

export const WEBSITE_ROUTE_PREFIXES = [
  '/dashboard/site-system',
];

export const SOCIAL_ROUTE_PREFIXES = [
  '/dashboard/control-tower',
];

export const DASHBOARD_ROUTES: Record<'social' | 'bookings' | 'website', DashboardNavSection[]> = {
  social: [
    {
      title: 'Social Control',
      items: [
        { name: 'Control Tower', path: '/dashboard/control-tower', icon: LayoutDashboard },
      ]
    }
  ],
  bookings: [
    {
      title: 'Operations',
      items: [
        { name: 'Overview', path: '/dashboard/members-revenue', icon: LayoutDashboard },
        { name: 'Users & Leads', path: '/dashboard/members-revenue/users', icon: UserRound },
        { name: 'Members', path: '/dashboard/members-revenue/members', icon: Users },
        { name: 'Bookings', path: '/dashboard/members-revenue/bookings', icon: CalendarCheck },
        { name: 'Inter interactions', path: '/dashboard/members-revenue/interactions', icon: Inbox },
      ]
    },
    {
      title: 'Growth',
      items: [
        { name: 'Monetization', path: '/dashboard/members-revenue/monetization', icon: Banknote },
        { 
          name: 'Newsletter', 
          path: '/dashboard/members-revenue/newsletter', 
          icon: Newspaper,
          subItems: [
            { name: 'Blogs Editor', path: '/dashboard/members-revenue/blogs', icon: FileText },
            { name: 'Campaigns', path: '/dashboard/members-revenue/newsletter/campaigns', icon: Mail },
          ]
        },
        { 
          name: 'CTA Management', 
          path: '/dashboard/members-revenue/cta', 
          icon: MousePointer2,
          subItems: [
            { name: 'Analytics', path: '/dashboard/members-revenue/cta/analytics', icon: BarChart3 },
            { name: 'Audit', path: '/dashboard/members-revenue/cta/audit', icon: ShieldCheck },
          ]
        },
      ]
    }
  ],
  website: [
    {
      title: 'Admin Controls',
      items: [
        { name: 'Home Editor', path: '/dashboard/site-system/home', icon: LayoutDashboard },
        { name: 'Website Data', path: '/dashboard/site-system/website-data', icon: Globe },
        { name: 'Service Scopes', path: '/dashboard/site-system/service-scopes', icon: Briefcase },
        { name: 'Portfolio', path: '/dashboard/site-system/portfolio', icon: FileText },
        { name: 'Insights', path: '/dashboard/site-system/insights', icon: Library },
        { name: 'Media Booking', path: '/dashboard/site-system/media', icon: Video },
        { name: 'Media Library', path: '/dashboard/site-system/media-library', icon: Library },
        { name: 'Discarded', path: '/dashboard/site-system/discarded', icon: Trash2 },
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Security', path: '/dashboard/site-system/security', icon: ShieldAlert },
        { name: 'SEO Health', path: '/dashboard/site-system/seo', icon: Search },
        { name: 'Sitemap', path: '/dashboard/site-system/sitemap', icon: Map },
        { name: 'Analytics', path: '/dashboard/site-system/analytics', icon: LineChart },
        { name: 'Settings', path: '/dashboard/site-system/settings', icon: Settings },
        { name: 'Booking Email', path: '/dashboard/site-system/discovery-call-email', icon: Mail },
        { name: 'Data Migration', path: '/dashboard/migrate', icon: History },
      ]
    }
  ]
};
