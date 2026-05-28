/**
 * Migrates data/channel-landing-pages.json to PMS portal template v2.
 * Run: npx tsx scripts/migrate-channel-landing-pages-to-pms-template.ts
 */
import {
  getAllChannelLandingPages,
  upsertChannelLandingPage,
} from '../packages/booking-crm/src/channel-landing-pages/repository.js';
import {
  buildDefaultPortalEngagement,
  migratePageToPmsPortalTemplate,
} from '../packages/booking-crm/src/pmsPortalTemplate.js';
import { defaultChannelLandingPage } from '../packages/booking-crm/src/types/channelLandingPage.js';

const VK_CHANNEL = 'vk';

function ensureVkPage() {
  const pages = getAllChannelLandingPages();
  if (pages[VK_CHANNEL]) return;
  const base = defaultChannelLandingPage({
    channelKey: VK_CHANNEL,
    channelId: VK_CHANNEL,
    label: 'VK',
  });
  upsertChannelLandingPage(
    VK_CHANNEL,
    {
      ...migratePageToPmsPortalTemplate({
        ...base,
        channelId: VK_CHANNEL,
        channelKey: VK_CHANNEL,
        slug: 'vk',
        portalEngagement: buildDefaultPortalEngagement(),
      }),
      channelId: VK_CHANNEL,
      label: 'VK',
    },
    'saveDraft',
  );
  console.log('Added vk channel page');
}

function migrateAll() {
  const pages = getAllChannelLandingPages();
  let count = 0;
  for (const [key, page] of Object.entries(pages)) {
    const migrated = migratePageToPmsPortalTemplate(page);
    if (JSON.stringify(migrated) !== JSON.stringify(page)) {
      upsertChannelLandingPage(
        key,
        {
          channelId: page.channelId,
          label: page.label,
          ...migrated,
        },
        page.status === 'published' ? 'publish' : 'saveDraft',
      );
      count++;
    }
  }
  console.log(`Migrated ${count} pages to template v2`);
}

ensureVkPage();
migrateAll();
