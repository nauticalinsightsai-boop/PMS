#!/usr/bin/env node
/**
 * Lists NEXT_PUBLIC_CALENDLY_PATHWAY_* env var names for every cert × tier in the regional catalogue.
 * Usage:
 *   node scripts/print-pathway-calendly-env-keys.mjs
 *   node scripts/print-pathway-calendly-env-keys.mjs --dotenv   # .env snippet (commented)
 *   node scripts/print-pathway-calendly-env-keys.mjs --markdown   # table for docs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const MATRIX_COURSE_TO_SITE_ID = {
  'CAPM Preparation': 'capm',
  'PMP Preparation': 'pmp',
  'PgMP Preparation': 'pgmp',
  'PfMP Preparation': 'pfmp',
  'PMI-ACP Preparation': 'pmi-acp',
  'PMI-RMP Preparation': 'pmi-rmp',
  'PMI-SP Preparation': 'pmi-sp',
  'PMI-PBA Preparation': 'pmi-pba',
  'PMI-CP Preparation': 'pmi-cp',
  'PMI-PMOCP Preparation': 'pmi-pmocp',
  'PMI-CPMAI Preparation': 'pmi-cpmai',
  'PRINCE2 7 Foundation Preparation': 'prince2',
  'PRINCE2 7 Practitioner Preparation': 'prince2-practitioner',
  'PRINCE2 Agile Foundation Preparation': 'prince2-agile',
  'PRINCE2 Agile Practitioner Preparation': 'prince2-agile-practitioner',
  'MSP Foundation Preparation': 'msp',
  'MSP Practitioner Preparation': 'msp',
  'MoP Foundation Preparation': 'mop',
  'MoP Practitioner Preparation': 'mop',
  'M_o_R Foundation Preparation': 'mor',
  'M_o_R 4 Practitioner Preparation': 'mor',
  'P3O Foundation Preparation': 'p3o',
  'P3O Practitioner Preparation': 'p3o',
  'Six Sigma Champion': 'lss-champion',
  'Six Sigma White Belt': 'lss-white',
  'Six Sigma Yellow Belt': 'lss-yellow',
  'Six Sigma Green Belt': 'lss-green',
  'Six Sigma Black Belt': 'lss-black',
  'Six Sigma Master Black Belt': 'lss-master',
};

function pathwayCalendlyEnvVarName(siteCertId, tierId) {
  const token = `PATHWAY_${siteCertId}_${tierId}`.replace(/-/g, '_').toUpperCase();
  return `NEXT_PUBLIC_CALENDLY_${token}`;
}

function enrollTierSlug(tierId) {
  if (tierId === 'mastery_corporate') return 'mastery-corporate';
  if (tierId === 'mastery_advisory') return 'mastery-advisory';
  return tierId;
}

const catalogue = JSON.parse(
  fs.readFileSync(path.join(root, 'frontend/data/regional-catalogue.json'), 'utf8'),
);

/** @type {Map<string, { siteCertId: string, tierId: string, courseName: string, offeringId: string }>} */
const rows = new Map();

for (const o of catalogue.offerings) {
  const siteCertId = MATRIX_COURSE_TO_SITE_ID[o.courseName];
  if (!siteCertId) continue;
  const key = `${siteCertId}:${o.tierId}`;
  if (!rows.has(key)) {
    rows.set(key, {
      siteCertId,
      tierId: o.tierId,
      courseName: o.courseName,
      offeringId: o.offeringId,
    });
  }
}

const sorted = [...rows.values()].sort((a, b) => {
  const c = a.siteCertId.localeCompare(b.siteCertId);
  return c !== 0 ? c : a.tierId.localeCompare(b.tierId);
});

const mode = process.argv[2] ?? 'list';

if (mode === '--dotenv') {
  console.log('# Pathway consultation Calendly URLs (one event per cert × tier)');
  console.log('# https://calendly.com/booking-sh3ikhmabz/...');
  for (const row of sorted) {
    console.log(`# ${row.courseName} · ${row.tierId} → /certifications/${row.siteCertId}/${enrollTierSlug(row.tierId)}/enroll`);
    console.log(`# ${pathwayCalendlyEnvVarName(row.siteCertId, row.tierId)}=`);
  }
  console.log('');
  console.log('# Enrollment success — WhatsApp + support');
  console.log('# NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/XXXXXXXXXXX');
  process.exit(0);
}

if (mode === '--markdown') {
  console.log('| Env variable | Certification | Tier | Enroll URL |');
  console.log('|--------------|---------------|------|------------|');
  for (const row of sorted) {
    const env = pathwayCalendlyEnvVarName(row.siteCertId, row.tierId);
    const enroll = `/certifications/${row.siteCertId}/${enrollTierSlug(row.tierId)}/enroll`;
    console.log(`| \`${env}\` | ${row.siteCertId} | ${row.tierId} | ${enroll} |`);
  }
  process.exit(0);
}

console.log(`Pathway Calendly env keys (${sorted.length} cert×tier pairs):\n`);
for (const row of sorted) {
  console.log(pathwayCalendlyEnvVarName(row.siteCertId, row.tierId));
}
