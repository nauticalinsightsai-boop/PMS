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
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <RegionProvider>
      <RegionGate>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/30 via-porcelain to-violet-50/25 dark:from-[#07071c] dark:via-obsidian dark:to-[#0a1535] text-slate-900 dark:text-white">
          <Navbar toggleTheme={() => setIsDarkMode((v) => !v)} isDarkMode={isDarkMode} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </RegionGate>
    </RegionProvider>
  );
}
