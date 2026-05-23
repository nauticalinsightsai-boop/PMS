import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PM Structure — Project readiness',
  description:
    'Independent exam prep across PMI, PRINCE2, and Six Sigma. Prepare with structure. Manage with discipline. Deliver with control.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
