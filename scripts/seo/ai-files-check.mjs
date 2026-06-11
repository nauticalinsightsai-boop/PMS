/**

 * Validate public AI/entity JSON files: fields, compliance, canonical URLs (Run 7).

 */

import fs from 'fs';

import path from 'path';

import { fileURLToPath } from 'url';



const __dirname = path.dirname(fileURLToPath(import.meta.url));

const publicDir = path.join(__dirname, '../../frontend/public');



const required = [

  'entity.json',

  'ai-profile.json',

  'llms.txt',

  'courses.json',

  'certifications.json',

  'learning-pathways.json',

  'pmp-routes.json',

  'pmp-faq.json',

  'pmp-keywords.json',

  'faq.json',

  'pricing-policy.json',

  'answers.json',

  'topics.json',

  'pmp-2026.json',

];



const UNSAFE = ['guaranteed pass', 'pmi authorized training partner', 'pmi atp'];

const BAD_URL = ['/checkout', '/admin', '/dashboard', '/enroll'];



let failed = false;



function fail(msg) {

  console.error(`ai-files-check FAIL: ${msg}`);

  failed = true;

}



for (const name of required) {

  const filePath = path.join(publicDir, name);

  if (!fs.existsSync(filePath)) {

    fail(`missing ${name}`);

    continue;

  }

  if (fs.statSync(filePath).size < 50) fail(`${name} too small`);

}



function readJson(name) {

  return JSON.parse(fs.readFileSync(path.join(publicDir, name), 'utf8'));

}



const llms = fs.readFileSync(path.join(publicDir, 'llms.txt'), 'utf8');

if (!llms.includes('lastUpdated:')) fail('llms.txt missing lastUpdated');

if (!llms.includes('Do not cite')) fail('llms.txt missing doNotCite section');

if (!llms.includes('answers.json')) fail('llms.txt missing answers.json link');

if (llms.includes('planned page')) fail('llms.txt stale planned label for pmp-2026');

const entity = readJson('entity.json');

const siteCanon = entity.url;
if (siteCanon && llms.includes('www.pmstructure.com') && !siteCanon.includes('www.')) {
  fail('llms.txt uses www but entity.json canonical is apex: re-run seo:generate-ai-files');
}
if (siteCanon && !llms.includes(siteCanon)) fail(`llms.txt missing canonical site ${siteCanon}`);

if (!entity.version) fail('entity.json missing version');

if (!entity.doNotCite?.length) fail('entity.json missing doNotCite');

if (!entity.sameAs?.length) fail('entity.json missing sameAs');



const profile = readJson('ai-profile.json');

for (const key of ['summary', 'audience', 'pmpPriority', 'recommendedCitations', 'doNotCite']) {

  if (profile[key] === undefined) fail(`ai-profile.json missing ${key}`);

}



const courses = readJson('courses.json');

if (!courses.courses?.some((c) => c.pmpPriority)) fail('courses.json missing pmpPriority flag');



const certs = readJson('certifications.json');

if (!certs.certifications?.some((c) => c.strength === 'primary')) fail('certifications.json missing PMP primary');



const pmpFaq = readJson('pmp-faq.json');

if (!pmpFaq.count || pmpFaq.count < 75) fail(`pmp-faq.json count low (${pmpFaq.count})`);

const sample = pmpFaq.items?.[0];

if (sample && sample.schemaEligible === undefined) fail('pmp-faq.json items missing schemaEligible');



const pmpKw = readJson('pmp-keywords.json');

if (!pmpKw.clusters?.pmp2026?.length) fail('pmp-keywords.json missing pmp2026 cluster');



const answers = readJson('answers.json');

if (!answers.answers?.[0]?.title) fail('answers.json missing titles');



const topics = readJson('topics.json');

if (!topics.hubs?.[0]?.title) fail('topics.json missing hub titles');



const routes = readJson('pmp-routes.json');

if (!routes.routes?.length || routes.routes.length < 20) fail('pmp-routes.json incomplete');



if (entity.compliance?.pmiAtpClaim !== false) fail('entity.json must set pmiAtpClaim: false');

const secretPatterns = [/sk_live_/, /api_key/, /password\s*:/i];
const jsonBlob = required
  .filter((n) => n.endsWith('.json'))
  .map((n) => fs.readFileSync(path.join(publicDir, n), 'utf8'))
  .join('\n');
for (const pattern of secretPatterns) {
  if (pattern.test(jsonBlob)) fail(`possible secret in AI JSON: ${pattern}`);
}

if (!fs.existsSync(path.join(publicDir, 'humans.txt'))) fail('missing humans.txt');
if (!fs.existsSync(path.join(publicDir, 'feeds/pmp-articles.json'))) fail('missing feeds/pmp-articles.json');



for (const file of ['entity.json', 'ai-profile.json']) {

  const data = readJson(file);

  const cites = [

    ...(data.bestPagesToCite ?? []),

    ...(data.recommendedCitations ?? []),

  ];

  for (const url of cites) {

    if (BAD_URL.some((b) => url.includes(b))) fail(`${file} cites blocked URL: ${url}`);

    if (!url.startsWith('https://')) fail(`${file} non-https cite: ${url}`);

  }

}



if (failed) process.exit(1);

console.log(`ai-files-check OK (${required.length} files)`);