#!/usr/bin/env node
/**
 * Check public DNS for Resend domain verification on pmstructure.com.
 * Usage: node scripts/check-resend-dns.mjs [domain]
 */
import { spawnSync } from 'child_process';

const domain = process.argv[2]?.trim() || 'pmstructure.com';

function dig(type, name) {
  const r = spawnSync('dig', ['+short', type, name, '@8.8.8.8'], { encoding: 'utf8' });
  return (r.stdout || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

const checks = [
  {
    label: 'DKIM (resend._domainkey)',
    name: `resend._domainkey.${domain}`,
    type: 'TXT',
    required: true,
  },
  {
    label: 'SPF (send subdomain TXT)',
    name: `send.${domain}`,
    type: 'TXT',
    required: true,
  },
  {
    label: 'SPF (send subdomain MX)',
    name: `send.${domain}`,
    type: 'MX',
    required: true,
  },
];

console.log(`=== Resend DNS check for ${domain} ===\n`);

let missing = 0;
for (const check of checks) {
  const values = dig(check.type, check.name);
  const ok = values.length > 0;
  console.log(`${ok ? '✓' : '✗'} ${check.label}`);
  console.log(`  ${check.name} ${check.type}`);
  if (values.length) values.forEach((v) => console.log(`  → ${v}`));
  else {
    missing += 1;
    console.log('  → (missing)');
  }
  console.log('');
}

if (missing) {
  console.log('Action required:');
  console.log('  1. Open https://resend.com/domains and open pmstructure.com');
  console.log('  2. Add the missing records at Namecheap (registrar-servers.com)');
  console.log('  3. Click Verify in Resend (can take up to 72h, often minutes)');
  console.log('  4. On Railway PMS set RESEND_DOMAIN_VERIFIED=true and redeploy');
  process.exit(1);
}

console.log('✓ Required Resend DNS records are present.');
console.log('If Resend still shows unverified, click Verify again in the dashboard.');
