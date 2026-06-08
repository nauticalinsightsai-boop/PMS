import type { Metadata } from 'next';
import { montserrat } from '@pms/ui/fonts';
import '../../../dashboard/frontend/app/globals.css';
import { ClientProviders } from '../../../dashboard/frontend/components/ClientProviders';

export const metadata: Metadata = {
  title: 'PMS Admin Dashboard',
  description: 'PM Structure administration',
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <div className={`${montserrat.className} ${montserrat.variable} antialiased min-h-screen`}>
        <ClientProviders>{children}</ClientProviders>
      </div>
    </>
  );
}
