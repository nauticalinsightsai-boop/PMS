import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PMStructure — Project Management Certifications',
  description: 'The Future of Project Leadership',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
