'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getDashboardSessionToken,
  hasDashboardMutationAuth,
} from '@/lib/auth/dashboard-api-headers';
import { readDemoSessionEmail } from '@/lib/demo-auth';

export type DashboardApiAuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  hasToken: boolean;
  ready: boolean;
  needsSignIn: boolean;
  needsToken: boolean;
  getToken: () => string | null;
};

/**
 * Resolves dashboard Bearer auth for admin API routes (demo session or stored token).
 */
export function useDashboardApiAuth(): DashboardApiAuthState {
  const { user, loading, isAuthenticated } = useAuth();

  const getToken = useCallback(() => getDashboardSessionToken(), []);

  const hasToken = Boolean(getToken()) || hasDashboardMutationAuth() || Boolean(readDemoSessionEmail());
  const ready = isAuthenticated && hasToken;
  const needsSignIn = !loading && !isAuthenticated;
  const needsToken = !loading && isAuthenticated && !hasToken;

  return {
    isLoading: loading,
    isAuthenticated,
    hasToken,
    ready,
    needsSignIn,
    needsToken,
    getToken,
  };
}
