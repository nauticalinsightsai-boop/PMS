import { PostsList } from '@/components/pages/admin/cms/PostsList';

export default function BlogsPage() {
  return (
    <PostsList
      basePath="/dashboard/booking-crm/blogs"
      title="Blogs & Insights"
      breadcrumbLabel="Blogs"
      subtitle="Content Management System — manage blog articles and insights."
      newLabel="New Article"
    />
  );
}
