import fs from 'fs';
import path from 'path';

const dirs = [
  'dashboard/frontend/components/booking-crm',
  'dashboard/frontend/components/admin',
];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(p)) {
      let t = fs.readFileSync(p, 'utf8');
      const next = t
        .replaceAll('@/src/', '@/')
        .replaceAll('@/components/ui/cards/GlassCard', '@/components/ui/GlassCard')
        .replaceAll('@/components/ui/buttons/CTAButton', '@/components/ui/CTAButton')
        .replaceAll('@/page-modules/admin/ChannelLandingEditor', '@/components/booking-crm/ChannelLandingEditor')
        .replaceAll('@/constants/ctaPlatformButtons', '@pms/booking-crm/client')
        .replaceAll('@/lib/channel-landing-pages/', '@pms/booking-crm/client')
        .replaceAll('@/types/channelLandingPage', '@pms/booking-crm/client')
        .replaceAll('@/types/distribution', '@pms/booking-crm/client')
        .replaceAll('@pms/booking-crm/migrateChannelPages', '@pms/booking-crm/client')
        .replaceAll('@pms/booking-crm/portalDefaults', '@pms/booking-crm/client')
        .replaceAll('@pms/booking-crm/tierDuration', '@pms/booking-crm/client')
        .replaceAll('@pms/booking-crm/portalPersonaLint', '@pms/booking-crm/client')
        .replaceAll('@pms/booking-crm/shareUrl', '@pms/booking-crm/client')
        .replaceAll("from '@pms/booking-crm'", "from '@pms/booking-crm/client'")
        .replaceAll('from "@pms/booking-crm"', 'from "@pms/booking-crm/client"');
      if (next !== t) fs.writeFileSync(p, next);
    }
  }
}

for (const d of dirs) walk(path.resolve(d));
console.log('fixed dashboard imports');
