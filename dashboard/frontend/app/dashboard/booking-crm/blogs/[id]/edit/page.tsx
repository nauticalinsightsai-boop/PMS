import { PostEditor } from '@/components/pages/admin/cms/PostEditor';

export default async function EditBlogArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PostEditor
      postId={id}
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
