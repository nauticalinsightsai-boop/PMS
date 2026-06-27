'use client';

import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  HelpCircle,
  Library,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  FIELD_KEYS,
  defaultFaqPageConfig,
  parseFaqPageConfig,
  type FaqPageConfig,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';
import { getPublicSitePage } from '@/constants/publicSitePages';
import { cn } from '@/lib/utils';

type FaqItem = FaqPageConfig['items'][number];

type BuiltInFaq = { id: string; clusterId: string; question: string };

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-brand-orange/40 focus-visible:ring-2 focus-visible:ring-brand-orange/30';
const labelClass = 'text-[11px] font-bold uppercase tracking-wide text-muted-foreground';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

export function FaqPageEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(FIELD_KEYS.FAQ_PAGE_CONFIG, defaultFaqPageConfig, parseFaqPageConfig);

  const visibleCount = config.items.filter((i) => i.visible).length;

  const setHero = (patch: Partial<FaqPageConfig['hero']>) => {
    setConfig((c) => ({ ...c, hero: { ...c.hero, ...patch } }));
  };

  const updateItem = (idx: number, patch: Partial<FaqItem>) => {
    setConfig((c) => {
      const items = [...c.items];
      items[idx] = { ...items[idx], ...patch };
      return { ...c, items };
    });
  };

  const addItem = () => {
    setConfig((c) => ({
      ...c,
      items: [
        ...c.items,
        {
          id: `faq-${Date.now()}`,
          question: '',
          answer: '',
          visible: true,
          sortOrder: c.items.length,
        },
      ],
    }));
  };

  const removeItem = (idx: number) => {
    const item = config.items[idx];
    if (item && (item.question.trim() || item.answer.trim())) {
      if (!window.confirm(`Remove "${item.question || 'this FAQ'}"?`)) return;
    }
    setConfig((c) => ({
      ...c,
      items: c.items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, sortOrder: i })),
    }));
  };

  const moveItem = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= config.items.length) return;
    setConfig((c) => {
      const items = [...c.items];
      [items[idx], items[target]] = [items[target], items[idx]];
      return { ...c, items: items.map((it, i) => ({ ...it, sortOrder: i })) };
    });
  };

  // Built-in (static) site FAQs — fetched from the public snapshot so the admin can hide any.
  const [builtIn, setBuiltIn] = React.useState<BuiltInFaq[]>([]);
  const [builtInSearch, setBuiltInSearch] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;
    fetch('/faq.json', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { items?: BuiltInFaq[] } | null) => {
        if (cancelled || !data?.items) return;
        setBuiltIn(
          data.items.map((it) => ({
            id: it.id,
            clusterId: it.clusterId,
            question: it.question,
          })),
        );
      })
      .catch(() => {
        /* non-fatal: the section just stays empty */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hiddenIds = React.useMemo(
    () => new Set(config.hiddenBuiltInIds ?? []),
    [config.hiddenBuiltInIds],
  );

  const toggleHiddenBuiltIn = (id: string) => {
    setConfig((c) => {
      const current = new Set(c.hiddenBuiltInIds ?? []);
      if (current.has(id)) current.delete(id);
      else current.add(id);
      return { ...c, hiddenBuiltInIds: Array.from(current) };
    });
  };

  const filteredBuiltIn = React.useMemo(() => {
    const q = builtInSearch.trim().toLowerCase();
    if (!q) return builtIn;
    return builtIn.filter(
      (f) => f.question.toLowerCase().includes(q) || f.clusterId.toLowerCase().includes(q),
    );
  }, [builtIn, builtInSearch]);

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.FAQ_PAGE_CONFIG}
      title="FAQ page"
      editorDescription={getPublicSitePage('faq')?.editorDescription}
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      loadError={loadError}
      lastSynced={updatedAt}
      publicPreviewPath="/faq"
    >
      <div className="space-y-6">
        {/* Header */}
        <GlassCard className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Page header</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Badge, title, and subtitle at the top of /faq.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Badge / eyebrow">
              <input
                value={config.hero.badge}
                onChange={(e) => setHero({ badge: e.target.value })}
                placeholder="Optional eyebrow"
                className={inputClass}
              />
            </Field>
            <Field label="Page title">
              <input
                value={config.hero.title}
                onChange={(e) => setHero({ title: e.target.value })}
                placeholder="Frequently Asked Questions"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="Subtitle">
            <textarea
              value={config.hero.subtitle}
              onChange={(e) => setHero({ subtitle: e.target.value })}
              className={cn(inputClass, 'h-20 resize-y leading-relaxed')}
            />
          </Field>
        </GlassCard>

        {/* FAQ items */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <HelpCircle className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">FAQ items</h3>
                <p className="text-xs text-muted-foreground">
                  {config.items.length} total · {visibleCount} shown on the page
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-2 text-sm font-bold text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add FAQ
            </button>
          </div>

          <Field label="Section heading (shown above your FAQs)">
            <input
              value={config.sectionTitle}
              onChange={(e) => setConfig((c) => ({ ...c, sectionTitle: e.target.value }))}
              placeholder="Common questions"
              className={inputClass}
            />
          </Field>

          {config.items.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/15 py-10 text-center text-sm text-muted-foreground">
              No custom FAQs yet. Click <span className="font-semibold text-foreground">Add FAQ</span> to create one.
            </p>
          ) : (
            <div className="space-y-4">
              {config.items.map((item, idx) => (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 space-y-3',
                    !item.visible && 'opacity-70',
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Question {idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateItem(idx, { visible: !item.visible })}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md border px-2 py-1.5 text-xs font-semibold transition-colors',
                          item.visible
                            ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'border-white/10 bg-white/5 text-muted-foreground',
                        )}
                      >
                        {item.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {item.visible ? 'Shown' : 'Hidden'}
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Move up"
                        className="rounded-md border border-white/10 p-1.5 text-muted-foreground hover:border-brand-orange/40 hover:text-brand-orange disabled:opacity-40"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveItem(idx, 1)}
                        disabled={idx === config.items.length - 1}
                        aria-label="Move down"
                        className="rounded-md border border-white/10 p-1.5 text-muted-foreground hover:border-brand-orange/40 hover:text-brand-orange disabled:opacity-40"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="ml-1 inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Remove
                      </button>
                    </div>
                  </div>
                  <Field label="Question">
                    <input
                      value={item.question}
                      onChange={(e) => updateItem(idx, { question: e.target.value })}
                      placeholder="e.g. How long is PMP preparation?"
                      className={cn(inputClass, 'font-semibold')}
                    />
                  </Field>
                  <Field label="Answer">
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateItem(idx, { answer: e.target.value })}
                      placeholder="Write the answer. Use [text](/link) for links and a leading • for bullet lines."
                      className={cn(inputClass, 'h-28 resize-y leading-relaxed')}
                    />
                  </Field>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Built-in site FAQs (hide any) */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Library className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Built-in site FAQs</h3>
                <p className="text-xs text-muted-foreground">
                  {builtIn.length} built-in · {hiddenIds.size} hidden · hide any you don&apos;t want on /faq
                </p>
              </div>
            </div>
          </div>

          {builtIn.length === 0 ? (
            <p className="rounded-xl border border-dashed border-white/15 py-8 text-center text-sm text-muted-foreground">
              Loading the site&apos;s built-in FAQs… (publish the site once if this stays empty)
            </p>
          ) : (
            <>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={builtInSearch}
                  onChange={(e) => setBuiltInSearch(e.target.value)}
                  placeholder="Search built-in FAQs to hide…"
                  className={cn(inputClass, 'pl-9')}
                />
              </div>
              <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1">
                {filteredBuiltIn.map((faq) => {
                  const hidden = hiddenIds.has(faq.id);
                  return (
                    <div
                      key={faq.id}
                      className={cn(
                        'flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5',
                        hidden && 'opacity-60',
                      )}
                    >
                      <div className="min-w-0">
                        <p className={cn('text-sm text-foreground', hidden && 'line-through')}>
                          {faq.question}
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                          {faq.clusterId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleHiddenBuiltIn(faq.id)}
                        className={cn(
                          'inline-flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                          hidden
                            ? 'border-white/10 bg-white/5 text-muted-foreground hover:text-foreground'
                            : 'border-red-500/30 text-red-500 hover:bg-red-500/10',
                        )}
                      >
                        {hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {hidden ? 'Show' : 'Hide'}
                      </button>
                    </div>
                  );
                })}
                {filteredBuiltIn.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No FAQs match your search.</p>
                ) : null}
              </div>
            </>
          )}
        </GlassCard>
      </div>
    </SiteDocumentEditorShell>
  );
}
