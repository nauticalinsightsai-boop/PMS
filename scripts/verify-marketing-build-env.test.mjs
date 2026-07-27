import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getMissingPublicMarketingBuildVariables,
  verifyPublicMarketingBuildVariables,
} from './verify-marketing-build-env.mjs';

describe('verifyPublicMarketingBuildVariables', () => {
  it('accepts non-placeholder GA4, Meta, and Supabase public identifiers', () => {
    assert.doesNotThrow(() =>
      verifyPublicMarketingBuildVariables({
        NEXT_PUBLIC_GA_MEASUREMENT_ID: 'configured-ga-id',
        NEXT_PUBLIC_META_PIXEL_ID: 'configured-meta-id',
        NEXT_PUBLIC_SUPABASE_URL: 'https://project-ref.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'configured-anon-key',
      }),
    );
  });

  it('rejects empty or missing public identifiers without printing their values', () => {
    const env = {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: '   ',
    };

    assert.deepEqual(getMissingPublicMarketingBuildVariables(env), [
      'NEXT_PUBLIC_GA_MEASUREMENT_ID',
      'NEXT_PUBLIC_META_PIXEL_ID',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ]);
    assert.throws(
      () => verifyPublicMarketingBuildVariables(env),
      /NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    );
  });

  it('rejects placeholder Supabase values before they can enter the client bundle', () => {
    assert.throws(
      () =>
        verifyPublicMarketingBuildVariables({
          NEXT_PUBLIC_GA_MEASUREMENT_ID: 'configured-ga-id',
          NEXT_PUBLIC_META_PIXEL_ID: 'configured-meta-id',
          NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'configured-anon-key',
        }),
      /placeholder Supabase host/,
    );
    assert.throws(
      () =>
        verifyPublicMarketingBuildVariables({
          NEXT_PUBLIC_GA_MEASUREMENT_ID: 'configured-ga-id',
          NEXT_PUBLIC_META_PIXEL_ID: 'configured-meta-id',
          NEXT_PUBLIC_SUPABASE_URL: 'https://project-ref.supabase.co',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-key',
        }),
      /placeholder value/,
    );
  });

  it('is wired into the Docker builder after public ARG and ENV declarations', async () => {
    const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
    const dockerfile = await readFile(resolve(repositoryRoot, 'Dockerfile'), 'utf8');

    for (const name of [
      'NEXT_PUBLIC_GA_MEASUREMENT_ID',
      'NEXT_PUBLIC_META_PIXEL_ID',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ]) {
      assert.match(dockerfile, new RegExp(`ARG ${name}(?:\\r?\\n)`));
      assert.match(dockerfile, new RegExp(`ENV ${name}=\\$${name}(?:\\r?\\n)`));
    }
    assert.match(
      dockerfile,
      /RUN node scripts\/verify-marketing-build-env\.mjs\r?\nRUN npm run build -w @pms\/frontend/,
    );
  });
});
