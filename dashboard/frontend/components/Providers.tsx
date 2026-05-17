'use client';

import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardModeProvider } from '@/contexts/DashboardModeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <DashboardModeProvider>{children}</DashboardModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
