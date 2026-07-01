import { afterEach, describe, expect, it } from 'vitest';
import {
  isR2ProgrammeMediaConfigured,
  programmeMediaStorageDriver,
  programmeMediaUsesR2,
} from './r2-programme-media';

const ENV_KEYS = [
  'PROGRAMME_MEDIA_STORAGE',
  'R2_ACCOUNT_ID',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
  'R2_BUCKET_NAME',
  'R2_PUBLIC_BASE_URL',
] as const;

const snapshot = Object.fromEntries(ENV_KEYS.map((k) => [k, process.env[k]]));

afterEach(() => {
  for (const key of ENV_KEYS) {
    const value = snapshot[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

function setR2Env(partial: Partial<Record<(typeof ENV_KEYS)[number], string>>) {
  for (const key of ENV_KEYS) delete process.env[key];
  Object.assign(process.env, partial);
}

describe('programme media storage driver', () => {
  it('uses r2 when PROGRAMME_MEDIA_STORAGE=r2 and credentials are set', () => {
    setR2Env({
      PROGRAMME_MEDIA_STORAGE: 'r2',
      R2_ACCOUNT_ID: 'acct',
      R2_ACCESS_KEY_ID: 'key',
      R2_SECRET_ACCESS_KEY: 'secret',
      R2_BUCKET_NAME: 'bucket',
      R2_PUBLIC_BASE_URL: 'https://media.example.com',
    });
    expect(isR2ProgrammeMediaConfigured()).toBe(true);
    expect(programmeMediaStorageDriver()).toBe('r2');
    expect(programmeMediaUsesR2()).toBe(true);
  });

  it('defaults to r2 when PROGRAMME_MEDIA_STORAGE is unset', () => {
    setR2Env({});
    expect(programmeMediaStorageDriver()).toBe('r2');
    expect(programmeMediaUsesR2()).toBe(true);
  });

  it('prefers supabase when driver is supabase', () => {
    setR2Env({
      PROGRAMME_MEDIA_STORAGE: 'supabase',
      R2_ACCOUNT_ID: 'acct',
      R2_ACCESS_KEY_ID: 'key',
      R2_SECRET_ACCESS_KEY: 'secret',
      R2_BUCKET_NAME: 'bucket',
      R2_PUBLIC_BASE_URL: 'https://media.example.com',
    });
    expect(programmeMediaStorageDriver()).toBe('supabase');
    expect(programmeMediaUsesR2()).toBe(false);
  });
});
