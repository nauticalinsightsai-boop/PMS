import { TopicEditor } from '@/components/pages/admin/cms/TopicEditor';

export default async function EditTopicPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TopicEditor topicId={id} />;
}
