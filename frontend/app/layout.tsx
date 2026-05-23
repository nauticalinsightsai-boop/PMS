import type { Metadata } from 'next';
import { montserrat } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'PM Structure — Project readiness',
  description:
    'Independent exam prep across PMI, PRINCE2, and Six Sigma. Prepare with structure. Manage with discipline. Deliver with control.',
};

const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={montserrat.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
