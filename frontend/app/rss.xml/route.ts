import { getPublishedNewsletterArticles } from '@/lib/newsletter/articles';
import { PMS_SITE_URL } from '@/config/pms-site';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const newsletter = await getPublishedNewsletterArticles();

  const items = newsletter.map((a) => ({
    title: a.title,
    link: `${PMS_SITE_URL}/newsletter/${a.slug}`,
    description: a.excerpt,
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>PM Structure</title>
    <link>${PMS_SITE_URL}</link>
    <description>Certification strategies and project management insights from PM Structure.</description>
    ${items
      .map(
        (item) => `<item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
    </item>`,
      )
      .join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
