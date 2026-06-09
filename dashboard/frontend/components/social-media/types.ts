export type BrandCode = 'PMS' | 'NI' | 'INT' | 'GFW';

export type CalendarView = 'day' | 'week' | 'month';

export type RowMode = 'split' | 'switch';

export type Phase = 'post' | 'generation';

export type TaskStatus = 'scheduled' | 'in_progress' | 'ready' | 'published' | 'complete' | 'missed';

export type Urgency = 'normal' | 'urgent' | 'overdue';

export interface PublishingTask {
  id: string;
  brand: BrandCode;
  channel: string;
  formatLabel: string;
  phase: Phase;
  publishingDate: string;
  status: TaskStatus;
  urgency: Urgency;
  countdown: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
}

export interface CapacitySettings {
  maxGenerationTasksPerDay: number;
  maxPublishingTasksPerDay: number;
  maxGenerationWorkloadPerDay: number;
  maxPublishingWorkloadPerDay: number;
  maxShortVideoPerDay: number;
  maxLongFormPerDay: number;
  maxAudioVideoPerDay: number;
  defaultLeadTimeDays: number;
  preferWeekdays: boolean;
  allowSaturday: boolean;
  excludeSunday: boolean;
}

export const DEFAULT_CAPACITY: CapacitySettings = {
  maxGenerationTasksPerDay: 6,
  maxPublishingTasksPerDay: 4,
  maxGenerationWorkloadPerDay: 8,
  maxPublishingWorkloadPerDay: 6,
  maxShortVideoPerDay: 2,
  maxLongFormPerDay: 1,
  maxAudioVideoPerDay: 2,
  defaultLeadTimeDays: 3,
  preferWeekdays: true,
  allowSaturday: true,
  excludeSunday: true,
};

export const BRAND_COLORS: Record<BrandCode, string> = {
  PMS: '#ff4a38',
  NI: '#2851b9',
  INT: '#bc6ae2',
  GFW: '#57d5e2',
};
