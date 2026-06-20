#!/usr/bin/env node
/**
 * Verify pmstructure.com community DNS (apex + www).
 * Usage: node scripts/check-community-dns.mjs
 */
import { lookup, resolveCname } from 'node:dns/promises';

const APEX = 'pmstructure.com';
const WWW = 'www.pmstructure.com';

async function checkHost(host) {
  try {
    const cname = await resolveCname(host).catch(() => null);
    if (cname?.length) {
      return { host, status: 'ok', type: 'CNAME', value: cname.join(', ') };
    }
    const records = await lookup(host, { all: true });
    return {
      host,
      status: 'ok',
      type: 'A/AAAA',
      value: records.map((r) => `${r.address} (${r.family})`).join(', '),
    };
  } catch (err) {
    return { host, status: 'missing', error: err.code || err.message };
  }
}

const [apex, www] = await Promise.all([checkHost(APEX), checkHost(WWW)]);

console.log('\nPM Structure community DNS check\n');
for (const row of [apex, www]) {
  if (row.status === 'ok') {
    console.log(`✓ ${row.host} → ${row.type} ${row.value}`);
  } else {
    console.log(`✗ ${row.host} → ${row.error}`);
  }
}

console.log(`
Expected setup (Circle custom root domain):
  • ${APEX}     → Railway (marketing site) — already working
  • ${WWW} → Circle CNAME from Admin → Settings → Custom domain

Until www resolves:
  • Use https://pmstructure.circle.so for community access
  • Use https://login.circle.so/sign_in for admin login
  • pmstructure.com/join redirects to Circle native URL (after deploy)
`);

process.exit(www.status === 'ok' ? 0 : 1);
