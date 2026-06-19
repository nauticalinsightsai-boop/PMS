/**
 * HTTP smoke test for marketing routes (run against `next start`).
 * Usage: node scripts/performance-route-smoke.mjs [baseUrl]
 */
const base = (process.argv[2] || process.env.PERF_SMOKE_BASE_URL || 'http://localhost:3051').replace(/\/$/, '');

const ROUTES = [
  { path: '/', mustInclude: ['Featured Pathways', 'PMP 2026'] },
  { path: '/certifications', mustInclude: ['Find your', 'pathway'] },
  { path: '/certifications/pmp', mustInclude: ['PMP', 'Certification'] },
  { path: '/membership', mustInclude: ['Membership'] },
  { path: '/newsletter', mustInclude: ['Newsletter'] },
  { path: '/community', mustInclude: ['Community'] },
  { path: '/community?view=store', mustInclude: ['store', 'Resource'] },
  { path: '/about', mustInclude: ['Mission'] },
  { path: '/contact', mustInclude: ['Contact'] },
  { path: '/faq', mustInclude: ['FAQ'] },
  { path: '/certifications/compare', mustInclude: ['Compare'] },
  { path: '/blog', mustInclude: ['Blog'] },
  { path: '/pm-service', mustInclude: ['Services'] },
];

async function checkRoute({ path, mustInclude }) {
  const url = `${base}${path}`;
  const res = await fetch(url, { redirect: 'follow' });
  const html = await res.text();
  if (!res.ok) {
    throw new Error(`${path} returned ${res.status}`);
  }
  for (const snippet of mustInclude) {
    if (!html.toLowerCase().includes(snippet.toLowerCase())) {
      throw new Error(`${path} missing expected content: "${snippet}"`);
    }
  }
  return { path, status: res.status, bytes: html.length };
}

async function main() {
  console.log(`Performance route smoke @ ${base}`);
  const results = [];
  for (const route of ROUTES) {
    const result = await checkRoute(route);
    results.push(result);
    console.log(`  OK ${result.path} (${result.bytes} bytes)`);
  }
  console.log(`All ${results.length} routes passed.`);
}

main().catch((err) => {
  console.error('Route smoke failed:', err.message);
  process.exit(1);
});
