'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  eachDayOfInterval,
  endOfMonth,
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  ClipboardList,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MOCK_ACTIVITY, MOCK_TASKS, WEEK_SUMMARY } from '@/components/social-media/mock-data';
import {
  BRAND_COLORS,
  DEFAULT_CAPACITY,
  type BrandCode,
  type CalendarView,
  type CapacitySettings,
  type Phase,
  type PublishingTask,
  type RowMode,
} from '@/components/social-media/types';

const BRANDS: BrandCode[] = ['PMS', 'NI', 'INT', 'GFW'];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function statusDotClass(urgency: PublishingTask['urgency'], status: PublishingTask['status']) {
  if (urgency === 'overdue') return 'bg-red-500';
  if (urgency === 'urgent') return 'bg-orange-500';
  if (status === 'published' || status === 'complete') return 'bg-green-500';
  return 'bg-muted-foreground/40';
}

function TaskCard({
  task,
  compact,
  active,
  onClick,
}: {
  task: PublishingTask;
  compact?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  const brandColor = BRAND_COLORS[task.brand];
  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-center gap-1 rounded px-1 py-0.5 text-left text-meta hover:bg-muted/60',
          active && 'ring-2 ring-brand-orange',
        )}
      >
        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: brandColor }} />
        <span className="truncate">{task.channel}</span>
        <span className="rounded bg-muted px-1 text-[10px] font-semibold">{task.brand}</span>
        <span className={cn('ml-auto h-1.5 w-1.5 rounded-full', statusDotClass(task.urgency, task.status))} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      draggable
      className={cn(
        'relative w-full cursor-grab rounded-lg border border-border bg-white/95 p-2 text-left shadow-sm transition-shadow dark:bg-slate-900/95',
        active && 'ring-2 ring-brand-orange',
      )}
    >
      <span className="absolute bottom-2 left-0 top-2 w-1 rounded-full" style={{ background: brandColor }} />
      <div className="pl-2">
        <div className="flex items-start justify-between gap-1">
          <span className="text-label truncate">{task.channel}</span>
          <span className="shrink-0 rounded bg-muted px-1 text-[10px] font-bold">{task.brand}</span>
        </div>
        <p className="text-meta text-muted-foreground truncate">{task.formatLabel}</p>
        <div className="mt-1 flex items-center justify-between">
          <span className={cn('h-2 w-2 rounded-full', statusDotClass(task.urgency, task.status))} />
          <span className="text-meta font-medium">{task.countdown}</span>
        </div>
      </div>
    </button>
  );
}

function RightSidebar({ tasks }: { tasks: PublishingTask[] }) {
  const [activityOpen, setActivityOpen] = useState(true);
  const upcoming = tasks.slice(0, 6);

  return (
    <aside className="flex h-full w-full flex-col gap-3 xl:w-80 xl:shrink-0">
      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-xl border border-border bg-white/95 shadow-sm backdrop-blur dark:bg-slate-900/95',
          activityOpen ? 'min-h-[33%]' : 'shrink-0',
        )}
      >
        <button
          type="button"
          onClick={() => setActivityOpen((v) => !v)}
          className="flex items-center justify-between px-4 py-3 text-label font-semibold"
        >
          Activity Feed
          <ChevronDown size={16} className={cn('transition-transform', !activityOpen && '-rotate-90')} />
        </button>
        {activityOpen && (
          <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
            <p className="text-meta mb-3 text-muted-foreground">
              <span>Total {WEEK_SUMMARY.total}</span>
              {WEEK_SUMMARY.overdue > 0 && <span className="text-red-500"> · Overdue {WEEK_SUMMARY.overdue}</span>}
              {WEEK_SUMMARY.urgent > 0 && (
                <span className="text-orange-500"> · Urgent {WEEK_SUMMARY.urgent}</span>
              )}
              {WEEK_SUMMARY.inProgress > 0 && <span> · In progress {WEEK_SUMMARY.inProgress}</span>}
              {WEEK_SUMMARY.posted > 0 && (
                <span className="text-green-600"> · Posted {WEEK_SUMMARY.posted}</span>
              )}
              {WEEK_SUMMARY.conflicts > 0 && (
                <span className="text-orange-500"> · Conflicts {WEEK_SUMMARY.conflicts}</span>
              )}
            </p>
            <ul className="space-y-2 overflow-y-auto text-body-sm">
              {MOCK_ACTIVITY.map((item) => (
                <li key={item.id} className="border-b border-border/50 pb-2 last:border-0">
                  <p>{item.message}</p>
                  <p className="text-meta text-muted-foreground">{item.timestamp}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-white/95 shadow-sm backdrop-blur dark:bg-slate-900/95">
        <h3 className="px-4 py-3 text-label font-semibold">Next 7 Days</h3>
        <ul className="flex-1 space-y-2 overflow-y-auto px-4 pb-4">
          {upcoming.length === 0 ? (
            <li className="text-meta text-muted-foreground">No tasks in the next 7 days</li>
          ) : (
            upcoming.map((task) => (
              <li
                key={task.id}
                className={cn(
                  'rounded-lg border border-border/60 p-2',
                  task.urgency === 'overdue' && 'bg-red-500/5',
                  task.urgency === 'urgent' && 'bg-orange-500/5',
                )}
              >
                <div className="flex items-center gap-2 text-label">
                  <span className={cn('h-2 w-2 rounded-full', statusDotClass(task.urgency, task.status))} />
                  <span>{task.channel}</span>
                </div>
                <p className="text-meta text-muted-foreground">
                  {task.formatLabel} · {task.brand} · {task.phase === 'post' ? 'Posting' : 'Generation'}
                </p>
                <p className="text-meta mt-1 flex justify-between">
                  <span className="capitalize">{task.status.replace('_', ' ')}</span>
                  <span>{task.countdown}</span>
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}

export function ScheduleCalendarPage() {
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('week');
  const [rowMode, setRowMode] = useState<RowMode>('split');
  const [switchPhase, setSwitchPhase] = useState<Phase>('post');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [capacityOpen, setCapacityOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<BrandCode[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [capacity, setCapacity] = useState<CapacitySettings>(DEFAULT_CAPACITY);
  const [syncDismissed, setSyncDismissed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(anchorDate, { weekStartsOn: 1 });

  const days = useMemo(() => {
    if (view === 'day') return [anchorDate];
    if (view === 'week') {
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
    const monthStart = startOfMonth(anchorDate);
    const monthEnd = endOfMonth(anchorDate);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [anchorDate, view, weekStart, weekEnd]);

  const rangeLabel = useMemo(() => {
    if (view === 'day') return format(anchorDate, 'MMM d, yyyy');
    if (view === 'week') return `${format(weekStart, 'MMM d')}: ${format(weekEnd, 'MMM d, yyyy')}`;
    return format(anchorDate, 'MMMM yyyy');
  }, [anchorDate, view, weekStart, weekEnd]);

  const filteredTasks = useMemo(() => {
    if (selectedBrands.length === 0) return MOCK_TASKS;
    return MOCK_TASKS.filter((t) => selectedBrands.includes(t.brand));
  }, [selectedBrands]);

  const tasksByDayPhase = (date: Date, phase: Phase) =>
    filteredTasks.filter(
      (t) => t.phase === phase && isSameDay(new Date(t.publishingDate), date),
    );

  const navigate = (dir: -1 | 1) => {
    if (view === 'day') setAnchorDate((d) => addDays(d, dir));
    else if (view === 'week') setAnchorDate((d) => addWeeks(d, dir));
    else setAnchorDate((d) => addMonths(d, dir));
  };

  const filterCount = selectedBrands.length;

  return (
    <div className="mx-auto flex h-[calc(100dvh-10rem)] max-w-[1600px] flex-col gap-3 lg:h-[calc(100dvh-7.75rem)]">
      {!syncDismissed && (
        <div className="flex shrink-0 items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-body-sm">
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-600" />
            Calendar sync pending: some tasks may be out of date.
          </span>
          <button type="button" onClick={() => setSyncDismissed(true)} className="text-meta font-semibold">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)} aria-label="Previous">
          <ChevronLeft size={16} />
        </Button>
        <span className="min-w-40 text-center text-label font-semibold">{rangeLabel}</span>
        <Button variant="outline" size="icon" onClick={() => navigate(1)} aria-label="Next">
          <ChevronRight size={16} />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setAnchorDate(new Date())}>
          Today
        </Button>

        <div className="flex rounded-lg border border-border bg-muted/50 p-0.5">
          {(['day', 'week', 'month'] as CalendarView[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-3 py-1 text-meta font-semibold capitalize transition-colors',
                view === v ? 'bg-brand-orange text-white' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {v}
            </button>
          ))}
        </div>

        {filteredTasks.length > 0 && (
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            Clear all tasks ({filteredTasks.length})
          </Button>
        )}

        <Link
          href="/dashboard/social-media-management/topic-planner"
          className="ml-auto inline-flex items-center gap-1 text-label font-semibold text-brand-orange hover:underline"
        >
          <ClipboardList size={14} /> Topic Planner
        </Link>

        <Button variant="outline" size="sm" onClick={() => setFiltersOpen((v) => !v)} className="gap-1">
          <Filter size={14} />
          Filter
          {filterCount > 0 && (
            <span className="rounded-full bg-brand-orange px-1.5 text-[10px] text-white">{filterCount}</span>
          )}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setCapacityOpen((v) => !v)}
        className="shrink-0 text-left text-meta font-semibold text-brand-orange hover:underline"
      >
        {capacityOpen ? '▾' : '▸'} Capacity settings
      </button>

      {capacityOpen && (
        <div className="shrink-0 rounded-xl border border-border bg-white/95 p-4 dark:bg-slate-900/95">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ['maxGenerationTasksPerDay', 'Max generation tasks / day'],
                ['maxPublishingTasksPerDay', 'Max publishing tasks / day'],
                ['maxGenerationWorkloadPerDay', 'Max generation workload / day'],
                ['maxPublishingWorkloadPerDay', 'Max publishing workload / day'],
                ['maxShortVideoPerDay', 'Max short-video / day'],
                ['maxLongFormPerDay', 'Max long-form / day'],
                ['maxAudioVideoPerDay', 'Max audio/video / day'],
                ['defaultLeadTimeDays', 'Default lead time (days)'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="text-meta">
                {label}
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-2 py-1 text-sm"
                  value={capacity[key]}
                  onChange={(e) =>
                    setCapacity((c) => ({ ...c, [key]: Number(e.target.value) || 0 }))
                  }
                />
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-meta">
            {(
              [
                ['preferWeekdays', 'Prefer weekdays'],
                ['allowSaturday', 'Allow Saturday'],
                ['excludeSunday', 'Exclude Sunday'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={capacity[key]}
                  onChange={(e) => setCapacity((c) => ({ ...c, [key]: e.target.checked }))}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCapacity(DEFAULT_CAPACITY)}>
              Reset
            </Button>
            <Button size="sm">Save</Button>
            <Button variant="ghost" size="sm" onClick={() => setCapacityOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {filtersOpen && (
        <div className="shrink-0 rounded-xl border border-border bg-white/95 p-4 dark:bg-slate-900/95">
          <div className="mb-3 flex items-center justify-between">
            <button type="button" className="text-meta text-red-600" onClick={() => setSelectedBrands([])}>
              Clear all ({filterCount})
            </button>
            <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <X size={16} />
            </button>
          </div>
          <p className="text-label mb-2">Brand</p>
          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => {
              const active = selectedBrands.includes(brand);
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() =>
                    setSelectedBrands((prev) =>
                      active ? prev.filter((b) => b !== brand) : [...prev, brand],
                    )
                  }
                  className={cn(
                    'rounded-full px-3 py-1 text-meta font-bold transition-colors',
                    active ? 'text-white' : 'border border-border bg-muted/50',
                  )}
                  style={active ? { background: BRAND_COLORS[brand] } : undefined}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex min-h-0 flex-1 gap-4">
        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-white/95 dark:bg-slate-900/95">
          <button
            type="button"
            className="absolute right-2 top-2 z-10 rounded-lg border border-border bg-background px-2 py-1 text-meta xl:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            Activity
          </button>

          {view === 'month' ? (
            <div className="grid flex-1 auto-rows-fr grid-cols-7 gap-px overflow-auto bg-muted/50 p-2">
              {days.map((day) => {
                const dayTasks = filteredTasks.filter((t) =>
                  isSameDay(new Date(t.publishingDate), day),
                );
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'min-h-[120px] bg-background p-1',
                      isToday(day) && 'ring-2 ring-brand-orange/40',
                    )}
                  >
                    <p className={cn('text-meta mb-1 font-semibold', isToday(day) && 'text-brand-orange')}>
                      {format(day, 'd')}
                    </p>
                    {dayTasks.slice(0, 4).map((task) => (
                      <TaskCard key={task.id} task={task} compact active={activeTaskId === task.id} onClick={() => setActiveTaskId(task.id)} />
                    ))}
                    {dayTasks.length > 4 && (
                      <p className="text-meta text-muted-foreground">+{dayTasks.length - 4} more</p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-auto">
              <div
                className="sticky top-0 z-10 grid border-b border-border bg-background/95 backdrop-blur"
                style={{
                  gridTemplateColumns: `4.5rem repeat(${days.length}, minmax(120px, 1fr))`,
                }}
              >
                <div className="border-r border-border p-2">
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => setRowMode('split')}
                      className={cn('text-meta rounded px-1', rowMode === 'split' && 'bg-brand-orange/10 text-brand-orange')}
                    >
                      Split
                    </button>
                    <button
                      type="button"
                      onClick={() => setRowMode('switch')}
                      className={cn('text-meta rounded px-1', rowMode === 'switch' && 'bg-brand-orange/10 text-brand-orange')}
                    >
                      Switch
                    </button>
                  </div>
                  {rowMode === 'switch' && (
                    <div className="mt-2 flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => setSwitchPhase('post')}
                        className={cn('text-meta rounded px-1', switchPhase === 'post' && 'bg-slate-500/10')}
                      >
                        Post
                      </button>
                      <button
                        type="button"
                        onClick={() => setSwitchPhase('generation')}
                        className={cn('text-meta rounded px-1', switchPhase === 'generation' && 'bg-amber-500/10')}
                      >
                        Gen
                      </button>
                    </div>
                  )}
                </div>
                {days.map((day, i) => (
                  <div key={day.toISOString()} className="border-r border-border p-2 text-center last:border-r-0">
                    <p className="text-meta text-muted-foreground">{WEEKDAY_LABELS[i] ?? format(day, 'EEE')}</p>
                    <span
                      className={cn(
                        'mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-label font-bold',
                        isToday(day) && 'bg-brand-orange text-white',
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>
                ))}
              </div>

              {(rowMode === 'split' ? (['post', 'generation'] as Phase[]) : [switchPhase]).map((phase) => (
                <div
                  key={phase}
                  className="grid min-h-[72px] flex-1 border-b border-border"
                  style={{
                    gridTemplateColumns: `4.5rem repeat(${days.length}, minmax(120px, 1fr))`,
                    height: rowMode === 'split' ? (phase === 'post' ? '42%' : '58%') : undefined,
                  }}
                >
                  <div
                    className={cn(
                      'flex items-center justify-center border-r border-border text-label font-bold',
                      phase === 'post' ? 'text-slate-600' : 'text-amber-600',
                    )}
                  >
                    {phase === 'post' ? 'Post' : 'Gen'}
                  </div>
                  {days.map((day) => {
                    const cellTasks = tasksByDayPhase(day, phase);
                    return (
                      <div
                        key={`${phase}-${day.toISOString()}`}
                        className={cn(
                          'relative min-h-[72px] border-r border-border p-1 last:border-r-0',
                          isToday(day) && 'bg-brand-orange/5 ring-1 ring-inset ring-brand-orange/20',
                        )}
                      >
                        <p className="text-meta text-center text-muted-foreground">{cellTasks.length || '. '}</p>
                        <div className="mt-1 space-y-1">
                          {cellTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              active={activeTaskId === task.id}
                              onClick={() => setActiveTaskId(task.id)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden xl:flex">
          <RightSidebar tasks={filteredTasks} />
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[70dvh] overflow-auto rounded-t-2xl border border-border bg-background p-4">
            <div className="mb-2 flex justify-end">
              <button type="button" onClick={() => setDrawerOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <RightSidebar tasks={filteredTasks} />
          </div>
        </div>
      )}
    </div>
  );
}