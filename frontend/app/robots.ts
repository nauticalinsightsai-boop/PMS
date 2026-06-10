import type { MetadataRoute } from 'next';
import { PMS_SITE_URL } from '@/config/pms-site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${PMS_SITE_URL}/sitemap.xml`,
  };
}
