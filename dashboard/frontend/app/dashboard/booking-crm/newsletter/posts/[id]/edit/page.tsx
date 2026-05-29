import { NewsletterPostEditor } from '@/components/pages/admin/NewsletterPostEditor';

export default async function EditNewsletterPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsletterPostEditor postId={id} />;
}
