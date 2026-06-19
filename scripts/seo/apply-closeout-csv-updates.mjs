/**
 * Apply SEO closeout register updates (B15 + June 2026 schedule marks).
 * Run: node scripts/seo/apply-closeout-csv-updates.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const internal = path.join(__dirname, '../../docs/internal');

function readCsv(file) {
  const text = fs.readFileSync(path.join(internal, file), 'utf8').trim();
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map((line) => {
    const cells = [];
    let cur = '';
    let q = false;
    for (const ch of line) {
      if (ch === '"') {
        q = !q;
        continue;
      }
      if (ch === ',' && !q) {
        cells.push(cur);
        cur = '';
        continue;
      }
      cur += ch;
    }
    cells.push(cur);
    const o = {};
    headers.forEach((h, i) => {
      o[h] = cells[i] ?? '';
    });
    return o;
  });
  return { headers, rows };
}

function writeCsv(file, headers, rows) {
  const esc = (v) => {
    const s = String(v ?? '');
    return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => esc(row[h])).join(','));
  }
  fs.writeFileSync(path.join(internal, file), `${lines.join('\n')}\n`, 'utf8');
}

function appendNote(notes, phrase) {
  const base = (notes || '').replace(/\s+/g, ' ').trim();
  if (!phrase) return base;
  if (base.includes(phrase)) return base;
  return base ? `${base}. ${phrase}` : phrase;
}

// --- On-page audit ---
{
  const { headers, rows } = readCsv('pmstructure-on-page-seo-audit.csv');
  for (const row of rows) {
    if (row.Route === '/') {
      row.H1_Current = 'Project management guidance';
      row.H1_Status = 'OK';
      row.Notes = 'G1 owner default 2026-06-19: keep broad H1 post lean-down';
    }
    if (row.Route === '/pmp-exam-2026') {
      row.Title_Current = 'PMP Exam 2026 Guide | PM Structure';
      row.Title_Status = 'OK';
      row.Meta_Current = 'Deep PMP exam 2026 readiness guide (phase-2-page-seo.ts)';
      row.Meta_Status = 'OK';
      row.H1_Current = 'PMP Exam 2026: deep readiness guide';
      row.H1_Status = 'OK';
      row.H2_Issues = 'Cluster page';
      row.Action = 'None';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'Phase 1.1 closeout 2026-06-19';
    }
    if (row.Route === '/pmp-readiness-diagnostic') {
      row.Title_Current = 'PMP Readiness Diagnostic | PM Structure';
      row.Title_Recommended = 'PMP Readiness Diagnostic | PM Structure';
      row.Title_Status = 'OK';
      row.Meta_Current = 'Structured PMP readiness diagnostic (phase-2-page-seo.ts)';
      row.Meta_Recommended = 'Structured PMP readiness diagnostic';
      row.Meta_Status = 'OK';
      row.H1_Current = 'PMP readiness diagnostic';
      row.H1_Recommended = 'PMP readiness diagnostic';
      row.H1_Status = 'OK';
      row.H2_Issues = 'None';
      row.Internal_Link_Issues = 'Links to commercial pathway';
      row.Form_Issues = 'None';
      row.Action = 'None';
      row.Owner_Approval = 'None';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'Phase 1.1 closeout 2026-06-19';
    }
    if (row.Route === '/community' || row.Route === '/membership') {
      row.H2_Issues = 'None';
      row.Mobile_Issues = 'None';
      row.Action = 'None';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'Visible breadcrumbs + BreadcrumbJsonLd 2026-06-19';
    }
    if (row.Route === '/certifications/compare') {
      row.H2_Issues = 'H2 picker + matrix + advisor CTA';
      row.Internal_Link_Issues = 'PMP commercial link + roadmap CTA added';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'Compare body QA 2026-06-19';
    }
    if (row.Route === '/blog') {
      row.Title_Status = 'OK';
      row.Meta_Status = 'OK';
      row.H1_Status = 'OK';
      row.Action = 'noindex until content (G4 default)';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'robots noindex + excluded from sitemap 2026-06-19';
    }
  }
  writeCsv('pmstructure-on-page-seo-audit.csv', headers, rows);
}

// --- Priority URL QA ---
{
  const { headers, rows } = readCsv('pmstructure-priority-url-qa.csv');
  for (const row of rows) {
    if (row.Route === '/certifications/compare') {
      row.Title_Status = 'Verified';
      row.Meta_Status = 'Verified';
      row.H1_Status = 'Verified';
      row.CTA_Status = 'Verified';
      row.Crawl_Status = 'Pending crawl';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'Body QA + PMP link + roadmap CTA 2026-06-19';
    }
    if (row.Route === '/pmp-exam-2026') {
      row.Title_Status = 'Verified';
      row.Meta_Status = 'Verified';
      row.H1_Status = 'Verified';
      row.Recommended_Action = 'None';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'phase-2-page-seo.ts + distinct H1 2026-06-19';
    }
    if (row.Route === '/pmp-readiness-diagnostic') {
      row.Title_Status = 'Verified';
      row.Meta_Status = 'Verified';
      row.H1_Status = 'Verified';
      row.Recommended_Action = 'None';
      row.Implementation_Status = 'Implemented';
      row.Notes = 'phase-2-page-seo.ts 2026-06-19';
    }
  }
  writeCsv('pmstructure-priority-url-qa.csv', headers, rows);
}

// --- Owner action list decisions ---
{
  const { headers, rows } = readCsv('pmstructure-final-owner-action-list.csv');
  for (const row of rows) {
    if (row.Action_ID === 'OA-004') {
      row.Status = 'Verified';
      row.Notes =
        'G2 owner default 2026-06-19: keep T-032 /pmp hub live alongside /certifications/pmp; no 301.';
    }
    if (row.Action_ID === 'OA-005') {
      row.Status = 'Verified';
      row.Notes =
        'G3 owner default 2026-06-19: keep /pmp-exam-2026 cluster; metadata fixed; no 301.';
    }
    if (row.Action_ID === 'OA-008') {
      row.Notes = 'G5 owner default 2026-06-19: regional routes deferred; schedule rows Blocked.';
    }
    if (row.Action_ID === 'OA-011') {
      row.Notes = 'G6 unchanged: testimonials stay removed until written permission.';
    }
  }
  writeCsv('pmstructure-final-owner-action-list.csv', headers, rows);
}

// --- Marketing schedule status marks ---
{
  const doneWebsite = new Set([
    '2026-06-18',
    '2026-06-19',
    '2026-06-20',
    '2026-06-24',
    '2026-06-25',
    '2026-06-26',
    '2026-06-27',
    '2026-07-01',
    '2026-07-02',
    '2026-07-03',
    '2026-07-06',
    '2026-07-11',
  ]);
  const doneNotes = {
    '2026-06-20': 'T169 eligibility section on /pmp-exam-2026#eligibility-training-hours',
    '2026-07-02': 'FAQ hub + T169 eligibility section live in repo',
    '2026-07-03': '/answers/pmp-training-hours-vs-pdus published 2026-06-19',
    '2026-07-06': 'Compliance section on /pmp-exam-2026 (#compliance)',
    '2026-07-11': '/answers/what-are-the-pmp-2026-domain-weights + cluster pages',
  };
  const naWebsite = new Set(['2026-06-25', '2026-06-26', '2026-06-27']);
  const blockedRegional = new Set([
    '2026-07-23',
    '2026-07-24',
    '2026-07-28',
    '2026-07-30',
    '2026-08-04',
  ]);
  const { headers, rows } = readCsv('pmstructure-90-day-marketing-schedule.csv');
  for (const row of rows) {
    const date = row.Date;
    const channel = row.Channel;
    if (channel === 'Website') {
      if (blockedRegional.has(date)) {
        row.Status = 'Blocked';
        row.Notes = appendNote(row.Notes, 'OA-008 deferred');
      } else if (naWebsite.has(date)) {
        row.Status = 'N/A';
        row.Notes = appendNote(row.Notes, 'Answer page live in repo');
      } else if (doneWebsite.has(date)) {
        row.Status = 'Done';
        row.Notes = appendNote(
          row.Notes,
          doneNotes[date] || 'Verified in repo 2026-06-19',
        );
      }
    }
    if (channel === 'LinkedIn' || channel === 'X / Threads' || channel === 'Email / Newsletter') {
      row.Notes = appendNote(row.Notes, 'Owner content — not dev');
    }
    if (channel === 'Internal') {
      row.Notes = appendNote(row.Notes, 'Owner ops — not dev');
    }
  }
  writeCsv('pmstructure-90-day-marketing-schedule.csv', headers, rows);
}

console.log('apply-closeout-csv-updates OK');
