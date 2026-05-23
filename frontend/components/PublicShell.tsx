'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RegionProvider } from '@/contexts/RegionContext';
import { RegionGate } from '@/components/RegionGate';

export function PublicShell({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark =
      stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <RegionProvider>
      <RegionGate>
        <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-[var(--shell-gradient-from)] via-[var(--shell-gradient-via)] to-[var(--shell-gradient-to)] dark:from-[var(--shell-gradient-dark-from)] dark:via-[var(--shell-gradient-dark-via)] dark:to-[var(--shell-gradient-dark-to)] text-foreground">
          <Navbar toggleTheme={() => setIsDarkMode((v) => !v)} isDarkMode={isDarkMode} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </RegionGate>
    </RegionProvider>
  );
}
