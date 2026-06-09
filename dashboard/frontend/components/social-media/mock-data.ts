import { addDays, format } from 'date-fns';
import type { ActivityItem, PublishingTask } from '@/components/social-media/types';

const base = new Date();

function d(offset: number) {
  return format(addDays(base, offset), 'yyyy-MM-dd');
}

export const MOCK_TASKS: PublishingTask[] = [
  {
    id: '1',
    brand: 'PMS',
    channel: 'LinkedIn',
    formatLabel: 'Thread · Micro-text',
    phase: 'post',
    publishingDate: d(0),
    status: 'in_progress',
    urgency: 'normal',
    countdown: '4h',
  },
  {
    id: '2',
    brand: 'NI',
    channel: 'Instagram',
    formatLabel: 'Carousel · Visual',
    phase: 'post',
    publishingDate: d(1),
    status: 'scheduled',
    urgency: 'urgent',
    countdown: '1d',
  },
  {
    id: '3',
    brand: 'INT',
    channel: 'YouTube',
    formatLabel: 'Long-form · Video',
    phase: 'generation',
    publishingDate: d(2),
    status: 'scheduled',
    urgency: 'normal',
    countdown: '2d',
  },
  {
    id: '4',
    brand: 'GFW',
    channel: 'X / Twitter',
    formatLabel: 'Post · Short',
    phase: 'post',
    publishingDate: d(0),
    status: 'scheduled',
    urgency: 'overdue',
    countdown: '−2h',
  },
  {
    id: '5',
    brand: 'PMS',
    channel: 'Podcast',
    formatLabel: 'Audio · Episode',
    phase: 'generation',
    publishingDate: d(3),
    status: 'ready',
    urgency: 'normal',
    countdown: '3d',
  },
  {
    id: '6',
    brand: 'NI',
    channel: 'Facebook',
    formatLabel: 'Reel · Short-video',
    phase: 'post',
    publishingDate: d(4),
    status: 'published',
    urgency: 'normal',
    countdown: 'Done',
  },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: 'a1', message: 'LinkedIn thread moved to Wed', timestamp: '2h ago' },
  { id: 'a2', message: 'NI Instagram marked urgent', timestamp: '4h ago' },
  { id: 'a3', message: 'GFW X post overdue', timestamp: '6h ago' },
];

export const WEEK_SUMMARY = {
  total: 12,
  overdue: 1,
  urgent: 2,
  inProgress: 3,
  pending: 4,
  posted: 2,
  conflicts: 1,
};
