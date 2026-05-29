import { WebsiteDataEditor } from '@/components/pages/admin/WebsiteData';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-section text-3xl md:text-4xl mb-2">Certification portfolio</h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Edit hero and listing copy for the certifications hub — your public pathway portfolio on{' '}
          <code className="font-mono text-xs">/certifications</code>.
        </p>
      </header>
      <WebsiteDataEditor initialPage="certifications" />
    </div>
  );
}
