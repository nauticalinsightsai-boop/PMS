import fs from 'fs';

const planPath = 'c:/Users/Sh3ik/.cursor/plans/seo_remaining_closeout_c8c86d99.plan.md';
let text = fs.readFileSync(planPath, 'utf8');

const copyReadyMkt = new Set([
  'mkt-20260628', 'mkt-20260629', 'mkt-20260630',
  'mkt-20260704', 'mkt-20260705', 'mkt-20260707', 'mkt-20260710', 'mkt-20260712', 'mkt-20260713',
  'mkt-20260718', 'mkt-20260719', 'mkt-20260720',
  'mkt-20260725', 'mkt-20260726', 'mkt-20260727',
  'mkt-20260801', 'mkt-20260802', 'mkt-20260803',
  'mkt-20260808', 'mkt-20260809', 'mkt-20260810',
  'mkt-20260815', 'mkt-20260816', 'mkt-20260817',
  'mkt-20260822', 'mkt-20260823', 'mkt-20260824',
  'mkt-20260829', 'mkt-20260830', 'mkt-20260831',
  'mkt-20260905', 'mkt-20260906', 'mkt-20260907', 'mkt-20260913', 'mkt-20260914',
]);

const ownerOpsCancelled = new Set([
  'mkt-20260708', 'mkt-20260715', 'mkt-20260722', 'mkt-20260729',
  'mkt-20260805', 'mkt-20260812', 'mkt-20260813', 'mkt-20260819',
  'mkt-20260821', 'mkt-20260825', 'mkt-20260826',
  'mkt-20260902', 'mkt-20260908', 'mkt-20260910', 'mkt-20260911',
  'mkt-20260915', 'mkt-20260916',
]);

const lines = text.split('\n');
let currentId = null;
let completed = 0;
let cancelled = 0;

for (let i = 0; i < lines.length; i++) {
  const idMatch = lines[i].match(/^\s+- id: (\S+)/);
  if (idMatch) currentId = idMatch[1];

  if (lines[i].includes('status: pending') && currentId) {
    if (copyReadyMkt.has(currentId)) {
      lines[i] = lines[i].replace('status: pending', 'status: completed');
      completed++;
    } else if (ownerOpsCancelled.has(currentId)) {
      lines[i] = lines[i].replace('status: pending', 'status: cancelled');
      cancelled++;
    }
  }
}

// Update execution status table
text = lines.join('\n');
text = text.replace(
  /\| Owner \(GSC, GA4, legal, regional, Sheets env\) \| 22 \| pending \|/,
  '| Owner (GSC, GA4, legal, regional, Sheets env) | 22 | **cancelled** (handoff ready) |',
);
text = text.replace(
  /\| Marketing schedule \(`mkt-\*`\) \| 64 \| pending \(9 dev Website rows completed\) \|/,
  '| Marketing schedule (`mkt-*`) | 64 | **copy ready / owner publish** (3 website copy pending) |',
);
text = text.replace(
  /\| Dev\/agent \(Phase A \+ B \+ success criteria\) \| 70 \| \*\*completed\*\* \|/,
  '| Dev/agent (Phase A + B + success criteria) | 70 | **completed** |',
);
text = text.replace(
  /\*\*Commits:\*\* `66112e6` → `0b00769`/,
  '**Commits:** `66112e6` → `5e01b40`',
);

fs.writeFileSync(planPath, text);
console.log(`Updated plan: ${completed} completed, ${cancelled} cancelled (owner ops)`);
