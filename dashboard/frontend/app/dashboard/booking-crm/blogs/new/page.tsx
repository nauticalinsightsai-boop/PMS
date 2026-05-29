import { PostEditor } from '@/components/pages/admin/cms/PostEditor';

export default function NewBlogArticlePage() {
  return (
    <PostEditor
      basePath="/dashboard/booking-crm/blogs"
      breadcrumbLabel="Blogs"
      newTitle="New Article"
      editTitle="Edit Article"
      saveCreateLabel="Create Article"
      saveUpdateLabel="Update Article"
      backLabel="Back to blogs"
    />
  );
}
