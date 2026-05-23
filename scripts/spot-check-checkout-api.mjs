/**
 * Smoke-test POST /api/checkout/create membership discount (80% usdCents).
 * Requires backend on NEXT_PUBLIC_API_URL or http://localhost:3001
 */
const API = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL || 'http://localhost:3001';

async function post(body) {
  const res = await fetch(`${API}/api/checkout/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

const base = {
  offeringId: 'pmp-preparation-professional',
  regionId: 'india',
  email: 'spot-check@test.local',
  residenceCountry: 'IN',
  billingCountry: 'IN',
};

const full = await post({ ...base, hasMembership: false });
const member = await post({ ...base, hasMembership: true });

if (full.status !== 200 || full.json.usdCents !== 89900) {
  console.error('FAIL: full price checkout', full.status, full.json);
  process.exit(1);
}

if (member.status !== 200 || member.json.usdCents !== 71920) {
  console.error('FAIL: membership checkout expected 71920 cents, got', member.json);
  process.exit(1);
}

console.log('PASS checkout API — full 89900, membership 71920 (80%)');
