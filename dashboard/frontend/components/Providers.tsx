'use client';

import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardModeProvider } from '@/contexts/DashboardModeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <NotificationProvider>
          <DashboardModeProvider>{children}</DashboardModeProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
