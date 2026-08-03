import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { createClientMock, clientSentinel } = vi.hoisted(() => {
  const client = { kind: 'configured-supabase-client' };
  return {
    clientSentinel: client,
    createClientMock: vi.fn(() => client),
  };
});

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

const publicEnvNames = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const originalPublicEnv = Object.fromEntries(
  publicEnvNames.map((name) => [name, process.env[name]]),
) as Record<(typeof publicEnvNames)[number], string | undefined>;

function clearPublicSupabaseEnv() {
  for (const name of publicEnvNames) {
    delete process.env[name];
  }
}

function setValidPublicSupabaseEnv() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://project-ref.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'configured-anon-key';
}

describe.sequential('public Supabase client configuration', () => {
  beforeEach(() => {
    createClientMock.mockClear();
    vi.resetModules();
  });

  afterEach(() => {
    for (const name of publicEnvNames) {
      const value = originalPublicEnv[name];
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  });

  it('fails closed without creating a shared client when public env is missing', async () => {
    clearPublicSupabaseEnv();

    await expect(import('./supabase')).rejects.toThrow(
      /Supabase client configuration is unavailable/,
    );
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('creates the shared client with valid public env', async () => {
    setValidPublicSupabaseEnv();

    const { supabase } = await import('./supabase');

    expect(supabase).toBe(clientSentinel);
    expect(createClientMock).toHaveBeenCalledOnce();
    expect(createClientMock).toHaveBeenCalledWith(
      'https://project-ref.supabase.co',
      'configured-anon-key',
    );
  });

  it('fails closed without creating a browser client when public env is missing', async () => {
    clearPublicSupabaseEnv();
    const { createBrowserSupabaseClient } = await import('./supabase-browser.js');

    expect(() => createBrowserSupabaseClient()).toThrow(
      /Supabase browser client configuration is unavailable/,
    );
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('creates the browser client with valid public env', async () => {
    setValidPublicSupabaseEnv();
    const { createBrowserSupabaseClient } = await import('./supabase-browser.js');
    const client = createBrowserSupabaseClient();

    expect(client).toBe(clientSentinel);
    expect(createClientMock).toHaveBeenCalledOnce();
    expect(createClientMock).toHaveBeenCalledWith(
      'https://project-ref.supabase.co',
      'configured-anon-key',
    );
  });

  it('fails closed without creating the synced dashboard client when public env is missing', async () => {
    clearPublicSupabaseEnv();

    await expect(
      import('../../dashboard/frontend/lib/supabase'),
    ).rejects.toThrow(/Dashboard Supabase client configuration is unavailable/);
    expect(createClientMock).not.toHaveBeenCalled();
  });

  it('creates the synced dashboard client with valid public env', async () => {
    setValidPublicSupabaseEnv();

    const { isSupabaseAuthConfigured, supabase } = await import(
      '../../dashboard/frontend/lib/supabase'
    );

    expect(isSupabaseAuthConfigured).toBe(true);
    expect(supabase).toBe(clientSentinel);
    expect(createClientMock).toHaveBeenCalledOnce();
    expect(createClientMock).toHaveBeenCalledWith(
      'https://project-ref.supabase.co',
      'configured-anon-key',
    );
  });
});
