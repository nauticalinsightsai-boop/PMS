import { NewsletterAuthorEditor } from '@/components/pages/admin/newsletter/NewsletterAuthorEditor';

export default async function EditNewsletterAuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsletterAuthorEditor authorId={id} />;
}
