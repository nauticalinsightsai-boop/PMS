/**
 * Sync plan YAML todo statuses from classification JSON.
 * completed → completed, cancelled → cancelled
 * Also updates Complete To-Do List body markers [pending] → [completed]/[cancelled]
 */
import fs from 'fs';

const planPath = 'C:/Users/Sh3ik/.cursor/plans/pm_structure_master_seo_e3724eee.plan.md';
const statusPath = new URL('../docs/internal/evidence/_todo_status_batches.json', import.meta.url);
const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));

const completed = new Set(status.completed);
const cancelled = new Set(status.cancelled);

let text = fs.readFileSync(planPath, 'utf8');

// Update YAML frontmatter statuses by id block
text = text.replace(
  /^(\s+- id: ([A-Z0-9-]+)\n\s+content: .+\n\s+status: )(\w+)/gm,
  (full, prefix, id, cur) => {
    if (completed.has(id)) return `${prefix}completed`;
    if (cancelled.has(id)) return `${prefix}cancelled`;
    return full;
  },
);

// Update body Complete To-Do List markers
text = text.replace(/^- \*\*([A-Z0-9-]+)\*\* \[pending\]:/gm, (full, id) => {
  if (completed.has(id)) return `- **${id}** [completed]:`;
  if (cancelled.has(id)) return `- **${id}** [cancelled]:`;
  return full;
});

// Status banner
text = text.replace(
  /\*\*Status:\*\* Planning only — no implementation until explicitly executed\./,
  '**Status:** Execution in progress (2026-07-10). Redirects + lead popup shipped in repo; owner-gated items cancelled pending evidence. Deploy required for live 301s.',
);

fs.writeFileSync(planPath, text);

// Recount
const counts = { pending: 0, completed: 0, cancelled: 0, in_progress: 0 };
const re = /^\s+- id: ([A-Z0-9-]+)\n\s+content: .+\n\s+status: (\w+)/gm;
let m;
while ((m = re.exec(text))) counts[m[2]] = (counts[m[2]] || 0) + 1;
console.log('Plan YAML statuses after sync:', counts);
