import { NewsletterPostEditor } from '@/components/pages/admin/NewsletterPostEditor';

export default async function EditNewsletterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsletterPostEditor postId={id} />;
}
