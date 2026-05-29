import { PostsList } from '@/components/pages/admin/cms/PostsList';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-section text-3xl md:text-4xl mb-2">Insights & blog posts</h1>
        <p className="text-muted-foreground text-sm max-w-xl">
          Manage articles published on the public <code className="font-mono text-xs">/blog</code>{' '}
          route. Set status to Active and publish to go live.
        </p>
      </header>
      <PostsList />
    </div>
  );
}
