#!/usr/bin/env node
/**
 * Mount dashboard UI + API inside the marketing app for single-Vercel deployment.
 * Run before `next dev` / `next build` in frontend (see frontend/package.json).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FE = path.join(ROOT, 'frontend');
const ADMIN = path.join(FE, 'app', 'admin');
const DASH_FE = path.join(ROOT, 'dashboard', 'frontend');
const DASH_BE = path.join(ROOT, 'dashboard', 'backend');

const UI_LINKS = [
  { name: 'login', src: path.join(DASH_FE, 'app', 'login') },
  { name: 'dashboard', src: path.join(DASH_FE, 'app', 'dashboard') },
];

const API_BACKEND_DIRS = ['auth', 'cms', 'admin', 'interactions', 'profile'];

function rmIfExists(target) {
  if (!fs.existsSync(target)) return;
  const stat = fs.lstatSync(target);
  if (stat.isSymbolicLink() || stat.isFile()) fs.unlinkSync(target);
  else fs.rmSync(target, { recursive: true, force: true });
}

function symlinkRelative(target, linkPath) {
  fs.mkdirSync(path.dirname(linkPath), { recursive: true });
  rmIfExists(linkPath);
  const rel = path.relative(path.dirname(linkPath), target);
  fs.symlinkSync(rel, linkPath);
}

function main() {
  fs.mkdirSync(ADMIN, { recursive: true });

  for (const { name, src } of UI_LINKS) {
    if (!fs.existsSync(src)) {
      console.error(`Missing dashboard UI path: ${src}`);
      process.exit(1);
    }
    symlinkRelative(src, path.join(ADMIN, name));
  }

  const adminApi = path.join(ADMIN, 'api');
  fs.mkdirSync(adminApi, { recursive: true });

  for (const dir of API_BACKEND_DIRS) {
    const src = path.join(DASH_BE, 'app', 'api', dir);
    if (!fs.existsSync(src)) continue;
    symlinkRelative(src, path.join(adminApi, dir));
  }

  const channelApi = path.join(DASH_FE, 'app', 'api', 'channel-landing-pages');
  if (fs.existsSync(channelApi)) {
    symlinkRelative(channelApi, path.join(adminApi, 'channel-landing-pages'));
  }

  console.log('Synced admin routes → frontend/app/admin/');
}

main();
