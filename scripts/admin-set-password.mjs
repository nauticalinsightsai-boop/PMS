#!/usr/bin/env node
/**
 * Set dashboard admin password directly (when email reset is blocked).
 * Usage:
 *   node scripts/admin-set-password.mjs --email=nauticalinsights.ai@gmail.com --password='YourNewSecurePass12!'
 */
import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { loadMonorepoEnv, applyToProcessEnv } from './lib/monorepo-env.mjs';
import { createClient } from '@supabase/supabase-js';

const scryptAsync = promisify(scrypt);
const KEY_LEN = 64;

applyToProcessEnv(loadMonorepoEnv());

const emailArg = process.argv.find((a) => a.startsWith('--email='))?.split('=')[1]?.trim();
const passwordArg = process.argv.find((a) => a.startsWith('--password='))?.split('=')[1];

const email = emailArg?.toLowerCase();
const password = passwordArg;

if (!email || !password) {
  console.error('Usage: node scripts/admin-set-password.mjs --email=admin@example.com --password=\'Min12Chars!\'');
  process.exit(1);
}
if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in .env.local');
  process.exit(1);
}

async function hashPassword(plain) {
  const salt = randomBytes(16);
  const derived = await scryptAsync(plain, salt, KEY_LEN);
  return `scrypt:${salt.toString('base64url')}:${derived.toString('base64url')}`;
}

const admin = createClient(url, key, { auth: { persistSession: false } });
const db = admin.schema('dashboard_one');

const password_hash = await hashPassword(password);
const { error } = await db.from('user_credentials').upsert(
  {
    email,
    password_hash,
    must_reset_password: false,
    updated_at: new Date().toISOString(),
  },
  { onConflict: 'email' },
);

if (error) {
  console.error('Failed:', error.message);
  process.exit(1);
}

console.log('OK — password updated for', email);
console.log('Sign in at https://pmstructure.com/admin/login with the new password.');
